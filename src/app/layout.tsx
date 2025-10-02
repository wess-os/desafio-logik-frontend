import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";

import GoogleTagManager from "./components/GoogleTagManager";
import { LoaderProvider } from "./contexts/LoaderContext";
import GlobalLoader from "./components/GlobalLoader";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "L0gik - Gestão de Leads",
    description: "Teste técnico para a vaga de Desenvolvedor Full Stack",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <LoaderProvider>
                    <GoogleTagManager />

                    <Toaster position="top-right" />

                    <GlobalLoader />

                    <main>{children}</main>
                </LoaderProvider>
            </body>
        </html>
    );
}