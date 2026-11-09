
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOLTIX Electrical | Professional Electrical Services",
  description:
    "House wiring, fan and motor repair, electrical maintenance, and meter connection assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


