import { BasePaymentProvider, type ProviderConfig } from '#pro/base_payment_provider'
import Provider from '#models/provider'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * ProviderRegistry — auto-découvre et synchronise les classes provider avec la DB.
 *
 * Au démarrage, scanne app/providers/payment/ pour trouver les implémentations
 * concrètes, instancie chacune, et upsert leurs métadonnées dans la table `providers`.
 * Le code est la source de vérité ; la DB reflète le code.
 */
export class ProviderRegistry {
  /** Map provider identifier → constructeur de classe */
  private classes = new Map<string, new () => BasePaymentProvider>()

  /**
   * Scanner le système de fichiers pour trouver les classes provider.
   */
  async discover(): Promise<void> {
    this.classes.clear()

    const baseDir = join(import.meta.dirname ?? __dirname, 'payment')
    const entries = readdirSync(baseDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

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

          // Skip the base class
          if (ProviderClass === BasePaymentProvider) continue

          // Duck-typing: check for required abstract properties/methods
          const proto = ProviderClass.prototype
          if (
            typeof proto?.createPayment === 'function' &&
            typeof proto?.getTransaction === 'function' &&
            typeof proto?.initialize === 'function' &&
            proto?.provider !== undefined &&
            proto?.label !== undefined
          ) {
            this.classes.set(proto.provider as string, ProviderClass)
          }
        } catch (err) {
          console.warn(`[ProviderRegistry] Failed to load ${modulePath}:`, err)
        }
      }
    }
  }

  /**
   * Synchroniser les providers découverts avec la base de données.
   * - Insère les nouveaux (jamais créés)
   * - Met à jour label/description/icon (le code prime)
   * - Ne supprime jamais (on désactive, on ne supprime pas)
   */
  async sync(): Promise<{ created: string[]; updated: string[] }> {
    const created: string[] = []
    const updated: string[] = []

    for (const [providerId, ProviderClass] of this.classes) {
      const instance = new ProviderClass()
      const existing = await Provider.findBy('code', providerId)

      if (!existing) {
        await Provider.create({
          code: instance.provider,
          name: instance.provider,
          type: 'direct',
          status: 'active',
          label: instance.label,
          description: instance.description,
          icon: instance.icon,
          config: {},
        })
        created.push(providerId)
      } else {
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
          updated.push(providerId)
        }
      }
    }

    return { created, updated }
  }

  /**
   * Obtenir une instance de provider initialisée avec sa config DB.
   */
  async getInstance(
    providerId: string,
    config: ProviderConfig
  ): Promise<BasePaymentProvider | null> {
    const ProviderClass = this.classes.get(providerId)
    if (!ProviderClass) return null

    const instance = new ProviderClass()
    await instance.initialize(config)
    return instance
  }

  /**
   * Retourne tous les identifiants de providers enregistrés.
   */
  getRegisteredProviders(): string[] {
    return [...this.classes.keys()]
  }
}

/** Singleton */
export const providerRegistry = new ProviderRegistry()
