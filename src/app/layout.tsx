import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Checkout Enterprise",
  description: "RecargaFácil - A maneira mais rápida e segura de recarregar seu celular.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
<body className="font-[Arial,sans-serif] text-[0.65rem] md:text-sm bg-neutral-50 bg-opacity-50">{children}</body>

    </html>
  );
}