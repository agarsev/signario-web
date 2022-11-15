import Database from 'better-sqlite3';
const db = new Database('signario.db');

db.exec(`DROP TABLE IF EXISTS params;
CREATE VIRTUAL TABLE params USING fts4(
    matchinfo="fts3",
    tokenize=unicode61 "remove_diacritics=0" "tokenchars=!=_*()" "separators=:[]"
);
INSERT INTO params(docid, content)
SELECT number as docid, notation as content FROM signs
    WHERE notation != '';
`);
