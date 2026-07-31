import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { providerRegistry } from '#pro/provider_registry'

export default class TestPayment extends BaseCommand {
  static commandName = 'test:payment'
  static description = 'Tester un paiement Shwary depuis le CLI sans passer par l\'API HTTP'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    // ── Arguments ────────────────────────────────────────────────────────
    const msisdn = await this.prompt.ask('Numéro MSISDN (ex: +243812345678)', {
      default: '+243812345678',
    })
    const amount = Number(await this.prompt.ask('Montant', { default: '100' }))
    const currency = await this.prompt.ask('Devise', { default: 'CDF' })

    this.logger.info(`Test paiement → ${msisdn} | ${amount} ${currency}`)

    // ── Provider ─────────────────────────────────────────────────────────
    const instance = await providerRegistry.getInstance('shwary', {
      sandbox: true,
      values: {},
    })

    if (!instance) {
      this.logger.error('Provider shwary non trouvé — le provider_sync a-t-il tourné ?')
      return
    }

    this.logger.info(`Provider: ${instance.label} (${instance.provider})`)

    // ── Test connexion ───────────────────────────────────────────────────
    const spinner = this.logger.await('Test de connexion à Shwary...')
    spinner.start()

    const connected = await instance.testConnection()
    if (!connected) {
      this.logger.error('Connexion échouée — vérifie SHWARY_ID_MARCHAND / SHWARY_SECRET dans .env')
      return
    }
    this.logger.success('Connexion OK')

    // ── Paiement ─────────────────────────────────────────────────────────
    const spinner2 = this.logger.await('Envoi du paiement...')
    spinner2.start()

    try {
      const result = await instance.createPayment({
        amount,
        currency,
        phoneNumber: msisdn,
        reference: `TEST-${Date.now()}`,
        callbackUrl: `${process.env.APP_URL ?? 'http://localhost:3333'}/api/v1/webhooks/shwary`,
      })

      this.logger.success('Paiement envoyé')

      // ── Résultat ───────────────────────────────────────────────────────
      console.log('\n' + '─'.repeat(50))
      console.log('  Résultat')
      console.log('─'.repeat(50))
      console.log(`  ID            : ${result.id}`)
      console.log(`  Référence     : ${result.reference}`)
      console.log(`  Montant       : ${result.amount} ${result.currency}`)
      console.log(`  Téléphone     : ${result.phoneNumber}`)
      console.log(`  Statut        : ${result.status}`)
      console.log(`  Provider Ref  : ${result.providerReference ?? '—'}`)
      if (result.failureReason) {
        console.log(`  ❌ Erreur     : ${result.failureReason}`)
      }
      console.log('─'.repeat(50))
    } catch (err) {
      this.logger.error('Paiement échoué')
      console.log(`\n❌ ${err instanceof Error ? err.message : String(err)}`)
    }
  }
}
