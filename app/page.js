import Link from 'next/link';

import Database from 'better-sqlite3';
const db = new Database(process.env.DB_PATH);
const signs = db.prepare("SELECT * FROM signs LIMIT 10").all();

export default function Page() {
  return <>
    <h1>Hello, Next.js!</h1>
    <ul>
      {signs.map(s => <li>
        <Link href={`/signo/${s.number}`}>
          {s.number} - {s.notation} - {s.gloss}
        </Link></li>)}
    </ul>
  </>;
}
