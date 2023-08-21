import { YesNo, useObsReducer, Options, absSpaces } from "./common";

const DEFAULT_E = { evo: "", accent: "" }

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
        <p>
            <YesNo condition={evo==""||evo=="<"||evo==">"} checked={accent=="w"}
                onChange={() => dispatch({accent: "w"})}>
                ondulando</YesNo>
            <YesNo condition={evo==""} checked={accent=="-"}
                onChange={() => dispatch({accent: "-"})}>
                se juntan lateralmente</YesNo>
        </p>
    </>;
}

const DEFAULT_G = { g: "", forearm: false };

export function PreguntonG ({ setSN, detailed }) {
    const [{g, forearm}, dispatch] = useObsReducer(DEFAULT_G, (s, a) => ({...s, ...a}), setSN);
    return <>
        <h3>¿Gira la orientación de la mano?</h3>
        <select value={g} autoComplete="off"
            onChange={e => dispatch({g: e.target.value})}>
            <option value="">No</option>
            <option value="$">La mano rota sobre el antebrazo</option>
            <option value="%">La muñeca se abate</option>
            <option value="/">La mano se inclina lateralmente</option>
            <option value="8">La muñeca rota haciendo círculos</option>
        </select>
        <p><YesNo condition={detailed} checked={forearm}
            onChange={() => dispatch({forearm: !forearm})}>
            El giro afecta <span className="whitespace-normal">a todo el brazo
                desde el codo (no sólo a la mano)</span>
        </YesNo></p>
    </>;
}

const DEFAULT_D = { d: "", l2: "", l2c: false };

function dReducer (D, action) {
    const nD = {...D, ...action}; 
    if (nD.d == "" || nD.d == "(,)") {
        nD.l2 = "";
        nD.l2c = false;
    }
    return nD;
}

export function PreguntonD ({ setSN, detailed }) {
    const [{d, l2, l2c}, dispatch] = useObsReducer(DEFAULT_D, dReducer,
        ({d, l2, l2c}) => setSN([d, l2+(l2c?"*":"")]));
    return <>
        <h3>¿Se desplaza la mano a otro sitio?</h3>
        <select value={d} autoComplete="off"
            onChange={e => dispatch({d: e.target.value})}>
            <option value="">No</option>
            <option value="->">Sí, en línea recta</option>
            <option value="()">Sí, en línea curva</option>
            <option value="(,)">Sí, describe un círculo completo</option>
        </select>
        {detailed?<>
            <p>El destino del movimiento es hacia&nbsp;
            <select value={l2} autoComplete="off" onChange={e => dispatch({l2: e.target.value})}>
                <option value="">No sé</option>
                <Options opts={absSpaces} />
            </select></p>
        <YesNo condition={l2!="" && l2!="(,)"} checked={l2c} onChange={() => dispatch({l2c: !l2c})}>
            La mano hace contacto en algún sitio en su destino</YesNo>
        </>:null}
    </>;
}
