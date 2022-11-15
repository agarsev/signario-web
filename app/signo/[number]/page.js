import Database from 'better-sqlite3';
const db = new Database(process.env.DB_PATH);
const getSign = db.prepare("SELECT * FROM signs WHERE number = ?");

export default function Page({ params }) {
  const s = getSign.get(params.number);
  return <>
    <h1 className="text-3xl">{s.gloss}</h1>
    <p>{s.notation}</p>
    <video controls>
      <source src={`/signo/${s.number}/video.mp4`} />
    </video>
  </>;
}
