import Database from 'better-sqlite3';

import { Client } from '@elastic/elasticsearch';
export const elasticsearch = new Client({
    node: 'http://127.0.0.1:9200',
})

/*
export function init_db () {
    db = new Database(process.env.DB_PATH);
    db.loadExtension(process.env.SQLITE_EXT);
    db.loadExtension(process.env.SNOWBALL_EXT);
    queries.searchSN = db.prepare(`SELECT signs.*, heading FROM params
        JOIN signs ON docid=number
        JOIN sign_headings USING (number)
        WHERE params MATCH ?
        ORDER BY snrank(matchinfo(params, 'pxl')) DESC
        LIMIT ?`);
    queries.searchSpa = db.prepare(`SELECT signs.*, heading FROM spanish
        JOIN signs ON spanish.rowid=signs.number
        JOIN sign_headings USING (number)
        WHERE spanish MATCH ?
        ORDER BY rank
        LIMIT ?`);
    queries.getSign = db.prepare("SELECT * FROM signs WHERE number = ?");
    queries.getDefinitions = db.prepare(`SELECT content FROM attachments
        WHERE sign = ? AND type = 'definition'
        ORDER BY id ASC`);
}

function processSN (query) {
    return '"' + query
      .replaceAll('*', 't')
      .replaceAll(':', '" "')
    +'"';
}
*/

// Load a new sqlite database of signs into elasticsearch
export async function index_db () {
    const db = new Database(process.env.DB_PATH);
    if (await elasticsearch.indices.exists({ index: 'signs' })) {
        await elasticsearch.indices.delete({ index: 'signs' });
    }
    await elasticsearch.indices.create({ index: 'signs' });
    const signs = db.prepare(`SELECT * FROM signs`);
    const definitions = db.prepare(`SELECT content FROM attachments
        WHERE sign = ? AND type = 'definition'
        ORDER BY id ASC`);
    for (const s of signs.all()) {
        s.acepciones = definitions.all(s.number);
        elasticsearch.index({
            index: 'signs',
            id: s.number,
            document: s
        });
    }
}

export function searchSN (query, limit) {
    return [];
}

export function searchSpa (query, limit) {
    return [];
}

export async function getSign (number) {
    try {
        const s = await elasticsearch.get({ index: 'signs', id: number });
        return s._source;
    } catch (error) {
        return null;
    }
}
