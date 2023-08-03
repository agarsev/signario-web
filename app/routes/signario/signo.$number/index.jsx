import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useEffect } from "react";

import { getSign } from "../../../db.server.js"; 
import markdown from "../../../markdown.server.js";

export function meta ({ data }) {
    return { title: "Signario | "+data?.gloss }
}

export async function loader ({ params }) {
    const sign = await getSign(params.number);
    if (!sign) throw new Response("", { status: 404 });
    if (sign.definitions.length == 0) {
        sign.acepciones = [sign.gloss];
    } else {
        sign.acepciones = sign.definitions.map(d => markdown(d.content));
    }
    return json(sign);
}

export default function Signo () {
    const s = useLoaderData();
    const bottom = useRef();
    useEffect(() => {
        bottom.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    return <div className="bg-stone-50">
        <h2 className="text-2xl text-center text-orange-700 my-4 py-2 border-b border-orange-700 font-bold">{s.notation}</h2>
        <video className="rounded w-full aspect-[4/3]" muted autoPlay controls>
          <source src={`/signario/signo/${s.number}/video.mp4`} />
        </video>
        {s.acepciones.map((a, i) => <section key={i}
            className={"prose lg:prose-xl prose-stone prose-orange my-2"+(i==0?" mt-12":"")}
            dangerouslySetInnerHTML={{__html:a}} />)}
        <div ref={bottom} className="mt-8" />
    </div>;
}
