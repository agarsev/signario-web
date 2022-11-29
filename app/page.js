'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchUrl = `/buscar?parametros=${encodeURIComponent(search)}`;
  const doSearch = e => {
    e.preventDefault();
    router.push(searchUrl);
  };
  return <form onSubmit={doSearch}>
    <input type="text" onChange={e => setSearch(e.target.value)} value={search} />
    <Link href={searchUrl}>Buscar</Link>
  </form>;
}
