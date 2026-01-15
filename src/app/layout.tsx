import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "White Rose Speakers Leeds | Toastmasters Club",
    template: "%s | White Rose Speakers Leeds",
  },
  description:
    "Empower your voice with White Rose Speakers Leeds Toastmasters. Join our supportive community to develop communication and leadership skills in Leeds, UK.",
  keywords: [
    "Toastmasters",
    "Leeds",
    "public speaking",
    "communication skills",
    "leadership",
    "White Rose Speakers",
    "presentation skills",
  ],
  authors: [{ name: "White Rose Speakers Leeds" }],
  creator: "White Rose Speakers Leeds",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://whiterosespeakers.co.uk",
    siteName: "White Rose Speakers Leeds",
    title: "White Rose Speakers Leeds | Toastmasters Club",
    description:
      "Empower your voice with White Rose Speakers Leeds Toastmasters. Join our supportive community to develop communication and leadership skills.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "White Rose Speakers Leeds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "White Rose Speakers Leeds | Toastmasters Club",
    description:
      "Empower your voice with White Rose Speakers Leeds Toastmasters.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
