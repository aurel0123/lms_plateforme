"use client"
import { Ban, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '../ui/button'

interface AppProps {
    buttonText? : string , 
    description?: string , 
    title? : string , 
    link : string
}
export default function EmptyState({buttonText , description , title , link} : AppProps) {
  return (
    <div 
        className='flex flex-1 flex-col h-full border border-dashed items-center justify-center rounded-md animate-in- fade-in-50 p-8 text-center'
    >
        <div className='flex items-center justify-center rounded-full size-20 bg-primary/10'>
            <Ban className='size-10 text-primary'/>
        </div>
        <h1 className='mt-6 font-semibold text-xl'>{title}</h1>
        <p className='mb-6 mt-2 text-sm text-muted-foreground text-center leading-tight'>{description}</p>
        <Link href={link} className={buttonVariants()}>
            <PlusCircle />
            {buttonText}
        </Link>
    </div>
  )
}
