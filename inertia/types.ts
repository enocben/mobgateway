import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

export interface Organization {
  id: number
  name: string
  kyc_status: 'pending' | 'approved' | 'rejected'
  status: 'active' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Application {
  id: number
  organization_id: number
  organization?: Organization
  name: string
  slug: string
  environment: 'sandbox' | 'production'
  status: 'active' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Country {
  code: string  // PK, e.g. "CD"
  name: string
  currency_code: string
  phone_prefix: string
  created_at: string
  updated_at: string
}

export interface Currency {
  code: string  // PK, e.g. "CDF"
  name: string
  symbol: string
  decimals: number
  is_active: boolean
  created_at: string
}

export interface MobileOperator {
  id: number
  country_code: string
  country?: Country
  name: string
  logo_url: string | null
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export interface OperatorPrefix {
  id: number
  mobile_operator_id: number
  prefix: string
  created_at: string
}

export interface Provider {
  id: number
  name: string
  code: string
  type: 'direct' | 'aggregator'
  status: 'active' | 'inactive'
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ProviderRoute {
  id: number
  mobile_operator_id: number
  mobile_operator?: MobileOperator
  provider_id: number
  provider?: Provider
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  application_id: number
  mobile_operator_id: number | null
  provider_id: number | null
  provider_route_id: number | null
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
  id: number
  transaction_id: number
  from_status: string | null
  to_status: string
  payload: Record<string, any>
  created_at: string
}

export interface Account {
  id: number
  application_id: number
  account_type: 'app_balance' | 'operator_suspense' | 'platform_revenue'
  currency: string
  balance_cached: number
  created_at: string
  updated_at: string
}

export interface LedgerEntry {
  id: number
  transaction_id: number
  account_id: number
  direction: 'debit' | 'credit'
  amount: number
  currency: string
  created_at: string
}

export interface ReconciliationEntry {
  id: number
  transaction_id: number | null
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
  id: number
  application_id: number
  url: string
  secret_hash: string
  status: 'active' | 'inactive'
  events: string[]
  created_at: string
  updated_at: string
}

export interface WebhookDelivery {
  id: number
  webhook_id: number
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
  id: number
  organization_id: number | null
  name: string
  email: string
  role: string
  status: 'active' | 'suspended'
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: number
  application_id: number
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
  id: number
  application_id: number | null
  country_code: string | null
  currency_code: string | null
  mobile_operator_id: number | null
  provider_id: number | null
  type: 'fixed' | 'percentage'
  value: number
  min_amount: number | null
  max_amount: number | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: number
  user_id: number | null
  application_id: number | null
  action: string
  entity_type: string
  entity_id: number
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
