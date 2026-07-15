/**
 * Provider sync — runs at application boot.
 * Scans code for provider classes and syncs their metadata to the database.
 * The code is the source of truth: providers are added/updated automatically,
 * never deleted.
 */
import { providerRegistry } from '#pro/provider_registry'

try {
  await providerRegistry.discover()
  const { created, updated } = await providerRegistry.sync()

  if (created.length > 0 || updated.length > 0) {
    const parts: string[] = []
    if (created.length > 0) parts.push(`created [${created.join(', ')}]`)
    if (updated.length > 0) parts.push(`updated [${updated.join(', ')}]`)
    console.log(`[provider-sync] ${parts.join(', ')}`)
  } else {
    console.log('[provider-sync] No changes — providers up to date')
  }
} catch (err) {
  console.error('[provider-sync] Failed to sync providers:', err)
}
