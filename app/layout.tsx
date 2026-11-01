
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "הנה זה משיח בא – מגיע עד אליך לבית",
  description: "הזמנת דגלים, שלטים ומוצרי הקמפיין",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
