/**
 * Provider sync — runs at application boot.
 * Scans code for provider classes and syncs their metadata to the database.
 * The code is the source of truth: providers are added/updated automatically,
 * never deleted.
 */
import { providerRegistry } from '#pro/provider_registry'

let synced = false

export default async function syncProviders() {
  if (synced) return
  synced = true

  try {
    await providerRegistry.discover()
    const { created, updated } = await providerRegistry.sync()

    if (created.length > 0 || updated.length > 0) {
      const parts: string[] = []
      if (created.length > 0) parts.push(`created [${created.join(', ')}]`)
      if (updated.length > 0) parts.push(`updated [${updated.join(', ')}]`)
      console.log(`[provider-sync] ${parts.join(', ')}`)
    }
  } catch (err) {
    console.error('[provider-sync] Failed to sync providers:', err)
  }
}
