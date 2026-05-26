import type { Metadata } from "next";

import "../globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    template: "%s - OzCrtz",
    default: "OzCrtz store",
  },

  description:
    "Oz’sHirtz online store, Your one stop shop for all your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex flex-col">
        {/* HEADER */}
        <Header />

        {/* PAGE */}
        <main className="flex-1">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </ClerkProvider>
  );
}