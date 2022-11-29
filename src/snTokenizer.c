/*
 * Tokenizer for signotation adapted to FTS in sqlite3.
 * 
 * @author  Antonio F. G. Sevilla <antonio@garciasevilla.com>
 * @date    2022-11-28
 *
 * For skipgram searches, clients should:
 * Search clients should 
 * - split on ":"
 * - substitute and split "[" for "H2" and "(" for "ARC"
 * - remove "]" and ")"
 * - translate "*" to something else
 */

#include <string.h>
#include <stdbool.h>
#include <sqlite3.h>
#include <sqlite3ext.h>
SQLITE_EXTENSION_INIT1

// FTS3_H

typedef struct sqlite3_tokenizer_module sqlite3_tokenizer_module;

typedef struct sqlite3_tokenizer {
  const sqlite3_tokenizer_module *pModule;  /* The module for this tokenizer */
} sqlite3_tokenizer;

typedef struct sqlite3_tokenizer_cursor {
  sqlite3_tokenizer *pTokenizer;       /* Tokenizer for this cursor. */
} sqlite3_tokenizer_cursor;

struct sqlite3_tokenizer_module {
    int iVersion;
    int (*xCreate)(
            int argc,                           /* Size of argv array */
            const char *const*argv,             /* Tokenizer argument strings */
            sqlite3_tokenizer **ppTokenizer     /* OUT: Created tokenizer */
            );
    int (*xDestroy)(sqlite3_tokenizer *pTokenizer);
    int (*xOpen)(
            sqlite3_tokenizer *pTokenizer,       /* Tokenizer object */
            const char *pInput, int nBytes,      /* Input buffer */
            sqlite3_tokenizer_cursor **ppCursor  /* OUT: Created tokenizer cursor */
            );
    int (*xClose)(sqlite3_tokenizer_cursor *pCursor);
    int (*xNext)(
            sqlite3_tokenizer_cursor *pCursor,   /* Tokenizer cursor */
            const char **ppToken, int *pnBytes,  /* OUT: Normalized text for token */
            int *piStartOffset,  /* OUT: Byte offset of token in input buffer */
            int *piEndOffset,    /* OUT: Byte offset of end of token in input buffer */
            int *piPosition      /* OUT: Number of tokens returned before this one */
            );
    int (*xLanguageid)(sqlite3_tokenizer_cursor *pCsr, int iLangid);
};

// END FTS3_H

typedef struct sn_tokenizer {
    sqlite3_tokenizer base;
} sn_tokenizer;

#define BUFFER_SIZE 12 // There shouldn't be tokens longer than this
typedef struct sn_tokenizer_cursor {
    sqlite3_tokenizer_cursor base;
    const char *input; int inputsize;
    int index; int tokenstart; int ntoken;
    char buffer[BUFFER_SIZE]; int tail;
    bool repeat;
} sn_tokenizer_cursor;

static int snCreate(int argc, const char * const *argv, sqlite3_tokenizer **ppTokenizer) {
    sn_tokenizer *t = sqlite3_malloc(sizeof(*t));
    if (t==NULL) return SQLITE_NOMEM;
    memset(t, 0, sizeof(*t));
    *ppTokenizer = &t->base;
    return SQLITE_OK;
}

static int snDestroy(sqlite3_tokenizer *pTokenizer){
    sqlite3_free(pTokenizer);
    return SQLITE_OK;
}

static int snOpen(sqlite3_tokenizer *pTokenizer, const char *pInput, int nBytes, sqlite3_tokenizer_cursor **ppCursor) {

    sn_tokenizer_cursor *cursor = sqlite3_malloc(sizeof(*cursor));
    if (cursor==NULL) return SQLITE_NOMEM;
    memset(cursor, 0, sizeof(*cursor));

    cursor->input = pInput;
    if (pInput==NULL) {
        cursor->inputsize = 0;
    } else if (nBytes<0) {
        cursor->inputsize = strlen(pInput);
    } else {
        cursor->inputsize = nBytes;
    }

    *ppCursor = &cursor->base;
    return SQLITE_OK;
}

static int snClose(sqlite3_tokenizer_cursor *pCursor){
    //sn_tokenizer_cursor *cursor = (sn_tokenizer_cursor *) pCursor;
    //sqlite3_free(cursor->buffer);
    sqlite3_free(pCursor);
    return SQLITE_OK;
}

static bool maybeOutput(sn_tokenizer_cursor *cursor, int *pnBytes,
        int *piStartOffset, int *piEndOffset, int *piPosition) {
    if (cursor->tail<1) return false;
    *piStartOffset = cursor->tokenstart;
    if (!cursor->repeat) cursor->tokenstart = cursor->index+1;
    cursor->buffer[cursor->tail] = '\0';
    *pnBytes = cursor->tail;
    cursor->tail = 0;
    *piEndOffset = cursor->index>cursor->tokenstart?cursor->index:cursor->tokenstart+1;
    *piPosition = cursor->ntoken++;
    return true;
}

