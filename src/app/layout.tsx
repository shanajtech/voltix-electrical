
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M/S KHAJA ENTERPRISE | Electrical Services in Dhaka",
  description:
    "Building electrical contracts, roof conduits, wiring, switchboards, earthing, meter assistance and fan repairs in Merajnagar, Shyampur, Dhaka. Discuss scope, labour, materials and price directly.",
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
