'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Header} from "@/components/ui/Header";
import {useAuthStore} from "@/store/AuthStore"
import { usePathname } from "next/navigation";
import { useEffect} from "react";
import {useRouter} from "next/navigation";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// export const metadata: Metadata = {
//   title: "ProCounsel-Admin",
//   description: "This is the amdin section of procounsel",
// };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user, isInitialized, initializeAuth} = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const hidepath = pathname === '/login' 


  useEffect(()=>{
    initializeAuth()
  }, [initializeAuth])



  useEffect(()=>{
    if(!isInitialized) return 

    if(!user){
      router.push('/login')
    }else if(user){
      router.push('/')
    }
  }, [user, router,isInitialized])

 
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
       {!hidepath &&   <Header/>}
       <main className={hidepath?'pt-0':'pt-16'}>
        {children}
        </main>
      </body>
    </html>
  );
}
