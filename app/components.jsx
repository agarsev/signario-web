import { Form, Link, useSearchParams } from "@remix-run/react";
import { useState, useRef } from "react";

export function Search () {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("parametros") || "");
    const valid = query != "";
    return <Form method="get" action="/buscar" autoComplete="off"
            className="flex py-1 mb-2" onSubmit={valid?null:e => e.preventDefault()} >
        <input type="text" name="parametros" className="border border-orange-600 rounded py-1 px-2 flex-1"
            value={query} onChange={e => setQuery(e.target.value)} />
        <input type="submit" value="Buscar" disabled={!valid}
            className="border border-violet-700 font-bold rounded-xl enabled:bg-violet-300 enabled:hover:bg-violet-200 enabled:cursor-pointer text-violet-800 py-1 px-2 ml-2 " />
    </Form>;
}

export function SignSnippet ({ sign }) {
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
