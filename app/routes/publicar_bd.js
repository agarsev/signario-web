import { json } from "@remix-run/node";
import { writeFile } from "node:fs/promises";
import Database from 'better-sqlite3';

import { init_db } from "../db.server.js";

export async function action ({ request }) {
    const body = await request.formData();
    if (body.get("UPLOAD_TOKEN") != process.env.UPLOAD_TOKEN) {
        throw json("Not Authorized", { status: 403 });
    }
    await writeFile(process.env.DB_PATH, body.get("DATABASE").stream());
    createFTS();
    init_db();
    return json("OK");
}

function createFTS () {
    const db = new Database(process.env.DB_PATH);
    db.loadExtension(process.env.SQLITE_EXT);
    db.loadExtension(process.env.SNOWBALL_EXT);
    db.exec(`DROP TABLE IF EXISTS params;
    CREATE VIRTUAL TABLE params USING fts4(tokenize=signotation);
    INSERT INTO params(docid, content)
        SELECT number as docid,
        REPLACE(notation, '*', 't') as content FROM signs
            WHERE notation != '';
    `);
    db.exec(`DROP TABLE IF EXISTS spanish;
    CREATE VIRTUAL TABLE spanish USING fts5(gloss, content='', tokenize='snowball spanish');
    INSERT INTO spanish(rowid, gloss)
        SELECT number as rowid, gloss FROM signs
            WHERE gloss != '';
    `);
}
