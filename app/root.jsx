import { json } from "@remix-run/node";
import { Meta, Outlet, Scripts, Links, LiveReload, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";

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

export default function App() {
    const userPrefs = useLoaderData();
    const [prefs, _setPrefs] = useState(userPrefs);
    const setPrefs = (upd) => {
        const nup = {...prefs, ...upd};
        setCookies(nup);
        _setPrefs(nup);
    };
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
                <Outlet context={[prefs, setPrefs]} />
            </main>
            <Scripts />
            <LiveReload />
        </body>
    </html>;
}

export const unstable_shouldReload = () => false;
