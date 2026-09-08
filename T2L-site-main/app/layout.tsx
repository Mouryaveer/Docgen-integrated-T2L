import type { Metadata } from "next";
import { Inter, Poppins, DM_Mono } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import LegalChatbot from "./components/LegalChatbot";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Turn2Law: India's Legal Operating System",
  description: "India's Legal OS. One platform, two audiences: founders and lawyers. Legal Services, Doc Engine, and Introspector, all grounded in Indian law.",
  // Icons are resolved from the app/ file conventions:
  // app/favicon.ico, app/icon.png, app/apple-icon.png
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <div className="fixed bottom-6 right-6 z-50">
          <LegalChatbot />
        </div>
      </body>
    </html>
  );
}

