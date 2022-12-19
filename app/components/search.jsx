import { Form, Link, useSearchParams, useOutletContext } from "@remix-run/react";
import { useState } from "react";

import { Pregunton } from "./pregunton.jsx";

const pill = "border font-bold rounded-xl py-1 px-3";
const pillSubmit = pill+" border-violet-700 enabled:bg-violet-300 enabled:hover:bg-violet-200 enabled:cursor-pointer text-violet-800";
const pillRadio = pill+" border-orange-700 text-orange-700 cursor-pointer border-orange-700 hover:bg-orange-300";
const pillRadioActive = pill+" border-orange-700 text-orange-700 border-orange-500 bg-orange-500 text-white";

export function Search ({ short }) {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("parametros") || searchParams.get("traduccion") || "");
    const valid = query != "";

    const [prefs, setPrefs] = useOutletContext();
    const ipMethod = prefs.input_method;
    function IpPill({ text, value }) {
        const active = ipMethod == value;
        const click = () => {
            setQuery("");
            setPrefs({input_method: value});
        };
        return <label className={active?pillRadioActive:pillRadio}>
            <input className="hidden" type="radio" name="ipmethod"
                value={value} onClick={click} />
        {text}</label>
    }

    return <>
        <Form method="get" action="/buscar" autoComplete="off"
            className="flex py-1 mb-2" onSubmit={valid?null:e => e.preventDefault()} >
            <input type="text" name={ipMethod=="traduccion"?"traduccion":"parametros"}
                className="border border-orange-600 rounded py-1 px-2 flex-1"
                value={query} onChange={e => setQuery(e.target.value)} />
            <input type="submit" value="Buscar" disabled={!valid}
                className={pillSubmit+" ml-2"} />
        </Form>
        {short ? null : <>
        <div className="flex justify-center space-x-4" >
            <IpPill text="Parámetros" value="pregunton" />
            <IpPill text="Español" value="traduccion" />
            <IpPill text="Visual" value="signotador" />
        </div>
        {{
            "traduccion": () => <div className="prose prose-stone text-center mt-4">Buscar signos por su traducción al español.</div>,
            "pregunton": () => <Pregunton SN={query} setSN={setQuery} />,
            "signotador": () => null
        }[ipMethod]()}
        </>}
    </>;
}
