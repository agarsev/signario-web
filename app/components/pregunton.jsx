import { useState } from "react";
import { useObsReducer } from "./pregunton/common";
import { PreguntonQ } from "./pregunton/Q";
import { PreguntonO } from "./pregunton/O";
import { PreguntonL } from "./pregunton/L";
import { PreguntonE, PreguntonG, PreguntonD } from "./pregunton/dynams";

const DEFAULT_SN = {
    prefix: "",
    q: "",
    o: "",
    l: "",
    lfore: false,
    e: "",
    g: "",
    gfore: false,
    d: "",
    l2: "",
}

function reducer (SN, action) {
    let ret;
    switch (action.action) {
        case "segment":
            ret = { ...SN, [action.segment]: action.value };
            break;
        case "lugar":
            const [lfore, l] = action.value;
            ret = { ...SN, lfore, l };
            break;
        case "giro":
            const {g, forearm: gfore} = action.value;
            ret = { ...SN, gfore, g };
            break;
        case "despl":
            const [d, l2] = action.value;
            ret = { ...SN, d, l2 };
            break;
        default:
            console.error("UNKNOWN ACTION", action, SN);
            return SN;
    }
    ret.prefix = ret.lfore || ret.gfore ? "_" : "";
    return ret;
}

export function Pregunton ({ setSN }) {
    const [detailed, setDets] = useState(false);
    const [SN, dispatch] = useObsReducer(DEFAULT_SN, reducer,
        sn => setSN(signotation(sn)));

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

        <h2>Dinamismos</h2>
        <PreguntonE setSN={value => dispatch({ action: "segment", segment: "e", value })} />
        <PreguntonG detailed={detailed}
            setSN={value => dispatch({ action: "giro", value })} />
        <PreguntonD detailed={detailed}
            setSN={value => dispatch({ action: "despl", value })} />

        <p className="text-right italic text-stone-600 mt-3">
            <label>Avanzado
            <input className="ml-2" type="checkbox"
                checked={detailed} onChange={() => setDets(!detailed)} />
        </label></p>
    </form>;
}

function signotation (SN) {
    return [SN.prefix+SN.q, SN.o, SN.l, SN.e, SN.g, SN.d, SN.l2].filter(x => !!x).join(":");
}
