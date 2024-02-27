import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Provider} from '@/components/provider/Providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Super Cool Chat",
  description: "Created by Chris Hong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
