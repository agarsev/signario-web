import { useState } from "react";

export function Pregunton ({ setSN }) {
    return <form className="Pregunton mt-8 mb-2">
        <h2>Mano dominante</h2>
        <Config change={setSN} />
        <Orient />
        <Locus />
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

const defConfig = {
    fingers: {},
    flex: "E", touch: "", others: false,
};

function produceQ (Q) {
    let sn = (Q.fingers.P?"p":"")+
             (Q.fingers.I?"i":"")+
             (Q.fingers.C?"c":"")+
             (Q.fingers.A?"a":"")+
             (Q.fingers.M?"m":"");
    if (Q.flex == "E") sn = sn.toUpperCase();
    else if (Q.flex != "c") sn = sn + Q.flex;
    return `${sn}${Q.touch}${Q.others?"O":""}`;
}

function Config ({ change }) {

    const [state, setState] = useState(defConfig);
    function update (feature, val) {
        let newState;
        if (feature == "fingers" && !count(val)) {
            newState = defConfig;
        } else {
            newState = {...state, [feature]: val};
        }
        setState(newState);
        change(produceQ(newState));
    }
    const manyFingers = count(state.fingers);

    function Finger ({ name, val }) {
        const unset = !state.fingers[val];
        return <label className="mr-2">
            <input type="checkbox" checked={!unset} autoComplete="off"
                onChange={() => update("fingers", {...state.fingers,[val]:unset})} />
            {name}</label>;
    }

    function Question ({ condition, text, opts, feature }) {
        if (!condition) return null;
        return <p>{text} <select value={state[feature]}
            onChange={e=>update(feature, e.target.value)}>
            {Object.keys(opts).map(key => <option key={key} value={key}>
                {opts[key]}</option>)}
        </select></p>;
    }

    return <>
        <h3>¿Cuáles son los dedos seleccionados?</h3>
        <label className="mr-2">
            <input type="checkbox" checked={!manyFingers}
                onChange={() => update("fingers", {})} />
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
        {(manyFingers>0 && manyFingers<5)?<p><label><input type="checkbox" checked={state.others}
            onChange={() => update("others", !state.others)} />
            Los demás dedos están estirados</label></p>:null}
    </>;
}

/* O */

const absSpaces = {
    "H": "Arriba",
    "L": "Abajo",
    "F": "Delante",
    "B": "Atrás",
    "Y": "Derecha",
    "X": "Izquierda",
}

function Options ({ opts, prefix = "" }) {
    return Object.keys(opts).map(key => <option key={prefix+key} value={prefix+key}>
        {opts[key]}
    </option>);
}

function Orient ({ change }) {
    const [palmar, setPalmar] = useState("");
    const [distal, setDistal] = useState("");
    function OSel ({ val, set }) {
        return <select value={val} onChange={e => set(e.target.value)} autoComplete="off">
            <option value="">No sé</option>
            <Options opts={absSpaces} />
        </select>
    };
    return <>
        <h3>¿Hacia dónde apunta la mano?</h3>
        <span className="mr-3">La palma hacia <OSel val={palmar} set={setPalmar} /></span>
        <span>El <HelpText text="eje distal" help="Donde apuntan los dedos si están estirados" /> hacia <OSel val={distal} set={setDistal} />
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

function Locus ({ change }) {
    const [dir, setDir] = useState("");
    const [body, setBody] = useState("");
    const [touch, setTouch] = useState(false);
    return <>
        <h3>¿Dónde se encuentra la mano?</h3>
        <select value={dir} onChange={e => setDir(e.target.value)} autoComplete="off">
            <option value="">No sé</option>
            <Options opts={absSpaces} />
            <option value="n">Cerca de</option>
            <Options opts={relSpaces} prefix="n" />
        </select>
        {dir[0]=="n"?<>
            <select value={body} onChange={e => setBody(e.target.value)} autoComplete="off">
                <Options opts={bodySpaces} />
            </select>
            <label><input type="checkbox" checked={touch} onChange={() => setTouch(!touch)} />
                tocando</label>
        </>:null}
    </>;
}
