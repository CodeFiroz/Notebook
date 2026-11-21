import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Caveat } from 'next/font/google';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'How I remember today',
  description:
    'A calm, tactile daily habit tracker, mood log, handwritten journal, and ideas scratchpad.',
  openGraph: {
    title: 'How I remember today',
    description:
      'A calm, tactile daily habit tracker, mood log, handwritten journal, and ideas scratchpad.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How I remember today',
    description:
      'A calm, tactile daily habit tracker, mood log, handwritten journal, and ideas scratchpad.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('hd-theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (t) document.documentElement.dataset.theme = t;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased selection:bg-[#ff6a3d]/20" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
