'use client';

import { usePathname } from "next/navigation";
import Head from "next/head"; 
import { useState, useEffect } from "react";
import "./globals.css";
import Navbar from "@/components/Layout/navbar";
import Footer from "@/components/Layout/footer";
import Sidebar from "@/components/AdminLayout/Sidebar";
import AdminFooter from "@/components/AdminLayout/Footer";
import FloatingSocialMedia from "@/components/Layout/floatingsocmed";
import LoadingState from '@/components/LoadingState';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat bg-[url(/img/download.png)]">
        {loading ? (
          <LoadingState /> 
        ) : (
          <div className="flex flex-col flex-grow">
            {isAdminRoute ? (
              <>
                <Sidebar />
                <main className="flex-grow">{children}</main>
                <AdminFooter />
              </>
            ) : (
              <>
                <Navbar />
                <FloatingSocialMedia />
                <main className="flex-grow">{children}</main>
                <div className="mt-14">
                  <Footer />
                </div>
              </>
            )}
          </div>
        )}
      </body>
    </html>
  );
}
