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

export const metadata: Metadata = {
  title: "RoomBook",
  description: "Meeting Room Booking",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // scheme-light = ล็อกให้เบราว์เซอร์ใช้ธีมสว่างเสมอ (ไม่งั้นผู้ใช้ที่เปิดโหมดมืดจะเห็นสีเพี้ยน)
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scheme-light`}
    >
      {/* bg-white text-gray-900 = พื้นขาว ตัวหนังสือเทาเข้ม (กำหนดชัดเจน ไม่ขึ้นกับโหมดของเครื่อง) */}
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
