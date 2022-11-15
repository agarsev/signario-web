import Database from 'better-sqlite3';
const db = new Database(process.env.DB_PATH);
const search = db.prepare("SELECT signs.* FROM params JOIN signs ON docid=number WHERE params MATCH ? LIMIT 50");

import Link from 'next/link';

export default function Page({ searchParams }) {
    const signs = search.all(searchParams.parametros);
    return <ul>
      {signs.map(s => <li>
        <Link href={`/signo/${s.number}`}>
          {s.number} - {s.notation} - {s.gloss}
        </Link></li>)}
    </ul>;
}
