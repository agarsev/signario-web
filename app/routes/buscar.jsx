import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { searchSN } from "../db.server.js"; 
import { Search } from '../components.jsx';

export async function loader ({ request }) {
    const query = new URL(request.url).searchParams.get("parametros");
    return json({
        signs: searchSN(query)
    });
}


export default function Buscar () {
    const data = useLoaderData();
    return <>
        <Search />
        <ul>
            {data.signs.map(s => <li key={s.number}>
                <Link to={`/signo/${s.number}`} prefetch="render">
                    {s.number} - {s.notation} - {s.gloss}
                </Link></li>)}
        </ul>
    </>;
}
