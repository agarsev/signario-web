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
    await elasticsearch.indices.create({ index: 'signs', mappings: {
        properties: {
            gloss: { type: 'text', analyzer: 'spanish', copy_to: 'oral' },
            definitions: { type: 'nested', properties: {
                content: { type: 'text', analyzer: 'spanish', copy_to: 'oral' }
            }},
            // search by oral language gloss or definitions
            oral: { type: 'text', analyzer: 'spanish' }
        }
    }});
    const signs = db.prepare(`SELECT * FROM signs`);
    const definitions = db.prepare(`SELECT content FROM attachments
        WHERE sign = ? AND type = 'definition'
        ORDER BY id ASC`);
    for (const s of signs.all()) {
        s.definitions = definitions.all(s.number);
        elasticsearch.index({
            index: 'signs',
            id: s.number,
            document: s
        });
    }
}

export async function searchSN (query, limit) {
    return [];
}

export async function searchSpa (query, limit) {
    const res = await elasticsearch.search({
        query: { match: { oral: { query, fuzziness: "1" }}},
        size: limit,
    });
    return res.hits.hits.map(doc => doc._source);
}

export async function getSign (number) {
    try {
        const s = await elasticsearch.get({ index: 'signs', id: number });
        return s._source;
    } catch (error) {
        return null;
    }
}