static bool delim(char c) {
    return c == ':' || c == ' ' || c == ']' || c == ')';
}

static bool minusSpace(char c) {
    return c == 'h' || c == 'l' || c == 'f' || c == 'b' || c == 'y' || c == 'x';
}

static bool mayusSpace(char c) {
    return c == 'H' || c == 'L' || c == 'F' || c == 'B' || c == 'Y' || c == 'X';
}

static bool ignored(char c) {
    return c == ',' || c == '_';
}

static int snNext(sqlite3_tokenizer_cursor *pCursor,
        const char **ppToken, int *pnBytes,
        int *piStartOffset, int *piEndOffset, int *piPosition) {

    sn_tokenizer_cursor *cursor = (sn_tokenizer_cursor *) pCursor;
    *ppToken = cursor->buffer;
    bool shouldEmit = false;

    while (cursor->index < cursor->inputsize) {
        const char c = cursor->input[cursor->index];

        if (delim(c)) {
            shouldEmit = maybeOutput(cursor, pnBytes, piStartOffset, piEndOffset, piPosition);
        } else if (c == '[' || c == '(') {
            if (!cursor->repeat) {
                cursor->repeat = true;
            } else if (c == '[') {
                #pragma GCC diagnostic push
                #pragma GCC diagnostic ignored "-Wstringop-truncation"
                cursor->repeat = false;
                strncpy(cursor->buffer, "H2", 2);
                cursor->tail = 2;
            } else if (c == '(') {
                cursor->repeat = false;
                strncpy(cursor->buffer, "ARC", 3);
                cursor->tail = 3;
                #pragma GCC diagnostic pop
            }
            shouldEmit = maybeOutput(cursor, pnBytes, piStartOffset, piEndOffset, piPosition);
        } else if (ignored(c)) {
            // pass
        } else if (cursor->tail>0 && minusSpace(c)) {
            // split Hx orientation into H. and .x
            if (!cursor->repeat && mayusSpace(cursor->buffer[cursor->tail-1])) {
                cursor->repeat = true;
                cursor->buffer[cursor->tail++] = '.';
                shouldEmit = maybeOutput(cursor, pnBytes, piStartOffset, piEndOffset, piPosition);
            } else if (cursor->repeat) {
                cursor->repeat = false;
                cursor->buffer[0] = '.';
                cursor->buffer[1] = c;
                cursor->tail = 2;
            } else {
                cursor->buffer[cursor->tail++] = c;
            }
        } else if (cursor->tail<BUFFER_SIZE) {
            cursor->buffer[cursor->tail++] = c;
        }

        if (!cursor->repeat) cursor->index++;
        if (shouldEmit) return SQLITE_OK;
    }
    if (maybeOutput(cursor, pnBytes, piStartOffset, piEndOffset, piPosition)) return SQLITE_OK;
    return SQLITE_DONE;
}

static const sqlite3_tokenizer_module tokenizer = {
    0, snCreate, snDestroy, snOpen, snClose, snNext, NULL
};

static int registerTokenizer(sqlite3 *db, char *zName, const sqlite3_tokenizer_module *p) {
    int rc;
    sqlite3_stmt *pStmt;
    const char *zSql = "SELECT fts3_tokenizer(?1, ?2)";

    rc = sqlite3_prepare_v2(db, zSql, -1, &pStmt, NULL);
    if( rc!=SQLITE_OK ) return rc;

    sqlite3_bind_text(pStmt, 1, zName, -1, SQLITE_STATIC);
    sqlite3_bind_blob(pStmt, 2, &p, sizeof(p), SQLITE_STATIC);
    sqlite3_step(pStmt);

    return sqlite3_finalize(pStmt);
}

// USE: snrank(matchinfo(<table>, 'pxl'))
static void snRank(sqlite3_context *pCtx, int nVal, sqlite3_value **apVal) {
    unsigned int *matchinfo = (unsigned int *) sqlite3_value_blob(apVal[0]);
    int segments = matchinfo[0]; // p
    int i=0;
    double score = 0.0;
    for (i=1; i<1+3*segments; i+=3) { // x
        int termf = matchinfo[i];
        int totalf = matchinfo[i+1];
        score += (double) termf / (double) totalf;
    }
    double len = (double) matchinfo[i]; // l
    sqlite3_result_double(pCtx, score / len);
}

int sqlite3_extension_init(sqlite3 *db, char **error, const sqlite3_api_routines *api) {
    SQLITE_EXTENSION_INIT2(api);
    registerTokenizer(db, "signotation", &tokenizer);
    sqlite3_create_function(db, "snrank", 1, SQLITE_UTF8 | SQLITE_DETERMINISTIC,
            NULL, snRank, NULL, NULL);
    return SQLITE_OK;
}
