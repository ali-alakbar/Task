import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ali's Task Console",
  description: "A personal task console connected to an assistant-ready API."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
