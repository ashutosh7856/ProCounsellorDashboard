'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import {Header} from "@/components/ui/Header";
import {useAuthStore} from "@/store/AuthStore"
import { usePathname } from "next/navigation";
import { useEffect} from "react";
import {useRouter} from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
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

  if (!isInitialized || (!user && pathname !== '/login' )) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-4 w-full max-w-md mx-auto p-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-3 gap-4 mt-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

 
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        
       {!hidepath &&   <Header/>}
        <ToastContainer
         position="top-right"
         autoClose={3000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
         theme="light"
         toastStyle={{ zIndex: 99999 }}
       />
       <main className={hidepath?'pt-0':'pt-16'}>
        {children}
        </main>
      </body>
    </html>
  );
}
