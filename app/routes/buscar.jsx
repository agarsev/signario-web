import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { searchParams } from "../db.server.js"; 

export async function loader ({ request }) {
    const query = new URL(request.url).searchParams.get("parametros");
    return json({
        signs: searchParams(query)
    });
}


export default function Buscar () {
    const data = useLoaderData();
    return <ul>
        {data.signs.map(s => <li key={s.number}>
            <Link to={`/signo/${s.number}`} prefetch="render">
                {s.number} - {s.notation} - {s.gloss}
            </Link></li>)}
    </ul>;
}
