import './globals.css';

import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <h1 className="text-3xl"><Link href="/">Signario</Link></h1>
        {children}
      </body>
    </html>
  );
}
