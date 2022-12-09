import Database from 'better-sqlite3';

let db;
const queries = {};

export function init_db () {
    db = new Database(process.env.DB_PATH);
    db.loadExtension(process.env.SQLITE_EXT);
    db.loadExtension(process.env.SNOWBALL_EXT);
    queries.searchSN = db.prepare(`SELECT signs.* FROM params
        JOIN signs ON docid=number
        WHERE params MATCH ?
        ORDER BY snrank(matchinfo(params, 'pxl')) DESC
        LIMIT ?`);
    queries.searchSpa = db.prepare(`SELECT signs.* FROM spanish
        JOIN signs ON spanish.rowid=signs.number
        WHERE spanish MATCH ?
        ORDER BY rank
        LIMIT ?`);
    queries.getSign = db.prepare("SELECT * FROM signs WHERE number = ?");
}

function processSN (query) {
    return '"' + query
      .replaceAll('*', 't')
      .replaceAll(':', '" "')
    +'"';
}

export function searchSN (query, limit) {
    return queries.searchSN.all(processSN(query), limit);
}

export function searchSpa (query, limit) {
    return queries.searchSpa.all(query, limit);
}

export function getSign (number) {
    return queries.getSign.get(number);
}
