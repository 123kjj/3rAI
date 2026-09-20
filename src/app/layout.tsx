import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { AuthProvider } from "@/context/AuthContext";
import { ImpactProvider } from "@/context/ImpactContext";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "3R AI — Before you throw it away, ask why.",
  description:
    "Use AI to discover whether everyday items should be reduced, reused, or recycled.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBFAF5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <AuthProvider>
          <ImpactProvider>
            <Nav />
            <main className="pb-24 md:pb-0">{children}</main>
          </ImpactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
