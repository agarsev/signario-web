import { Form, useSearchParams } from "@remix-run/react";
import { useState } from "react";

export function Search () {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("parametros") || "");
    const valid = query != "";
    return <Form method="get" action="/buscar" autoComplete="off"
            className="flex py-1 mb-2" onSubmit={valid?null:e => e.preventDefault()} >
        <input type="text" name="parametros" className="border border-orange-800 rounded py-1 px-2 flex-1"
            value={query} onChange={e => setQuery(e.target.value)} />
        <input type="submit" value="Buscar" disabled={!valid}
            className="border border-orange-800 rounded-xl enabled:bg-orange-200 enabled:cursor-pointer text-orange-900 py-1 px-2 ml-2 " />
    </Form>;
}
