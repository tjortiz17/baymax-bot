import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Baymax Chat Bot",
  description: "A Google Gemini AI chatbot set to operate as Baymax from Big Hero Six",
  icons: {
    icon: "favicon.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
