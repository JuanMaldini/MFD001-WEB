import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Design Planner - Modernfold",
    description: "Modernfold Design Planner Web App",
    icons: {
    icon: "/modern.png",
    shortcut: "/modern.png",
    apple: "/modern.png",
  },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-300">
                {children}
            </body>
        </html>
    );
}
