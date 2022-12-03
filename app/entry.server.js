import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";

import { init_db } from "./db.server.js";

init_db();

export default function handleRequest(request, status, headers, context) {
    const markup = "<!DOCTYPE html>" + renderToString(
        <RemixServer context={context} url={request.url} />);
    headers.set("Content-Type", "text/html");
    return new Response(markup, { status, headers });
}
