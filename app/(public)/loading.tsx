import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <Loader className="size-4 animate-spin"/>
    </div>
  )
}
