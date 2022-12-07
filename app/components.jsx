import { Form, Link, useSearchParams } from "@remix-run/react";
import { useState } from "react";

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
    return <Link to={`/signo/${sign.number}`} prefetch="render">
        <span className="block font-bold text-orange-700 mb-1">{sign.notation}</span>
        <span className="block pl-3 text-stone-900">{sign.gloss}</span>
    </Link>;
}
