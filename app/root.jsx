import { Meta, Outlet, Scripts, Links, LiveReload, Link } from "@remix-run/react";

export const meta = () => ({
  charset: "utf-8",
    title: "Signario | Diccionario paramétrico de LSE",
  viewport: "width=device-width,initial-scale=1",
});

import styles from "./tailwind.css";

export const links = () => ([
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: "favicon.png" },
]);

export default function App() {
    return <html lang="es">
        <head>
            <Meta />
            <Links />
        </head>
        <body className="bg-stone-50 max-w-xl mx-auto">
            <header className="py-4">
                <Link to="/">
                    <img className="w-full" src="img/logo.svg" alt="Logo Signario LSE" />
                </Link>
            </header>
            <main>
                <Outlet />
                <Scripts />
                <LiveReload />
            </main>
        </body>
    </html>;
}


