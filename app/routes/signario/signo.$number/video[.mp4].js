import { open } from 'node:fs/promises';

export async function loader ({ params }) {
    const f = await open(`${process.env.VID_PATH}/${params.number.substring(0,3)}/${params.number.substring(3)}.mp4`);
    return new Response(f.createReadStream(), {
        status: 200,
        headers: {
            "Content-Type": "video/mp4"
        }
    });
}
