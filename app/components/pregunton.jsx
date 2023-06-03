import { useState } from "react";
import { PreguntonQ } from "./pregunton/Q";
import { PreguntonO } from "./pregunton/O";
import { PreguntonL } from "./pregunton/L";

const DEFAULT_SN = {
    prefix: "",
    q: "",
    o: "",
    l: "",
}

function reducer (SN, action) {
    switch (action.action) {
        case "segment":
            return { ...SN, [action.segment]: action.value };
        case "lugar":
            const [prefix, l] = action.value;
            return { ...SN, prefix, l };
    }
    console.error("UNKNOWN ACTION", action, SN);
}

export function Pregunton ({ setSN }) {
    const [detailed, setDets] = useState(false);

    const [SN, _setSN] = useState(DEFAULT_SN);
    const dispatch = action => {
        const nSN = reducer(SN, action);
        _setSN(nSN);
        setSN(signotation(nSN));
    }

    return <form className="Pregunton mt-8 mb-2">

        <h2>Q (configuración)</h2>
        <PreguntonQ detailed={detailed}
            setSN={value => dispatch({ action: "segment", segment: "q", value })} />
        {detailed?<>
            <h2>O (orientación)</h2>
            <PreguntonO setSN={value => dispatch({ action: "segment", segment: "o", value })} />
        </>:null}
        <h2>L (lugar)</h2>
        <PreguntonL detailed={detailed}
            setSN={value => dispatch({ action: "lugar", value })} />

        <p className="text-right italic text-stone-600 mt-3">
            <label>Avanzado
            <input className="ml-2" type="checkbox"
                checked={detailed} onChange={() => setDets(!detailed)} />
        </label></p>
    </form>;
}

function signotation (SN) {
    return [SN.prefix+SN.q, SN.o, SN.l].filter(x => !!x).join(":");
}
