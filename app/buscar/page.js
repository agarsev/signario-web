import Database from 'better-sqlite3';
const db = new Database('signario.db');
db.loadExtension('./snTokenizer.so');
const search = db.prepare(`SELECT signs.* FROM params
JOIN signs ON docid=number
WHERE params MATCH ?
ORDER BY snrank(matchinfo(params, 'pxl')) DESC
LIMIT 30`);

import Link from 'next/link';

function process(query) {
    return '"' + query
      .replaceAll('*', 't')
      .replaceAll(':', '" "')
    +'"';
}

export default function Page({ searchParams }) {
    const signs = search.all(process(searchParams.parametros));
    return <ul>
      {signs.map(s => <li>
        <Link href={`/signo/${s.number}`}>
          {s.number} - {s.notation} - {s.gloss}
        </Link></li>)}
    </ul>;
}
