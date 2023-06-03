import { useState } from "react";
import { PreguntonQ } from "./pregunton/Q";
import { PreguntonO } from "./pregunton/O";

/*
const defFon = {
    l: { dir: "", body: "", touch: false },
};

function L2SN (l) {
    if (l.dir[0] == "!") {
        return l.body + l.dir.substring(1) + (l.touch?"*":"");
    } else {
        return l.dir;
    }
}

*/

export function Pregunton ({ setSN }) {
    const [detailed, setDets] = useState(false);
    const [qSN, _setQSN] = useState("");
    const [oSN, _setOSN] = useState("");
    const setFullSN = (qSN, oSN) => {
        setSN([qSN,oSN].filter(v => !!v).join(":"));
    }
    const setQSN = qSN => { _setQSN(qSN); setFullSN(qSN, oSN); };
    const setOSN = oSN => { _setOSN(oSN); setFullSN(qSN, oSN); };
    return <form className="Pregunton mt-8 mb-2">
        <h2>Q (configuración)</h2>
        <PreguntonQ setSN={setQSN} detailed={detailed} />
        {detailed?<>
            <h2>O (orientación)</h2>
            <PreguntonO setSN={setOSN} />
        </>:null}
        <p className="text-right italic text-stone-600 mt-3">
            <label>Avanzado
            <input className="ml-2" type="checkbox"
                checked={detailed} onChange={() => setDets(!detailed)} />
        </label></p>
    </form>
}
/*
<Locus l={fon.l} dispatch={dispatch} />
<h2>Mano no dominante</h2>
<p>La otra mano <select>
    <option>No hace nada</option>
    <option>Igual que la dominante</option>
    <option>Al contrario que la dominante</option>
    <option>Distinta que la dominante</option>
</select></p>
*/

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
