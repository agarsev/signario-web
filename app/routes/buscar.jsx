import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams, Link } from "@remix-run/react";
import { useRef } from "react";

import { searchSN } from "../db.server.js"; 
import { Search } from '../components.jsx';

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
        <Search short={true} />
        <ul className="border-t border-stone-200 my-3">
            {signs.map(s => <li key={s.number}
                className="border-b border-stone-200 py-2 px-2">
                <Snippet sign={s} />
            </li>)}
        </ul>
        {data.signs.length==0?<p className="text-stone-800 mt-4 text-center">No hay resultados</p>:null}
        {data.signs.length>INITIAL_RESULTS && !more ? <Link
            className="text-orange-700 block pr-2 text-right hover:underline"
            to={`?parametros=${searchParams.get("parametros")}&more=true`}>ver más
        </Link> : null}
    </>;
}

function Snippet ({ sign }) {
    const vid = useRef(null);
    return <Link to={`/signo/${sign.number}`} prefetch="render"
        onMouseOver={() => vid.current?.play()}
        onMouseOut={() => {vid.current?.pause();vid.current?.fastSeek(0);}}
        className="block clear-both max-h-[3em] transition-all hover:max-h-[6em] overflow-hidden">
        <video className="w-[200px] float-right -mt-4" muted loop ref={vid}>
            <source src={`/signo/${sign.number}/video.mp4`} />
        </video>
        <span className="font-bold text-orange-700 mb-1">{sign.notation}</span>
        <br />
        <span className="pl-3 text-stone-900">{sign.gloss}</span>
    </Link>;
}
