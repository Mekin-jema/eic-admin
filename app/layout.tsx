import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Power Ethiopia Admin Dashboard",
  description: "Admin panel for Power Ethiopia registration analytics and management",
  keywords: ["Power Ethiopia", "Admin Dashboard", "Registrations", "Analytics"],
  authors: [{ name: "Power Ethiopia", url: "https://powerethio.com/" }],
  openGraph: {
    title: "Power Ethiopia Admin Dashboard",
    description: "View registration analytics and manage users",
    url: "https://powerethio.com/",
    siteName: "Power Ethiopia",
    type: "website",
  },
    icons: {
    icon: "/logo.png",

  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
               {/* <Toaster /> */}
          </ThemeProvider>
        </body>
      </html>
  );
}
