import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error(
      'Missing SANITY_TOKEN. Create a write token and run:\n' +
        '  $env:SANITY_TOKEN="your-token"; node studio-rotem-portfolio/scripts/unset-cta-portraits.mjs',
    )
  }

  await client
    .patch('rizzPage')
    .unset(['founders.ctaPortraitLeft', 'founders.ctaPortraitRight'])
    .commit()

  console.log('Unset founders.ctaPortraitLeft and founders.ctaPortraitRight on rizzPage.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
