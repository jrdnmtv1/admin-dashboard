import "./globals.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AuthProvider } from "./context/auth-context";

export const metadata = {
  title: "Admin Dashboard",
  description: "Panel administrativo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-white font-sans transition-colors">
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
              <Header />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
