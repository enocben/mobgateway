import { BasePaymentProvider } from '#pro/base_payment_provider'
import Provider from '#models/provider'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * ProviderRegistry — auto-discovers and synchronizes provider classes with the database.
 *
 * On startup, it scans app/providers/payment/ for concrete implementations,
 * instantiates each one, and upserts their metadata into the `providers` table.
 * The code is the source of truth; the DB mirrors it.
 */
export class ProviderRegistry {
  /** Map of provider code → class constructor */
  private classes = new Map<string, new () => BasePaymentProvider>()

  /** Map of provider code → live instance (initialized with config) */
  private instances = new Map<string, BasePaymentProvider>()

  /**
   * Scan the filesystem for provider classes under app/providers/payment/.
   * Dynamically imports each discovered module and registers the constructor.
   */
  async discover(): Promise<void> {
    this.classes.clear()

    const baseDir = join(import.meta.dirname ?? __dirname, 'payment')
    const entries = readdirSync(baseDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      // Find the provider file (e.g., shwary_provider.ts)
      const subDir = join(baseDir, entry.name)
      const files = readdirSync(subDir).filter(
        (f) => f.endsWith('_provider.ts') || f.endsWith('_provider.js')
      )

      for (const file of files) {
        const modulePath = join(subDir, file)
        const moduleUrl = pathToFileURL(modulePath).href

        try {
          const mod = await import(moduleUrl)
          const ProviderClass = mod.default ?? mod[Object.keys(mod)[0]]

          if (ProviderClass?.prototype instanceof BasePaymentProvider || ProviderClass === BasePaymentProvider) {
            // Skip the base class itself
            continue
          }

          // Verify it extends BasePaymentProvider by duck-typing
          const proto = ProviderClass.prototype
          if (
            typeof proto?.collectPayment === 'function' &&
            typeof proto?.getPaymentStatus === 'function' &&
            proto?.code !== undefined
          ) {
            this.classes.set(proto.code as string, ProviderClass)
          }
        } catch (err) {
          console.warn(`[ProviderRegistry] Failed to load provider from ${modulePath}:`, err)
        }
      }
    }
  }

  /**
   * Sync discovered providers with the database.
   * - Inserts new providers that don't exist yet
   * - Updates label/description/icon for existing providers
   * - Never deletes anything (providers can be disabled, not removed)
   */
  async sync(): Promise<{ created: string[]; updated: string[] }> {
    const created: string[] = []
    const updated: string[] = []

    for (const [code, ProviderClass] of this.classes) {
      const instance = new ProviderClass()
      const existing = await Provider.findBy('code', code)

      if (!existing) {
        await Provider.create({
          code: instance.code,
          name: instance.code, // legacy column, kept for backward compat
          type: 'direct',
          status: 'active',
          label: instance.label,
          description: instance.description,
          icon: instance.icon,
          config: {},
        })
        created.push(code)
      } else {
        // Sync metadata from code → DB (code is source of truth)
        let changed = false
        if (existing.label !== instance.label) {
          existing.label = instance.label
          changed = true
        }
        if (existing.description !== instance.description) {
          existing.description = instance.description
          changed = true
        }
        if (existing.icon !== instance.icon) {
          existing.icon = instance.icon
          changed = true
        }
        if (changed) {
          await existing.save()
          updated.push(code)
        }
      }
    }

    return { created, updated }
  }

  /**
   * Get a provider instance initialized with config from the DB.
   * Used by the transaction flow to execute payments.
   */
  async getInstance(code: string, config: Record<string, unknown>): Promise<BasePaymentProvider | null> {
    const ProviderClass = this.classes.get(code)
    if (!ProviderClass) return null

    const instance = new ProviderClass()
    instance.init(config)
    return instance
  }

  /**
   * Returns all registered provider codes.
   */
  getRegisteredCodes(): string[] {
    return [...this.classes.keys()]
  }
}

/** Singleton instance */
export const providerRegistry = new ProviderRegistry()
