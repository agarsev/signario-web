import { Form, Link, useSearchParams, useSubmit, useLocation } from "@remix-run/react";
import { useRef } from "react";

import { Pregunton } from "./pregunton.jsx";
import { Signotator, SignotationInput } from "signotator";

const pill = "border font-bold rounded-xl py-1 px-3 transition-color ease-in duration-150";
const pillSubmit = pill+" border-secondary-700 enabled:bg-secondary-200 enabled:hover:bg-secondary-100 enabled:cursor-pointer text-secondary-800";
const pillRadio = pill+" border-orange-700 text-orange-700 cursor-pointer border-orange-700 hover:bg-orange-300";
const pillRadioActive = pill+" border-orange-700 text-orange-700 border-orange-500 bg-orange-500 text-white";

export function Search () {
    const [searchParams, setSearchParams] = useSearchParams();
    const { state } = useLocation();
    const ipMethod = searchParams.get("buscador") || state?.buscador || "pregunton";
    const query = searchParams.get("consulta") || state?.consulta || "";
    const searchBox = useRef();
    const form = useRef();
    const submit = useSubmit();

    function IpPill ({ text, value }) {
        const active = ipMethod == value;
        const click = () => setSearchParams({ buscador: value, consulta: "" });
        return <label className={active?pillRadioActive:pillRadio}>
            <input className="hidden" type="radio" name="buscador"
                value={value} onClick={click} />
        {text}</label>
    }

    function setQuery (q) {
        searchBox.current.value = q;
        submit(form.current, {replace: true });
    }

    return <>
        <Form ref={form} method="get" action="/signario?index" autoComplete="off"
            className="flex py-1 mb-2" onSubmit={query!=""?null:e => e.preventDefault()} >
            <input type="hidden" name="buscador" value={ipMethod} />
            <div className="flex-1 text-lg">{ipMethod=="traduccion"?
                <input type="text" name="consulta" ref={searchBox} value={query}
                    className="border border-primary-600 rounded py-1 px-2 w-full outline-none"
                    onChange={e => setQuery(e.target.value)} />:
                <SignotationInput inputName="consulta" inputRef={searchBox} value={query} updateVal={setQuery} />
            }</div>
        </Form>
        <div className="flex justify-center space-x-4" >
            <IpPill text="Parámetros" value="pregunton" />
            <IpPill text="Español" value="traduccion" />
            <IpPill text="Visual" value="signotador" />
        </div>
        {{
            "traduccion": () => <div className="prose prose-stone text-center mt-4">Buscar signos por su traducción al español.</div>,
            "pregunton": () => <Pregunton SN={query} setSN={setQuery} />,
            "signotador": () => <div className="text-center my-8"><Signotator inputRef={searchBox} updateVal={setQuery} /></div>,
        }[ipMethod]()}
    </>;
}
