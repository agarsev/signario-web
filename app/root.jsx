import { Meta, Outlet, Scripts } from "@remix-run/react";

export const meta = () => ({
  charset: "utf-8",
    title: "Signario | Diccionario paramétrico de LSE",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
    return <html lang="es">
        <head>
            <Meta />
        </head>
        <body>
            <header>
                Signario LSE
            </header>
            <main>
                <Outlet />
                <Scripts />
            </main>
        </body>
    </html>;
}


