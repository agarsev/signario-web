import { useState } from "react";
import { useObsReducer } from "./pregunton/common";
import { PreguntonQ } from "./pregunton/Q";
import { PreguntonO } from "./pregunton/O";
import { PreguntonL } from "./pregunton/L";
import { PreguntonE, PreguntonG } from "./pregunton/dynams";

const DEFAULT_SN = {
    prefix: "",
    q: "",
    o: "",
    l: "",
    lfore: false,
    e: "",
    g: "",
    gfore: false,
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
            const [gfore, g] = action.value;
            ret = { ...SN, gfore, g };
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

        <h2>E (evolución)</h2>
        <PreguntonE setSN={value => dispatch({ action: "segment", segment: "e", value })} />
        <h2>G (giro)</h2>
        <PreguntonG detailed={detailed}
            setSN={value => dispatch({ action: "giro", value })} />

        <p className="text-right italic text-stone-600 mt-3">
            <label>Avanzado
            <input className="ml-2" type="checkbox"
                checked={detailed} onChange={() => setDets(!detailed)} />
        </label></p>
    </form>;
}

function signotation (SN) {
    return [SN.prefix+SN.q, SN.o, SN.l, SN.e, SN.g].filter(x => !!x).join(":");
}
