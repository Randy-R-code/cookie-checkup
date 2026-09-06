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

const title = "CookieCheckup — Browser Cookie Simulator";
const description =
  "Check, visualize, and understand how browsers handle your cookies. Analyze Set-Cookie headers, storage, request matching, SameSite, Secure, HttpOnly, Domain and Path behavior.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cookiecheckup.dev"),
  title,
  description,
  openGraph: {
    title: "CookieCheckup — Browser Cookie Simulator",
    description:
      "Check, visualize, and understand how browsers handle your cookies.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CookieCheckup — Browser Cookie Simulator",
    description:
      "Check, visualize, and understand how browsers handle your cookies.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
