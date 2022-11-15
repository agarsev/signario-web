import Database from 'better-sqlite3';
const db = new Database(process.env.DB_PATH);
const search = db.prepare("SELECT * FROM signs WHERE notation LIKE ? LIMIT 10");

import Link from 'next/link';

export default function Page({ searchParams }) {
    const signs = search.all(`%${searchParams.parametros}%`);
    return <ul>
      {signs.map(s => <li>
        <Link href={`/signo/${s.number}`}>
          {s.number} - {s.notation} - {s.gloss}
        </Link></li>)}
    </ul>;
}
