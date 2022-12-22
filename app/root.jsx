import { json } from "@remix-run/node";
import { Meta, Outlet, Scripts, Links, LiveReload, Link, useLoaderData, useCatch } from "@remix-run/react";
import { useState } from "react";

export const meta = () => ({
    charset: "utf-8",
    title: "Signario | Diccionario paramétrico de LSE",
    viewport: "width=device-width,initial-scale=1",
});

import styles from "./tailwind.css";
import logo from "./img/logo.svg";
import favicon from "./img/favicon.png";

export const links = () => ([
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: favicon },
]);

const DEFAULT_PREFS = {
    input_method: "pregunton"
};

export async function loader ({ request }) {
    const cookies = request.headers.get("Cookie")?.split(";")?.reduce((acc, pair) => {
            const [k, v] = pair.split("=");
            acc[k.trim()] = v.trim();
            return acc;
        }, DEFAULT_PREFS) || DEFAULT_PREFS;
    return json(cookies);
};

function setCookies (obj) {
    Object.keys(obj).forEach(k => {
        document.cookie = `${k}=${obj[k]}`;
    });
}

function Page ({ children }) {
    return <html lang="es">
        <head>
            <Meta />
            <Links />
        </head>
        <body className="max-w-xl mx-auto min-h-screen pb-12">
            <header className="py-6">
                <Link to="/signario">
                    <img className="w-full" src={logo} alt="Logo Signario LSE" />
                </Link>
            </header>
            <main className="-mx-6 px-6 py-4 rounded-xl bg-stone-50 border border-stone-200">
                {children}
            </main>
            <Scripts />
            <LiveReload />
        </body>
    </html>;
}

export default function App () {
    const userPrefs = useLoaderData();
    const [prefs, _setPrefs] = useState(userPrefs);
    const setPrefs = (upd) => {
        const nup = {...prefs, ...upd};
        setCookies(nup);
        _setPrefs(nup);
    };
    return <Page>
        <Outlet context={[prefs, setPrefs]} />
    </Page>;
}

export function CatchBoundary () {
    const caught = useCatch();
    return <Page>
        <h1 className="text-2xl text-red-700 my-6 text-center font-bold">Error {caught.status}</h1>
        <p className="prose lg:prose-xl my-6">Página no encontrada.</p>
    </Page>;
}

export function ErrorBoundary ({ error }) {
    console.error(error);
    return <Page>
        <h1 className="text-2xl text-red-700 my-6 text-center font-bold">Error</h1>
        <p className="prose lg:prose-xl my-6">Error interno de servidor.</p>
    </Page>;
}

export const unstable_shouldReload = () => false;
