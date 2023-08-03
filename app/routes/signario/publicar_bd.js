import { json, redirect } from "@remix-run/node";
import { writeFile } from "fs/promises";

import { index_db } from "../../db.server.js";

export async function action ({ request }) {
    const body = await request.formData();
    if (body.get("UPLOAD_TOKEN") != process.env.UPLOAD_TOKEN) {
        throw json("Not Authorized", { status: 403 });
    }
    // save the database in the server
    await writeFile(process.env.DB_PATH, body.get("DATABASE").stream());
    // create elasticsearch indices
    await index_db();
    return json("OK");
}

export async function loader () {
    return redirect("/");
}
