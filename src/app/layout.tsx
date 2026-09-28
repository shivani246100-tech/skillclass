 import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkillClass — Learn. Teach. Grow.",
  description:
    "Live classes, expert teachers and digital PDF learning resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}