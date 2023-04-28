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
import logo_bbva from "./img/logo_fundacion_bbva.png";
import logo_ucm from "./img/logo_ucm.png";
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
        <body className="flex flex-col items-center min-h-[100vh]">
            <header className="p-6 text-center">
                <Link to="/signario">
                    <img className="inline max-w-full max-h-[200px]" src={logo} alt="Logo Signario LSE" />
                </Link>
            </header>
            <main ref={main} className="px-6 py-4 rounded-xl bg-stone-50 border border-stone-200 mb-16">
                {children}
            </main>
            <footer className="rounded-xl bg-stone-50 border-x border-t border-stone-200 mt-auto p-3 pb-1 text-center grid grid-cols-2 place-items-center gap-x-2 gap-y-1 lg:gap-y-0 lg:grid-cols-[auto,1fr,auto]">
                <p className="text-sm text-stone-800 col-span-2 order-2 lg:col-span-1">
                    © José María Lahoz-Bengoechea &amp; Antonio F. G. Sevilla
                    <a className="hover:underline text-primary-600 ml-2" href="https://www.ucm.es/signario" target="_blank">→ Saber más</a>
                </p>
                <a className="inline-block max-w-[200px] order-2 lg:order-1 lg:row-span-3" href="https://www.fbbva.es/" target="_blank">
                    <img src={logo_bbva} alt="Fundación BBVA" />
                </a>
                <a className="inline-block max-w-[200px] order-2 lg:col-start-3 lg:row-span-3" href="https://www.ucm.es/" target="_blank">
                    <img src={logo_ucm} alt="Universidad Complutense de Madrid" />
                </a>
                <p className="text-sm text-stone-800 col-span-2 lg:col-span-1 order-2 pt-1">
                Proyecto realizado con la Beca Leonardo a Investigadores y Creadores Culturales 2021 de la Fundación BBVA.
                </p>
                <p className="text-xs text-stone-700 col-span-2 lg:col-span-1 order-2">
                La Fundación BBVA no se responsabiliza de las opiniones, comentarios y contenidos incluidos en el proyecto y/o los resultados obtenidos del mismo, los cuales son total y absoluta responsabilidad de sus autores.
                </p>
            </footer>
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
