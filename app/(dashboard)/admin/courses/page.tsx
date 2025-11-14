import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Vos Cours</h1>
            <Link href="/admin/courses/create/" className={buttonVariants()}>
                Créer votre cour
            </Link>
        </div>
        <div>
            <h1>Tous les cours sont disponibles ici.</h1>
        </div>
    </>
  )
}
