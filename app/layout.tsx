import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Jesus Disciple Profile Assessment",
  description: "耶稣门徒生命自评量表 - Assess your discipleship journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
