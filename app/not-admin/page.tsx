import { buttonVariants } from '@/components/ui/button'
import { Card , CardHeader , CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowLeft, ShieldX } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NotAdminPage() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <Card className='max-w-md w-full'>
            <CardHeader className='text-center'>
                <div className="bg-destructive/10 p-4 rounded-full w-fit mx-auto">
                    <ShieldX className='size-16 text-destructive' />
                </div>
                <CardTitle className='text-2xl'>Accès refusé</CardTitle>
                <CardDescription className='max-w-sm text-muted-foreground mt-2'>
                    Hey! vous n&apos;avez pas la permission d&apos;accéder à cette page. Si vous pensez que c&apos;est une erreur, 
                    veuillez contacter l&apos;administrateur du site.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/" className={buttonVariants({
                    className: "w-full"
                })}>
                    <ArrowLeft className='mr-1 size-4' />
                    Retour à la page précédente
                </Link>
            </CardContent>
        </Card>
    </div>
  )
}
