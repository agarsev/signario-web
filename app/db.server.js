import Database from 'better-sqlite3';

let db;
const queries = {};

export function init_db () {
    db = new Database(process.env.DB_PATH);
    db.loadExtension(process.env.SQLITE_EXT);
    queries.searchParams = db.prepare(`SELECT signs.* FROM params
        JOIN signs ON docid=number
        WHERE params MATCH ?
        ORDER BY snrank(matchinfo(params, 'pxl')) DESC
        LIMIT 30`);
    queries.getSign = db.prepare("SELECT * FROM signs WHERE number = ?");
}

function processSN (query) {
    return '"' + query
      .replaceAll('*', 't')
      .replaceAll(':', '" "')
    +'"';
}

export function searchParams (query) {
    return queries.searchParams.all(processSN(query));
}

export function getSign (number) {
    return queries.getSign.get(number);
}