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

export const relSpaces = {
    "H": "Encima de",
    "L": "Debajo de",
    "F": "Delante de",
    "B": "Detrás de",
    "Y": "A la derecha de",
    "X": "A la izquierda de"
};

export const bodySpaces = {
    "Nar": "la nariz",
    "Hom": "el hombro",
    "Cue": "el cuello",
    "H2": "la otra mano",
};
