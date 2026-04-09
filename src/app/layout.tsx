import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KZ Phantom | Planar Magnetic In-Ear Monitor — KZ Audio",
  description:
    "Experience the KZ Phantom — a premium planar magnetic IEM featuring a 13.2mm driver, 20Hz-40kHz frequency response, and semi-open back design. Engineered for audiophiles who demand perfection.",
  keywords: [
    "KZ Phantom",
    "planar magnetic",
    "IEM",
    "in-ear monitor",
    "audiophile",
    "KZ Audio",
    "hi-fi earphones",
  ],
  openGraph: {
    title: "KZ Phantom | Planar Magnetic In-Ear Monitor",
    description:
      "Premium planar magnetic IEM with 13.2mm driver. Engineered for audiophiles.",
    type: "website",
  },
};

import TransitionProvider from "@/components/TransitionProvider";
import { CompareProvider } from "@/context/CompareContext";
import ComparisonDrawer from "@/components/interactive/ComparisonDrawer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/interactive/CartDrawer";
import { Toaster } from 'react-hot-toast';
import { VisualEditorProvider } from "@/context/VisualEditorContext";
import fs from 'fs';
import path from 'path';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load configuration to provide global context
  let fullConfig = null;
  try {
    const DATA_PATH = path.join(process.cwd(), 'products_master.json');
    if (fs.existsSync(DATA_PATH)) {
      fullConfig = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to load global config in layout:', err);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#030303] text-white scroll-smooth selection:bg-cyan-500/30 selection:text-cyan-200">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#030303',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '10px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }
        }} />
        <VisualEditorProvider initialConfig={fullConfig}>
          <CompareProvider>
            <CartProvider>
              <TransitionProvider>
                {children}
              </TransitionProvider>
              <CartDrawer />
            </CartProvider>
            <ComparisonDrawer />
          </CompareProvider>
        </VisualEditorProvider>
      </body>
    </html>
  );
}
