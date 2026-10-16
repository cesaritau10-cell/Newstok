import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stok Center Pelotas - Gestor de Compras & Automação Python',
  description: 'Gestor inteligente de compras no atacarejo Stok Center Pelotas com lista interativa de checagem, calculadora de economia e suíte de automação Python Playwright.',
  openGraph: {
    title: 'Stok Center Pelotas - Gestor de Compras & Automação Python',
    description: 'Gestor inteligente de compras no atacarejo Stok Center Pelotas com lista interativa de checagem, calculadora de economia e suíte de automação Python Playwright.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stok Center Pelotas - Gestor de Compras & Automação Python',
    description: 'Gestor inteligente de compras e automação web Playwright para Stok Center Pelotas.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-slate-100 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
