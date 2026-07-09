import { useEffect } from 'react'
import { router } from '@inertiajs/react'

export default function Admin() {
  useEffect(() => {
    router.visit('/admin/dashboard')
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  )
}
