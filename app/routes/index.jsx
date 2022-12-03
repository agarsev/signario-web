import { Link, Form } from "@remix-run/react";
import { useState } from "react";

export default function Index () {
    const [search, setSearch] = useState("");
    const searchUrl = `/buscar?parametros=${encodeURIComponent(search)}`;
    return <Form method="get" action={searchUrl}>
        <input type="text" onChange={e => setSearch(e.target.value)} value={search} />
        <Link to={searchUrl} prefetch="intent">Buscar</Link>
    </Form>;
}
