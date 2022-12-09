import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getSign } from "../../db.server.js"; 
import markdown from "../../markdown.server.js";

export function meta ({ data }) {
    return { title: "Signario | "+data.gloss }
}

export async function loader ({ params }) {
    const sign = getSign(params.number);
    sign.acepciones = [
        markdown("**adj.** **dir.** Dícese de quien tiene la cualidad de ser [chiripitifláutico](/signo/12197)."),
        markdown("**n.** Bastante espialidoso.")
    ];
    return json(sign);
}

export default function Signo () {
    const s = useLoaderData();
    return <>
        <h2 className="text-2xl text-orange-700 my-4 py-2 border-b border-orange-700 font-bold">{s.notation}</h2>
        <h2 className="text-2xl text-stone-700 pl-2 mb-4">{s.gloss}</h2>
        <video className="rounded" muted autoPlay controls>
          <source src={`/signo/${s.number}/video.mp4`} />
        </video>
        {s.acepciones.map((a, i) => <section key={i}
            className={"prose lg:prose-xl prose-stone prose-orange my-3"+(i==0?" mt-12":"")}
            dangerouslySetInnerHTML={{__html:a}} />)}
    </>;
}
