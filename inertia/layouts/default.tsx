import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { urlFor } from '~/client'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-lg">MM Gateway</span>
          </Link>
          <nav className="flex items-center gap-4">
            {children.props.user ? (
              <div className="flex gap-3 items-center">
                <span className="text-md font-medium">{children.props.user.initials}</span>
                <Link href={urlFor('admin.dashboard')}>
                  <Button>Dashboard</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="ghost" size="sm">Signup</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Login</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </div>
  )
}
