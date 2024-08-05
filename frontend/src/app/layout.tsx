import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "@mui/material/styles";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "./hooks/useAuth";
import { StyledEngineProvider } from "@mui/material/styles";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const inter = Inter({ subsets: ["latin"] });
const NavBar = dynamic(() => import("./components/NavBar"), {
  ssr: false,
});
const Footer = dynamic(() => import("./components/Footer"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>
            <NavBar />
            <div id="main">{children}</div>
            <Footer />
          </body>
        </html>
      </AuthProvider>
    </StyledEngineProvider>
  );
}
