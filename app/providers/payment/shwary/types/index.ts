/**
 * Types pour les réponses de l'API Shwary.
 */

export interface ShwaryAuthResponse {
  token: string
  refresh_token: string
  expires_in: number
  user: ShwaryUser
}

export interface ShwaryAuthRequest {
  password: string;
  phoneNumber: string
}

export interface ShwaryUser {
  id: string
  phoneNumber: string
  email: string
  firstName: string
  lastName: string
  profilePicUrl: string | null
  language: string
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
  sharedSecret: string
  notificationToken: string | null
  isMerchant: boolean
  isAdmin: boolean
  isPinProtection: boolean
  isBiometricProtection: boolean
  isLockedToDevice: boolean
  isInternational: boolean
  isStudent: boolean
  schoolName: string | null
  dailyDepositLimit: string
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'blocked'


/** Corps d'une transaction retourné par l'API Shwary (création, consultation, webhook) */
export interface ShwaryTransaction {
  id: string
  userId: string
  amount: number
  currency: string
  type: 'deposit' | 'payout' | string
  status: 'submitted' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | string
  description: string | null
  recipientPhoneNumber: string
  referenceId: string
  metadata?: Record<string, unknown> | null
  failureReason: string | null
  pretiumTransactionId: string
  payoutProviderTransactionId: string | null
  fees: number
  isReleased: boolean
  isSandbox?: boolean
  redirectUrl?: string | null
  completedAt: string | null
  txHash: string | null
  gelatoTaskId: string | null
  sponsoredGasWei?: string | null
  sponsoredGasChainId?: string | null
  callbackUrl: string | null
  createdAt?: string
  updatedAt?: string
}
