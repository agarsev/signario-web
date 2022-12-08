import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getSign } from "../../db.server.js"; 

export function meta ({ data }) {
    return { title: "Signario | "+data.gloss }
}

export async function loader ({ params }) {
    return json(getSign(params.number));
}

export default function Signo () {
    const s = useLoaderData();
    return <>
        <h2 className="text-2xl text-orange-700 my-4 py-2 border-b border-orange-700 font-bold">{s.notation}</h2>
        <h2 className="text-2xl text-stone-700 pl-2 mb-4">{s.gloss}</h2>
        <video className="rounded" muted autoplay controls>
          <source src={`/signo/${s.number}/video.mp4`} />
        </video>
    </>;
}
