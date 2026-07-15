/**
 * Contrat commun pour tous les providers de paiement.
 *
 * Pour ajouter un provider :
 * 1. Créer une classe héritant de BasePaymentProvider
 * 2. Implémenter toutes les méthodes abstraites
 * 3. Placer le fichier sous app/providers/payment/<nom>/
 * 4. Le provider sera auto-découvert et synchronisé au démarrage
 *
 * Règle : aucun provider ne retourne directement le format de son API.
 * Chaque provider est responsable de convertir ses réponses vers les types communs.
 */

// ── Types communs ──────────────────────────────────────────────────────────

/** Statuts normalisés — tous les providers mappent leurs statuts ici */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/** Capacités supportées par un provider */
export type ProviderCapability =
  | 'payment'
  | 'refund'
  | 'transfer'
  | 'payout'
  | 'balance'
  | 'webhook'

/** Configuration d'un provider */
export interface ProviderConfig {
  /** true = environnement sandbox, false = production */
  sandbox: boolean
  /** Paires clé/valeur spécifiques au provider (apiKey, secret, urls...) */
  values: Record<string, unknown>
}

/** Requête de paiement entrante */
export interface PaymentRequest {
  /** Montant dans la plus petite unité (ex: centimes) */
  amount: number
  /** Code devise ISO 4217 */
  currency: string
  /** Numéro de téléphone du payeur */
  phoneNumber: string
  /** Référence unique de la transaction */
  reference: string
  /** URL de callback pour notifier l'application */
  callbackUrl?: string
  /** Métadonnées arbitraires */
  metadata?: Record<string, unknown>
}

/** Filtres pour lister les transactions */
export interface TransactionFilter {
  startDate?: Date
  endDate?: Date
  status?: PaymentStatus
  limit?: number
  offset?: number
}

/** Transaction normalisée retournée par tous les providers */
export interface PaymentTransaction {
  /** Identifiant de la transaction (interne application) */
  id: string
  /** Référence unique */
  reference: string
  /** Montant dans la plus petite unité */
  amount: number
  /** Code devise ISO 4217 */
  currency: string
  /** Numéro de téléphone */
  phoneNumber: string
  /** Statut normalisé */
  status: PaymentStatus
  /** Référence côté provider (optionnel) */
  providerReference?: string
  /** Raison d'échec si status = FAILED */
  failureReason?: string
  /** Métadonnées arbitraires */
  metadata?: Record<string, unknown>
  /** Date de création */
  createdAt: Date
  /** Date de complétion (optionnel) */
  completedAt?: Date
}

/**
 * Représentation minimale d'une requête HTTP entrante
 * pour verifyWebhook / handleWebhook.
 */
export interface WebhookRequest {
  method: string
  url: string
  headers: Record<string, string | string[] | undefined>
  body: string | Record<string, unknown>
}

// ── Classe de base ─────────────────────────────────────────────────────────

export abstract class BasePaymentProvider {
  // ── Métadonnées (obligatoires) ──────────────────────────────────────────

  /** Identifiant unique (ex: "shwary", "airtel-money") */
  abstract readonly provider: string

  /** Nom lisible */
  abstract readonly label: string

  /** Description courte */
  abstract readonly description: string

  /** Icône (emoji ou chemin) */
  abstract readonly icon: string

  /** Capacités supportées */
  readonly capabilities: ProviderCapability[] = ['payment']

  // ── Méthodes obligatoires ────────────────────────────────────────────────

  /**
   * Initialiser le provider avec sa configuration.
   * Appelé avant toute autre méthode.
   */
  abstract initialize(config: ProviderConfig): Promise<void>

  /**
   * Initier un paiement (collection).
   */
  abstract createPayment(request: PaymentRequest): Promise<PaymentTransaction>

  /**
   * Récupérer une transaction par son identifiant.
   */
  abstract getTransaction(transactionId: string): Promise<PaymentTransaction>

  /**
   * Lister les transactions avec filtres optionnels.
   */
  abstract listTransactions(options?: TransactionFilter): Promise<PaymentTransaction[]>

  /**
   * Vérifier qu'un webhook entrant est authentique (signature, secret...).
   */
  abstract verifyWebhook(request: WebhookRequest): Promise<boolean>

  /**
   * Traiter un webhook entrant — retourne toujours une transaction normalisée.
   */
  abstract handleWebhook(request: WebhookRequest): Promise<PaymentTransaction>

  /**
   * Tester la connexion au provider (vérifier les credentials).
   */
  abstract testConnection(): Promise<boolean>

  /**
   * Valider une configuration avant sauvegarde.
   * Lève une exception si la configuration est invalide.
   */
  abstract validateConfiguration(config: ProviderConfig): Promise<void>
}
