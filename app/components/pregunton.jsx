import { useState } from "react";
import { PreguntonQ } from "./pregunton/Q";

/*
const defFon = {
    q: {
        fingers: {},
        flex: "E", touch: "", others: false,
    },
    o: { palmar: "", distal: "" },
    l: { dir: "", body: "", touch: false },
};

function fonReducer (setSN) {
    return (fon, [segment, feature, val]) => {
        let newFon = { ...fon };
        if (segment == "q" && feature == "fingers" && !count(val)) {
            newFon.q = { ...defFon.q };
        } else {
            newFon[segment] = {
                ...newFon[segment],
                [feature]: val
            };
        }
        setSN(fon2SN(newFon));
        return newFon;
    };
}

function O2SN (o) {
    return o.palmar + o.distal.toLowerCase();
}

function L2SN (l) {
    if (l.dir[0] == "!") {
        return l.body + l.dir.substring(1) + (l.touch?"*":"");
    } else {
        return l.dir;
    }
}

function fon2SN (fon) {
    let sn = [ fon.q.signotation(), O2SN(fon.o), L2SN(fon.l) ];
    sn = sn.filter(s => s.length>0);
    return sn.join(":");
}
*/

export function Pregunton ({ setSN }) {
    const [detailed, setDets] = useState(false);
    return <form className="Pregunton mt-8 mb-2">
        <h2>Q (configuración)</h2>
        <PreguntonQ setSN={setSN} detailed={detailed} />
        <p className="text-right italic text-stone-600 mt-3">
            <label>Avanzado
            <input className="ml-2" type="checkbox"
                checked={detailed} onChange={() => setDets(!detailed)} />
        </label></p>
    </form>
}
/*
<Orient o={fon.o} dispatch={dispatch} />
<Locus l={fon.l} dispatch={dispatch} />
<h2>Mano no dominante</h2>
<p>La otra mano <select>
    <option>No hace nada</option>
    <option>Igual que la dominante</option>
    <option>Al contrario que la dominante</option>
    <option>Distinta que la dominante</option>
</select></p>
*/

function HelpText ({ text, help }) {
    return <span title={help}>
        <span className="underline decoration-dotted">{text}</span>
        <sup>?</sup>
    </span>
}


/* O */

const absSpaces = {
    "H": "Arriba",
    "L": "Abajo",
    "F": "Delante",
    "B": "Atrás",
    "Y": "La derecha",
    "X": "La izquierda",
}

function Options ({ opts, prefix = "" }) {
    return Object.keys(opts).map(key => <option key={prefix+key} value={prefix+key}>
        {opts[key]}
    </option>);
}

function Orient ({ o, dispatch }) {
    function OSel ({ dir }) {
        return <select value={o[dir]} onChange={e => dispatch(["o", dir, e.target.value])} autoComplete="off">
            <option value="">No sé</option>
            <Options opts={absSpaces} />
        </select>
    };
    return <>
        <h3>¿Hacia dónde apunta la mano?</h3>
        <span className="mr-3">La palma hacia <OSel dir="palmar" /></span>
        <span>El <HelpText text="eje distal" help="Donde apuntan los dedos si están estirados" /> hacia <OSel dir="distal" />
        </span>
    </>;
}

/* L */

const relSpaces = {
    "H": "Encima de",
    "L": "Debajo de",
    "F": "Delante de",
    "B": "Detrás de",
    "Y": "A la derecha de",
    "X": "A la izquierda de"
};

const bodySpaces = {
    "Nar": "la nariz",
    "Hom": "el hombro",
    "Cue": "el cuello",
    "H2": "la otra mano",
};

function Locus ({ l, dispatch }) {
    return <>
        <h3>¿Dónde se encuentra la mano?</h3>
        <select value={l.dir} onChange={e => dispatch(["l", "dir", e.target.value])} autoComplete="off">
            <option value="">No sé</option>
            <Options opts={absSpaces} />
            <option value="!">Cerca de</option>
            <Options opts={relSpaces} prefix="!" />
        </select>
        {l.dir[0]=="!"?<>
            <select value={l.body} onChange={e => dispatch(["l", "body", e.target.value])} autoComplete="off">
                <Options opts={bodySpaces} />
            </select>
            <label><input type="checkbox" checked={l.touch} onChange={() => dispatch(["l", "touch", !l.touch])} />
                tocando</label>
        </>:null}
    </>;
}
