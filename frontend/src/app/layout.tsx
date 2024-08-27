import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "./hooks/useAuth";
import { StyledEngineProvider } from "@mui/material/styles";

const inter = Inter({ subsets: ["latin"] });
const NavBar = dynamic(() => import("./components/NavBar"), {
  ssr: false,
});
const Footer = dynamic(() => import("./components/Footer"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Spring Social",
  description: "Social media application made with spring boot and next.js",
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
