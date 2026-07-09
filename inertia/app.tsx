import './css/app.css'
import { type ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'
import { type Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TooltipProvider } from '~/components/ui/tooltip'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) => {
        // Use admin layout for admin pages
        if (name.startsWith('admin')) {
          return <AdminLayout>{page}</AdminLayout>
        }
        return <Layout children={page} />
      }
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TooltipProvider>
        <TuyauProvider client={client}>
          <App {...props} />
        </TuyauProvider>
      </TooltipProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
