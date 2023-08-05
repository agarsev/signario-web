import { useState } from "react";

export function Options ({ opts, prefix = "" }) {
    return Object.keys(opts).map(key => <option key={prefix+key} value={prefix+key}>
        {opts[key]}
    </option>);
}

export function HelpText ({ text, help }) {
    return <span title={help}>
        <span className="underline decoration-dotted">{text}</span>
        <sup>?</sup>
    </span>
}

export const absSpaces = {
    "H": "Arriba",
    "L": "Abajo",
    "F": "Delante",
    "B": "Atrás",
    "Y": "La derecha",
    "X": "La izquierda",
}

export function YesNo ({ condition=true, checked, onChange, children }) {
    if (!condition) return null;
    return <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {children}
    </label>;
}

export function useObsReducer(DEF, reducer = (s,a) => ({...s, ...a}), observer) {
    const [state, setState] = useState(DEF);
    const dispatch = action => {
        const nState = reducer(state, action);
        setState(nState);
        observer(nState);
    }
    return [state, dispatch];
}
