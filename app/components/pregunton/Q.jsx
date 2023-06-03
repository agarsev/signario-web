import { useState } from "react";

const DEFAULT_Q = {
    fingers: {},
    flex: "E",
    touch: "",
    opo: false,
    others: false,
};

function reducer (q, action) {
    let nuq;
    switch (action.action) {
        case "set":
            return action.q;
        case "feature":
            nuq = { ...q,
                [action.feature]: action.value
            };
            if (action.feature == "flex" && nuq.fingers.P) {
                nuq.opo = action.value != "E";
            }
            return nuq;
        case "finger":
            nuq = { ...q, fingers: {
                ...q.fingers,
                [action.finger]: action.value
            }};
            if (count(nuq.fingers) == 0) return DEFAULT_Q;
            if (count(nuq.fingers) == 5) nuq.others = false;
            if (!nuq.fingers.P) {
                nuq.opo = false;
                if (nuq.touch == "+") nuq.touch = "";
            }
            return nuq;
    }
    console.error("UNKNOWN ACTION", action, q);
}

export function PreguntonQ ({ detailed, setSN }) {

    const [q, setQ] = useState(DEFAULT_Q);
    const dispatch = action => {
        const nq = reducer(q, action);
        setQ(nq);
        setSN(signotation(nq));
    }

    const manyFingers = count(q.fingers);

    function Finger ({ name, val }) {
        const unset = !q.fingers[val];
        return <label className="mr-2">
            <input type="checkbox" checked={!unset} autoComplete="off"
                onChange={() => dispatch({ action: "finger", finger: val, value: unset })} />
            {name}</label>;
    }

    function Question ({ condition, text, opts, feature }) {
        if (!condition) return null;
        return <p>{text} <select value={q[feature]}
            onChange={e=>dispatch({ action: "feature", feature, value: e.target.value })}>
            {Object.keys(opts).map(key => <option key={key} value={key}>
                {opts[key]}</option>)}
        </select></p>;
    }

    function YesNo ({ condition, text, feature }) {
        if (!condition) return null;
        return <p><label>
            <input type="checkbox" checked={q[feature]}
            onChange={() => dispatch({ action: "feature", feature, value: !q[feature]})} />
            {text}
        </label></p>;
    }

    return <>
        <h3>¿Cuáles son los dedos seleccionados?</h3>
        <label className="mr-2">
            <input type="checkbox" checked={!manyFingers}
                onChange={() => dispatch({ action: "set", q: DEFAULT_Q })} />
            No sé</label>
        <Finger name="Pulgar" val="P" />
        <Finger name="Índice" val="I" />
        <Finger name="Corazón" val="C" />
        <Finger name="Anular" val="A" />
        <Finger name="Meñique" val="M" />
        <Question condition={manyFingers>0} text="Están:" opts={{
            "E": 'Extendidos',
            "c": 'Curvos',
            "r": 'Doblados por el nudillo, rectos',
            "g": 'Doblados "como una garra"',
            "#": 'Cerrados (puño)',
        }} feature="flex" />
        <Question text="¿Los dedos están separados unos de otros?"
            condition={detailed && q.flex == "E" && manyFingers>1} opts={{
            "": "Separados",
            "-": "Juntos lateralmente",
            "x": "Cruzados",
        }} feature="touch" />
        <YesNo text="El pulgar está opuesto a los demás dedos" feature="opo"
            condition={detailed && q.fingers.P} />
        <Question text="¿El pulgar toca otros dedos?"
            condition={detailed && q.opo} opts={{
            "": "No",
            "+": "Sí, en la yema (pinza)",
            "-": "Sí, en el medio del dedo",
        }} feature="touch" />
        <YesNo text="Los demás dedos están estirados" feature="others"
            condition={detailed && manyFingers>0 && manyFingers<5} />
    </>;
}

function signotation (q) {
    const ext = q.flex == "E";
    let sn = (q.fingers.I?"i":"")+
        (q.fingers.C?"c":"")+
        (q.fingers.A?"a":"")+
        (q.fingers.M?"m":"");
    if (ext) sn = sn.toUpperCase();
    if (q.fingers.P) sn = (q.opo?"p":"P") + sn;
    if (q.touch == "x") sn = sn.split("").reverse().join("");
    else if (q.flex != "c" && !ext) sn += q.flex;
    sn += q.touch;
    if (q.others) sn += "O";
    return sn;
}

function count (obj) {
    return Object.keys(obj).filter(f => obj[f]).length;
}

