import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin': ExtractProps<(typeof import('../../inertia/pages/admin.tsx'))['default']>
    'admin/Applications/Create': ExtractProps<(typeof import('../../inertia/pages/admin/Applications/Create.tsx'))['default']>
    'admin/Applications/Detail': ExtractProps<(typeof import('../../inertia/pages/admin/Applications/Detail.tsx'))['default']>
    'admin/Applications/Edit': ExtractProps<(typeof import('../../inertia/pages/admin/Applications/Edit.tsx'))['default']>
    'admin/Applications/List': ExtractProps<(typeof import('../../inertia/pages/admin/Applications/List.tsx'))['default']>
    'admin/Commissions/List': ExtractProps<(typeof import('../../inertia/pages/admin/Commissions/List.tsx'))['default']>
    'admin/Countries/List': ExtractProps<(typeof import('../../inertia/pages/admin/Countries/List.tsx'))['default']>
    'admin/Currencies/List': ExtractProps<(typeof import('../../inertia/pages/admin/Currencies/List.tsx'))['default']>
    'admin/Dashboard': ExtractProps<(typeof import('../../inertia/pages/admin/Dashboard.tsx'))['default']>
    'admin/Logs/List': ExtractProps<(typeof import('../../inertia/pages/admin/Logs/List.tsx'))['default']>
    'admin/MobileOperators/List': ExtractProps<(typeof import('../../inertia/pages/admin/MobileOperators/List.tsx'))['default']>
    'admin/Monitoring/Dashboard': ExtractProps<(typeof import('../../inertia/pages/admin/Monitoring/Dashboard.tsx'))['default']>
    'admin/ProviderRoutes/List': ExtractProps<(typeof import('../../inertia/pages/admin/ProviderRoutes/List.tsx'))['default']>
    'admin/Providers/Create': ExtractProps<(typeof import('../../inertia/pages/admin/Providers/Create.tsx'))['default']>
    'admin/Providers/Detail': ExtractProps<(typeof import('../../inertia/pages/admin/Providers/Detail.tsx'))['default']>
    'admin/Providers/List': ExtractProps<(typeof import('../../inertia/pages/admin/Providers/List.tsx'))['default']>
    'admin/Reconciliation/List': ExtractProps<(typeof import('../../inertia/pages/admin/Reconciliation/List.tsx'))['default']>
    'admin/Routing/Config': ExtractProps<(typeof import('../../inertia/pages/admin/Routing/Config.tsx'))['default']>
    'admin/Settings/General': ExtractProps<(typeof import('../../inertia/pages/admin/Settings/General.tsx'))['default']>
    'admin/Transactions/List': ExtractProps<(typeof import('../../inertia/pages/admin/Transactions/List.tsx'))['default']>
    'admin/Users/Detail': ExtractProps<(typeof import('../../inertia/pages/admin/Users/Detail.tsx'))['default']>
    'admin/Users/List': ExtractProps<(typeof import('../../inertia/pages/admin/Users/List.tsx'))['default']>
    'admin/Webhooks/List': ExtractProps<(typeof import('../../inertia/pages/admin/Webhooks/List.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'admin/Countries/Create': ExtractProps<(typeof import('../../inertia/pages/admin/Countries/Create.tsx'))['default']>
    'admin/Currencies/Create': ExtractProps<(typeof import('../../inertia/pages/admin/Currencies/Create.tsx'))['default']>
  }
}
