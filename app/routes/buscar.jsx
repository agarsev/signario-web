import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { searchSN } from "../db.server.js"; 
import { Search, SignSnippet} from '../components.jsx';

export async function loader ({ request }) {
    const query = new URL(request.url).searchParams.get("parametros");
    return json({
        signs: searchSN(query)
    });
}


export default function ResultList () {
    const data = useLoaderData();
    return <>
        <Search />
        <ul className="border-t border-stone-200 my-3">
            {data.signs.map(s => <li key={s.number}
                className="border-b border-stone-200 py-2 px-2">
                <SignSnippet sign={s} />
            </li>)}
        </ul>
    </>;
}
