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
        <h1 className="text-3xl">{s.gloss}</h1>
        <p>{s.notation}</p>
        <video controls>
          <source src={`/signo/${s.number}/video.mp4`} />
        </video>
    </>;
}
