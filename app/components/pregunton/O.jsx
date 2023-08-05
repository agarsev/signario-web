import { useState } from "react";
import { Options, HelpText, absSpaces } from "./common";

function OSel ({ dir, setDir }) {
    return <select value={dir} onChange={e => setDir(e.target.value)} autoComplete="off">
        <option value="">No sé</option>
        <Options opts={absSpaces} />
    </select>
}

export function PreguntonO ({ setSN }) {
    const [palmar, _setPalmar] = useState("");
    const [distal, _setDistal] = useState("");
    const setFullSN = (palmar, distal) => {
        setSN(palmar + distal.toLowerCase());
    }
    const setPalmar = palmar => { _setPalmar(palmar); setFullSN(palmar, distal); };
    const setDistal = distal => { _setDistal(distal); setFullSN(palmar, distal); };
    return <>
        <h3>¿Hacia dónde apunta la mano?</h3>
        <span className="mr-3">La palma hacia <OSel dir={palmar} setDir={setPalmar} /></span>
        <span>El <HelpText text="eje distal" help="Donde apuntan los dedos si están estirados" /> hacia&nbsp;
            <OSel dir={distal} setDir={setDistal} />
        </span>
    </>;
}
