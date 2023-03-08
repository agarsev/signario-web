import { json } from "@remix-run/node";
import { Meta, Outlet, Scripts, Links, LiveReload, Link, useLoaderData, useCatch } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";

export const meta = () => ({
    charset: "utf-8",
    title: "Signario | Diccionario paramétrico de LSE",
    viewport: "width=device-width,initial-scale=1",
});

import styles from "./tailwind.css";
import logo from "./img/logo_signario.png";
import favicon from "./img/favicon.png";

import { Search } from "./components/search.jsx";

export const links = () => ([
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: favicon },
]);

function Page ({ children }) {
    const isInitialMount = useRef(true);
    const main = useRef();
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            main.current?.scrollIntoView({ behavior: 'smooth' });
        }
    });
    return <html lang="es">
        <head>
            <Meta />
            <Links />
        </head>
        <body className="text-center pb-12">
            <header className="p-6 text-center">
                <Link to="/signario">
                    <img className="inline max-w-full max-h-[200px]" src={logo} alt="Logo Signario LSE" />
                </Link>
            </header>
            <main ref={main} className="text-left px-6 py-4 rounded-xl bg-stone-50 border border-stone-200">
                {children}
            </main>
            <Scripts />
            <LiveReload />
        </body>
    </html>;
}

export default function App () {
    return <Page>
        <Search />
        <Outlet />
    </Page>;
}

export function CatchBoundary () {
    const caught = useCatch();
    return <Page>
        <div>
            <h1 className="text-2xl text-red-700 my-6 text-center font-bold">Error {caught.status}</h1>
            <p className="prose lg:prose-xl my-6">Página no encontrada.</p>
        </div>
    </Page>;
}

export function ErrorBoundary ({ error }) {
    console.error(error);
    return <Page>
        <div>
            <h1 className="text-2xl text-red-700 my-6 text-center font-bold">Error</h1>
            <p className="prose lg:prose-xl my-6">Error interno de servidor.</p>
        </div>
    </Page>;
}

export const unstable_shouldReload = () => false;
