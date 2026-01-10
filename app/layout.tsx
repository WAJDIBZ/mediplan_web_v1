import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { GlobalShell } from "@/components/layout/global-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MediPlan | Coordination médicale d’excellence",
    template: "%s | MediPlan",
  },
  description:
    "MediPlan est la plateforme premium de gestion médicale pour les cliniques et cabinets. Pilotez les équipes, optimisez les consultations et offrez une expérience patient remarquable.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    monetag: "a71227bab63051a54fde53cb5bb8abeb",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="bg-transparent">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-transparent text-[#0f172a]`}>
        <AppProviders>
          <GlobalShell>{children}</GlobalShell>
        </AppProviders>
        <Script
          src="https://gizokraijaw.net/vignette.min.js"
          data-zone="10444145"
        />
      </body>
    </html>
  );
}
