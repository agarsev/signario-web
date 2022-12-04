import { Form } from "@remix-run/react";

export default function Index () {
    return <Form method="get" action="/buscar">
        <input type="text" name="parametros" className="border border-blue-800" />
        <input type="submit" value="Buscar" />
    </Form>;
}
