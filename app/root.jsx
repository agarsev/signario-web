import { Meta, Outlet, Scripts, Links, LiveReload, Link } from "@remix-run/react";

export const meta = () => ({
  charset: "utf-8",
    title: "Signario | Diccionario paramétrico de LSE",
  viewport: "width=device-width,initial-scale=1",
});

import styles from "./tailwind.css";

export const links = () => ([
    { rel: "stylesheet", href: styles },
]);

export default function App() {
    return <html lang="es">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
            <header>
                <h1 className="text-2xl p-2">
                <Link to="/">Signario LSE</Link>
                </h1>
            </header>
            <main>
                <Outlet />
                <Scripts />
                <LiveReload />
            </main>
        </body>
    </html>;
}


