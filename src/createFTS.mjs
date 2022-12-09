import Database from 'better-sqlite3';
const db = new Database('signario.db');

db.loadExtension('./snTokenizer.so');

db.exec(`DROP TABLE IF EXISTS params;
CREATE VIRTUAL TABLE params USING fts4(tokenize=signotation);
INSERT INTO params(docid, content)
    SELECT number as docid,
    REPLACE(notation, '*', 't') as content FROM signs
        WHERE notation != '';
`);

db.loadExtension('./fts5-snowball/fts5stemmer.so');

db.exec(`DROP TABLE IF EXISTS spanish;
CREATE VIRTUAL TABLE spanish USING fts5(gloss, content='', tokenize='snowball spanish');
INSERT INTO spanish(rowid, gloss)
    SELECT number as rowid, gloss FROM signs
        WHERE gloss != '';
`);
