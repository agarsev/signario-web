/*
 * Tokenizer for signotation adapted to FTS in sqlite3, based on
 * fts3_tokenizer1.c.
 * 
 * @author  Antonio F. G. Sevilla <antonio@garciasevilla.com>
 * @date    2022-11-28
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

#define BUFFER_SIZE 20
typedef struct sn_tokenizer_cursor {
    sqlite3_tokenizer_cursor base;
    const char *input; int inputsize;
    int index; int tokenstart; int ntoken;
    char buffer[BUFFER_SIZE];
    char *head; char *tail;
    //char *buffer; int buffersize;
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
    cursor->head = cursor->tail = cursor->buffer;
    //cursor->index = 0; cursor->tokenstart = 0; cursor->ntoken = 0;
    //cursor->inH2 = 0;
    //cursor->buffer = NULL; cursor->buffersize = 0;

    *ppCursor = &cursor->base;
    return SQLITE_OK;
}

static int snClose(sqlite3_tokenizer_cursor *pCursor){
    //sn_tokenizer_cursor *cursor = (sn_tokenizer_cursor *) pCursor;
    //sqlite3_free(cursor->buffer);
    sqlite3_free(pCursor);
    return SQLITE_OK;
}

bool emitToken(sn_tokenizer_cursor *cursor, int *pnBytes,
        int *piStartOffset, int *piEndOffset, int *piPosition) {
    *piStartOffset = cursor->tokenstart;
    cursor->tokenstart = cursor->index+1;
    if ((cursor->tail-cursor->head)<1) return false;
    *pnBytes = cursor->tail-cursor->buffer;
    cursor->tail = cursor->head;
    *piEndOffset = cursor->index;
    *piPosition = cursor->ntoken++;
    return true;
}

static int snNext(sqlite3_tokenizer_cursor *pCursor,
        const char **ppToken, int *pnBytes,
        int *piStartOffset, int *piEndOffset, int *piPosition) {

    sn_tokenizer_cursor *cursor = (sn_tokenizer_cursor *) pCursor;
    *ppToken = cursor->buffer;
    bool wasThereToken = false;

    while (cursor->index < cursor->inputsize) {
        const char c = cursor->input[cursor->index];

        if (c == ':' || c == ' ') {
            wasThereToken = emitToken(cursor, pnBytes, piStartOffset, piEndOffset, piPosition);
        } else if (c == '[') {
            wasThereToken = emitToken(cursor, pnBytes, piStartOffset, piEndOffset, piPosition);
            cursor->buffer[0]='H';
            cursor->buffer[1]='2';
            cursor->head = cursor->tail = cursor->buffer+2;
        } else if (c == ']') {
            wasThereToken = emitToken(cursor, pnBytes, piStartOffset, piEndOffset, piPosition);
            cursor->head = cursor->tail = cursor->buffer;
        } else if ((cursor->tail-cursor->buffer)<BUFFER_SIZE) {
            *(cursor->tail++) = c;
        }

        cursor->index++;
        if (wasThereToken) return SQLITE_OK;
    }
    if (emitToken(cursor, pnBytes, piStartOffset, piEndOffset, piPosition)) return SQLITE_OK;
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

int sqlite3_extension_init(sqlite3 *db, char **error, const sqlite3_api_routines *api) {
    SQLITE_EXTENSION_INIT2(api);
    registerTokenizer(db, "signotation", &tokenizer);
    return SQLITE_OK;
}
