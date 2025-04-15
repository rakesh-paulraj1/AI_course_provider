"use client"
import  {ThemeProvider} from 'next-themes'
import { SessionProvider } from "next-auth/react"
import React from "react"
export const Providers=({children}:{children:React.ReactNode})=>{
    return (<ThemeProvider  attribute={"class"} defaultTheme="system" enableSystem>
        <SessionProvider>
            {children}
        </SessionProvider>
        </ThemeProvider>
    )
}