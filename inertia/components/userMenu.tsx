import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Link } from '@inertiajs/react'
import { urlFor } from '~/client'
import { LogOut } from 'lucide-react'
import { cn } from '~/lib/utils'


export function UserMenu({ collapsed, user }: { collapsed: boolean; user?: { name: string; email: string } }) {
  if (!user) return null

  const initial = (user.name || '?').charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={user.name}
        className={cn(
          'flex items-center gap-2.5 rounded-md hover:bg-accent transition-colors cursor-pointer outline-none',
          collapsed ? 'p-1' : 'flex-1 min-w-0 p-1 -m-1'
        )}
      >
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-linear-to-br from-primary to-violet-500 text-white font-mono text-[11px] font-semibold shrink-0">
          {initial}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0 text-left leading-tight">
            <div className="text-[12px] font-medium truncate">{user.name}</div>
            <div className="font-mono text-[9.5px] text-muted-foreground/80 tracking-[0.06em] truncate">
              {user.email}
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={urlFor('session.destroy')}
            method="post"
            as="button"
            className="cursor-pointer w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
