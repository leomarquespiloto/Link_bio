import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Leo Marques 95 | Links oficiais",description:"Cursos, loja e comunidade Leo Marques Racing."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>;}
