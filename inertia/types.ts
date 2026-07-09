import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

export interface Application {
  id: string
  name: string
  slug: string
  environment: 'sandbox' | 'production'
  status: 'active' | 'suspended'
  created_at: string
  updated_at: string
  users?: User[]
  countries?: Country[]
  currencies?: Currency[]
}

export interface Country {
  code: string
  application_id: string
  name: string
  currency_code: string
  phone_prefix: string
  created_at: string
  updated_at: string
}

export interface Currency {
  code: string
  application_id: string
  name: string
  symbol: string
  decimals: number
  is_active: boolean
  created_at: string
}

export interface MobileOperator {
  id: string
  application_id: string
  country_code: string
  country?: Country
  name: string
  logo_url: string | null
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export interface OperatorPrefix {
  id: string
  mobile_operator_id: string
  prefix: string
  created_at: string
}

export interface Provider {
  id: string
  name: string
  code: string
  type: 'direct' | 'aggregator'
  status: 'active' | 'inactive'
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ApplicationProvider {
  id: string
  application_id: string
  provider_id: string
  provider?: Provider
  is_enabled: boolean
  config: Record<string, any>
  environment: 'sandbox' | 'production'
  created_at: string
  updated_at: string
}

export interface ProviderRoute {
  id: string
  mobile_operator_id: string
  mobile_operator?: MobileOperator
  provider_id: string
  provider?: Provider
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  application_id: string
  mobile_operator_id: string | null
  provider_id: string | null
  provider_route_id: string | null
  idempotency_key: string
  tx_type: 'collection' | 'payout'
  msisdn: string
  provider_ref: string | null
  reference: string
  amount: number
  currency: string
  fx_rate: number
  status: 'expected' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  metadata: Record<string, any>
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface TransactionEvent {
  id: string
  transaction_id: string
  from_status: string | null
  to_status: string
  payload: Record<string, any>
  created_at: string
}

export interface Account {
  id: string
  application_id: string
  account_type: 'app_balance' | 'operator_suspense' | 'platform_revenue'
  currency: string
  balance_cached: number
  created_at: string
  updated_at: string
}

export interface LedgerEntry {
  id: string
  transaction_id: string
  account_id: string
  direction: 'debit' | 'credit'
  amount: number
  currency: string
  created_at: string
}

export interface ReconciliationEntry {
  id: string
  transaction_id: string | null
  source: string
  external_ref: string
  amount: number
  currency: string
  status: 'pending' | 'matched' | 'exception'
  matched_at: string | null
  metadata: Record<string, any>
  created_at: string
}

export interface Webhook {
  id: string
  application_id: string
  url: string
  secret_hash: string
  status: 'active' | 'inactive'
  events: string[]
  created_at: string
  updated_at: string
}

export interface WebhookDelivery {
  id: string
  webhook_id: string
  event: string
  payload: Record<string, any>
  status: 'pending' | 'success' | 'failed'
  attempts: number
  response_status: number | null
  response_body: string | null
  last_attempt_at: string | null
  created_at: string
}

export interface User {
  id: string
  application_id: string | null
  application?: Application
  name: string
  email: string
  role: string
  status: 'active' | 'suspended'
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  application_id: string
  key_type: 'public' | 'secret'
  key_hash: string
  name: string
  permissions: string[]
  expires_at: string | null
  last_used_at: string | null
  revoked_at: string | null
  created_at: string
}

export interface Commission {
  id: string
  application_id: string | null
  country_code: string | null
  currency_code: string | null
  mobile_operator_id: string | null
  provider_id: string | null
  type: 'fixed' | 'percentage'
  value: number
  min_amount: number | null
  max_amount: number | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  application_id: string | null
  action: string
  entity_type: string
  entity_id: string
  old_value: Record<string, any> | null
  new_value: Record<string, any> | null
  ip_address: string
  user_agent: string | null
  created_at: string
}

export interface DashboardStats {
  totalApplications: number
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
  successRate: number
  activeProviders: number
  recentTransactions: Transaction[]
  revenueByDay: { date: string; amount: number }[]
  transactionsByStatus: { status: string; count: number }[]
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

// Single-item response wrapper
export interface ApiResponse<T> {
  data: T
}
