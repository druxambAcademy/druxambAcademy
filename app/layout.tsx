import "@coinbase/onchainkit/styles.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import OnchainProvider from "@/providers/OnchainKitProvider";
import { connectToMongoDB } from "@/lib/db";
import { initalizeContracts } from "@/lib/initalizeContracts";
import LoadingState from "@/components/loading-state";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Onchain",
  description: "OnchainLearn - Empowering communities to learn and build onchain solutions with learnOnchain, an LMS platform to foster innovation and bring the next billion users Onchain.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToMongoDB();
  initalizeContracts();

  return (
    <ClerkProvider>
      <OnchainProvider>
        <html lang="en">
          <body className={inter.className}>
            <LoadingState>
              <ConfettiProvider />
              <ToastProvider />
              {children}
            </LoadingState>
          </body>
        </html>
      </OnchainProvider>
    </ClerkProvider>
  );
}