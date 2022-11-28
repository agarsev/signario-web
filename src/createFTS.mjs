import Database from 'better-sqlite3';
const db = new Database('signario.db');

db.loadExtension('./snTokenizer.so');

db.exec(`DROP TABLE IF EXISTS params;
CREATE VIRTUAL TABLE params USING fts4(
    matchinfo="fts3",
    tokenize=signotation
);
INSERT INTO params(docid, content)
SELECT number as docid, notation as content FROM signs
    WHERE notation != '';
`);
