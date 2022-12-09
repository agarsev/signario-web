import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams, Link } from "@remix-run/react";

import { searchSN } from "../db.server.js"; 
import { Search, SignSnippet} from '../components.jsx';

const INITIAL_RESULTS = 6;
const MAX_RESULTS = 20;

export async function loader ({ request }) {
    const query = new URL(request.url).searchParams;
    return json({
        signs: searchSN(query.get("parametros"), query.get("more")?MAX_RESULTS:(INITIAL_RESULTS+1))
    });
}


export default function ResultList () {
    const data = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const more = searchParams.has("more");
    const signs = more?data.signs:data.signs.slice(0, INITIAL_RESULTS);
    return <>
        <Search />
        <ul className="border-t border-stone-200 my-3">
            {signs.map(s => <li key={s.number}
                className="border-b border-stone-200 py-2 px-2">
                <SignSnippet sign={s} />
            </li>)}
        </ul>
        {data.signs.length==0?<p className="text-stone-800 mt-4 text-center">No hay resultados</p>:null}
        {data.signs.length>INITIAL_RESULTS && !more ? <Link
            className="text-orange-700 block pr-2 text-right hover:underline"
            to={`?parametros=${searchParams.get("parametros")}&more=true`}>ver más
        </Link> : null}
    </>;
}
