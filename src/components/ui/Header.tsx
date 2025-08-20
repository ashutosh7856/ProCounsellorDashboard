'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserCircle, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/AuthStore'

export const  Header = () => {
    const [isDropDown, setIsDropDown] = useState<boolean>(false)
    const {user, logout} = useAuthStore()
    return (
        <header className='fixed h-16 top-0 left-0 w-full bg-white shadow-md flex items-center justify-between p-6 z-50 flex-shri'>
            <Link href="/" className="flex items-center space-x-2">
            <Image
                src="/logo.png"
                alt="ProCounsel icon"
                height={40}
                width={40}
                priority
            /> 
        
            <div className="flex flex-col leading-tight">
                <h1 className={`text-2xl font-bold  text-orange-600`}>
                    ProCounsel
                </h1>
                <span className={`text-xs text-gray-500`}>
                    by <span className={`font-semibold text-gray-700`}>CatalystAI</span>
                </span>
            </div>
            </Link>
            
            <div className='relative'>
                <button onClick={()=>{setIsDropDown(!isDropDown)}} className='flex items-center space-x-2'>
                <UserCircle className='w-8 h-8 text-gray-500'/>
                </button>
                 {isDropDown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-lg py-1 border border-zinc-200 dark:border-zinc-700">
                        <div className="px-4 py-2 text-xs text-zinc-400">LOGGED IN AS</div>
                        <div className="px-4 py-2 text-sm font-medium text-black dark:text-white truncate">{user?.userId}</div>
                        <div className="border-t border-zinc-200 dark:border-zinc-700 my-1"></div>
                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}