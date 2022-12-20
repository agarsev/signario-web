import { useReducer } from "react";

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
            newFon.q = defFon.q;
        } else {
            newFon[segment][feature] = val;
        }
        setSN(fon2SN(newFon));
        return newFon;
    };
}

function Q2SN (Q) {
    let sn = (Q.fingers.P?"p":"")+
             (Q.fingers.I?"i":"")+
             (Q.fingers.C?"c":"")+
             (Q.fingers.A?"a":"")+
             (Q.fingers.M?"m":"");
    if (Q.flex == "E") sn = sn.toUpperCase();
    else if (Q.flex != "c") sn = sn + Q.flex;
    return `${sn}${Q.touch}${Q.others?"O":""}`;
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
    let sn = [ Q2SN(fon.q), O2SN(fon.o), L2SN(fon.l) ];
    sn = sn.filter(s => s.length>0);
    return sn.join(":");
}

export function Pregunton ({ setSN }) {
    const [fon, dispatch] = useReducer(fonReducer(setSN), defFon);
    return <form className="Pregunton mt-8 mb-2">
        <h2>Mano dominante</h2>
        <Config q={fon.q} dispatch={dispatch} />
        <Orient o={fon.o} dispatch={dispatch} />
        <Locus l={fon.l} dispatch={dispatch} />
        <h2>Mano no dominante</h2>
        <p>La otra mano <select>
            <option>No hace nada</option>
            <option>Igual que la dominante</option>
            <option>Al contrario que la dominante</option>
            <option>Distinta que la dominante</option>
        </select></p>
    </form>
}

function HelpText ({ text, help }) {
    return <span title={help}>
        <span className="underline decoration-dotted">{text}</span>
        <sup>?</sup>
    </span>
}

/* Q */

function count (obj) {
    return Object.keys(obj).filter(f => obj[f]).length;
}

function Config ({ q, dispatch }) {

    const manyFingers = count(q.fingers);

    function Finger ({ name, val }) {
        const unset = !q.fingers[val];
        return <label className="mr-2">
            <input type="checkbox" checked={!unset} autoComplete="off"
                onChange={() => dispatch(["q", "fingers", {...q.fingers,[val]:unset}])} />
            {name}</label>;
    }

    function Question ({ condition, text, opts, feature }) {
        if (!condition) return null;
        return <p>{text} <select value={q[feature]}
            onChange={e=>dispatch(["q", feature, e.target.value])}>
            {Object.keys(opts).map(key => <option key={key} value={key}>
                {opts[key]}</option>)}
        </select></p>;
    }

    return <>
        <h3>¿Cuáles son los dedos seleccionados?</h3>
        <label className="mr-2">
            <input type="checkbox" checked={!manyFingers}
                onChange={() => dispatch(["q", "fingers", {}])} />
            No sé</label>
        <Finger name="Pulgar" val="P" />
        <Finger name="Índice" val="I" />
        <Finger name="Corazón" val="C" />
        <Finger name="Anular" val="A" />
        <Finger name="Meñique" val="M" />
        <Question condition={manyFingers>0} text="Están:" opts={{
            "E": 'Estirados',
            "#": 'Cerrados (puño)',
            "c": 'Curvados',
            "r": 'Doblados por el nudillo, planos',
            "g": 'Doblados "como una garra"',
        }} feature="flex" />
        <Question condition={manyFingers>1} text="Se tocan:" opts={{
            "": "No",
            "-": "Lateralmente",
            "+": "Las yemas",
        }} feature="touch" />
        {(manyFingers>0 && manyFingers<5)?<p><label><input type="checkbox" checked={q.others}
            onChange={() => dispatch(["q", "others", !q.others])} />
            Los demás dedos están estirados</label></p>:null}
    </>;
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
