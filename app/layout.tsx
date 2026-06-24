import type { Metadata } from 'next';
import { Cinzel, EB_Garamond, Bebas_Neue } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-cinzel',
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Refraction of Light - Physics Presentation',
  description: 'Interactive physics presentation on the refraction of light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${cinzel.variable} ${garamond.variable} ${bebas.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
