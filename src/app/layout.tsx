import type { Metadata } from "next";
import { Providers } from "./providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yield.co — Valuation de Ações e FIIs",
  description:
    "Screener open source de valuation. Rankeie ações e FIIs pelos métodos Graham, Bazin e múltiplos fundamentalistas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {/* Sidebar fixa — visível apenas no desktop */}
          <Sidebar />

          {/* Área principal: deslocada para a direita da sidebar no desktop */}
          <div className="md:ml-56 flex flex-col min-h-screen">
            <Header />

            {/* Conteúdo scrollável abaixo do header */}
            <main className="flex-1 mt-14 px-4 py-6 max-w-7xl w-full mx-auto">
              {children}
            </main>

            {/* Rodapé simples */}
            <footer className="mt-auto px-4 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Yield.co — Open source. Dados: brapi.dev, BCB
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
