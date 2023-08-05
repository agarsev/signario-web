import { YesNo, useObsReducer } from "./common";

const DEFAULT_E = {
    evo: "", accent: ""
}

function eReducer (E, action) {
    const nE = {...E}; 
    if (action.evo !== undefined) {
        if ((action.evo=="<" || action.evo==">") && E.accent == "-") {
            nE.accent = "";
        } else if (action.evo != "") {
            nE.accent = "";
        }
        nE.evo = action.evo;
    } else {
        nE.accent = (nE.accent == action.accent)?"":action.accent;
    }
    return nE;
}

export function PreguntonE ({ setSN }) {
    const [{evo, accent}, dispatch] = useObsReducer(DEFAULT_E, eReducer,
        ({evo, accent}) => setSN(evo+accent));
    return <>
        <h3>¿Evoluciona la flexión de los dedos?</h3>
        <select value={evo} autoComplete="off"
            onChange={e => dispatch({evo: e.target.value})}>
            <option value="">No</option>
            <option value="<">Se abren</option>
            <option value=">">Se cierran</option>
            <option value="+">Se cierran tocando las yemas, en pinza</option>
            <option value="7">Se doblan por la base, rectos</option>
            <option value="^">Se doblan por el nudillo, como una garra</option>
        </select>
        <YesNo condition={evo==""||evo=="<"||evo==">"} checked={accent=="w"}
            onChange={() => dispatch({accent: "w"})}>
            ondulando</YesNo>
        <YesNo condition={evo==""} checked={accent=="-"}
            onChange={() => dispatch({accent: "-"})}>
            se juntan lateralmente</YesNo>
    </>;
}

const DEFAULT_G = {
    g: "", forearm: false
}

function gReducer (G, action) {
    const nG = {...G}; 
    if (action.g !== undefined) {
        nG.g = action.g;
    } else {
        nG.forearm = !nG.forearm;
    }
    return nG;
}

export function PreguntonG ({ setSN, detailed }) {
    const [{g, forearm}, dispatch] = useObsReducer(DEFAULT_G, gReducer,
        ({g, forearm}) => setSN([forearm, g]));
    return <>
        <h3>¿Cambia la orientación de la mano?</h3>
        <select value={g} autoComplete="off"
            onChange={e => dispatch({g: e.target.value})}>
            <option value="">No</option>
            <option value="$">La mano rota sobre el eje del antebrazo</option>
            <option value="%">La muñeca se abate</option>
            <option value="/">La mano se inclina lateralmente (como en HOLA)</option>
            <option value="8">La mano rota sobre la muñeca haciendo círculos</option>
        </select>
        <YesNo condition={detailed} checked={forearm}
            onChange={() => dispatch({forearm})}>
            El giro afecta a todo el brazo desde el codo (no sólo a la mano)</YesNo>
    </>;
}
