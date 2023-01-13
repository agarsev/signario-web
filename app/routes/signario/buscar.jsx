import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams, Link } from "@remix-run/react";
import { useRef } from "react";

import { searchSN, searchSpa } from "../../db.server.js"; 
import { Search } from '../../components/search.jsx';
import markdown from "../../markdown.server.js";

const INITIAL_RESULTS = 6;
const MAX_RESULTS = 20;

export async function loader ({ request }) {
    let signs;
    try {
        const query = new URL(request.url).searchParams;
        const params = query.get("parametros");
        const limit = query.get("more")?MAX_RESULTS:(INITIAL_RESULTS+1);
        if (params) {
            signs = searchSN(params, limit);
        } else {
            signs = searchSpa(query.get("traduccion"), limit);
        }
        signs.forEach(s => { s.heading = markdown(s.heading); });
    } catch (e) {
        console.error(e);
        signs = [];
    }
    return json({ signs });
}


export default function ResultList () {
    const data = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const more = searchParams.has("more");
    const signs = more?data.signs:data.signs.slice(0, INITIAL_RESULTS);
    const searchMode = searchParams.has("traduccion")?"traduccion":"parametros";
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
            to={`?${searchMode}=${searchParams.get(searchMode)}&more`}>ver más
        </Link> : null}
    </>;
}

function Snippet ({ sign }) {
    const vid = useRef(null);
    const open = () => vid.current?.play();
    const close = () => {vid.current?.pause();vid.current?.fastSeek(0);};
    const touch = e => {
        if (document.activeElement!=e.currentTarget) {
            e.currentTarget.focus();
            e.preventDefault();
        }
    };
    return <Link to={`/signario/signo/${sign.number}`} prefetch="render"
        onMouseOver={open} onMouseOut={close} onFocus={open} onBlur={close} onTouchEnd={touch}
        className="block clear-both max-h-[3em] transition-all hover:max-h-[6em] focus:max-h-[6em] outline-none overflow-hidden">
        <video className="w-[200px] float-right -mt-4" muted loop ref={vid}>
            <source src={`/signario/signo/${sign.number}/video.mp4`} />
        </video>
        <span className="font-bold text-orange-700 mb-1">{sign.notation}</span>
        <span className="pl-3 text-stone-900"
            dangerouslySetInnerHTML={{__html: sign.heading}} />
    </Link>;
}
