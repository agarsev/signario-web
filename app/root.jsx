import { Meta, Outlet, Scripts, Links, LiveReload, Link } from "@remix-run/react";

export const meta = () => ({
  charset: "utf-8",
    title: "Signario | Diccionario paramétrico de LSE",
  viewport: "width=device-width,initial-scale=1",
});

import styles from "./tailwind.css";

export const links = () => ([
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: "/favicon.png" },
]);

export default function App() {
    return <html lang="es">
        <head>
            <Meta />
            <Links />
        </head>
        <body className="max-w-xl mx-auto min-h-screen pb-12">
            <header className="py-6">
                <Link to="/">
                    <img className="w-full" src="/img/logo.svg" alt="Logo Signario LSE" />
                </Link>
            </header>
            <main className="-mx-6 px-6 py-4 rounded-xl bg-stone-50 border border-stone-200">
                <Outlet />
            </main>
            <Scripts />
            <LiveReload />
        </body>
    </html>;
}

export const unstable_shouldReload = () => false;
