import Database from 'better-sqlite3';

import { Client } from '@elastic/elasticsearch';
export const elasticsearch = new Client({
    node: process.env.ELASTICSEARCH_URL,
    defaultIndex: 'signario',
    auth: {
        username: 'signario',
        password: process.env.ELASTICSEARCH_PASSWORD
    }
})

// Load a new sqlite database of signs into elasticsearch
export async function index_db () {
    const db = new Database(process.env.DB_PATH);
    if (await elasticsearch.indices.exists({ index: 'signario' })) {
        await elasticsearch.indices.delete({ index: 'signario' });
    }
    await elasticsearch.indices.create({
        index: 'signario',
        settings: {
            max_ngram_diff: 2,
            analysis: {
                analyzer: {
                    signotation_segments: {
                        type: 'pattern',
                        pattern: '[: \\[\\]]',
                        lowercase: false
                    },
                    signotation_ngrams: {
                        type: 'custom',
                        char_filter: ['sn_charfilter'],
                        tokenizer: 'sn_tokenizer',
                        filter: []
                    }
                },
                char_filter: {
                    sn_charfilter: {
                        type: "mapping",
                        mappings: [
                            ": =>",
                            "-> => →"
                        ]
                    }
                },
                tokenizer: {
                    sn_tokenizer: {
                        type: "ngram",
                        min_gram: 1,
                        max_gram: 3,
                        token_chars: ['letter','digit','punctuation','symbol']
                    }
                }
            }
        },
        mappings: {
            dynamic: false,
            properties: {
                notation: { type: 'text', analyzer: 'signotation_segments', copy_to: 'sngrams' },
                sngrams: { type: 'text', analyzer: 'signotation_ngrams' },
                gloss: { type: 'text', analyzer: 'spanish', copy_to: 'oral' },
                definitions: { type: 'nested', properties: {
                    content: { type: 'text', analyzer: 'spanish', copy_to: 'oral' }
                }},
                // search by oral language gloss or definitions
                oral: { type: 'text', analyzer: 'spanish' }
            }
        }
    });
    const signs = db.prepare(`SELECT * FROM signs`);
    const definitions = db.prepare(`SELECT content FROM attachments
        WHERE sign = ? AND type = 'definition'
        ORDER BY id ASC`);
    for (const s of signs.all()) {
        s.definitions = definitions.all(s.number);
        elasticsearch.index({
            index: 'signario',
            id: s.number,
            document: s
        });
    }
    db.close();
}

export async function searchSN (query, limit) {
    const res = await elasticsearch.search({
        query: { multi_match: {
            query,
            fields: [ 'notation', 'sngrams' ],
            type: 'most_fields',
            fuzziness: '1'
        }},
        size: limit,
    });
    return res.hits.hits.map(doc => doc._source);
}

export async function searchSpa (query, limit) {
    const res = await elasticsearch.search({
        query: { match: { oral: { query, fuzziness: '1' }}},
        size: limit,
    });
    return res.hits.hits.map(doc => doc._source);
}

export async function getSign (number) {
    try {
        const s = await elasticsearch.get({ index: 'signario', id: number });
        return s._source;
    } catch (error) {
        return null;
    }
}
