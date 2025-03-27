import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepSeek - Eddie",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <AppContextProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <Toaster toastOptions={
            {
              success: {style: {background: "black", color: "white"}},
              error: {style: {background: "red", color: "white"}}
            }
          }/>
          {children}
        </body>
      </html>
    </AppContextProvider>
    
  );
}
