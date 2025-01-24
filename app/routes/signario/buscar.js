import { json } from "@remix-run/node";

import { searchSN } from "../../db.server.js"; 

const MAX_RESULTS = 20;

export async function loader ({ request }) {
    const params = new URL(request.url).searchParams;
    const notation = params.get("s");
    if (!notation) {
        throw new Response("Bad Request", {status: 400});
    }
    const limit = params.get("limit") || MAX_RESULTS;
    const signs = await searchSN(notation, limit)
    return json({ 
        signs: signs.map(sign_response)
    }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    });
}

function sign_response ({ gloss, notation, number }) {
    return {
        gloss,
        notation,
        number,
        video: `https://griffos.filol.ucm.es/signario/signo/${number}/video.mp4`
    };
}
