import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const quoteMedia = (key, quote) => ({
  _key: key,
  _type: 'proofCardMedia',
  isMain: false,
  quote,
})

/** Explosive hook quotes — Sanity is source of truth */
const PROOF_CARD_QUOTES = {
  '657249b5-77bd-462d-899d-3c982558ce8f': [
    quoteMedia(
      'q1',
      'My channel was dead for a year. One edit. 50K views in 10 hours. Who does that?!',
    ),
    quoteMedia(
      'q2',
      'Comments flooded in asking one thing: who the hell edited this?',
    ),
  ],
  'f56c1e38-9365-4cb2-bb8f-ecd3c7e15ac7': [
    quoteMedia(
      'q1',
      'Halved our ad spend. Halved cost per lead. Saved ~₪15K — and leads went UP.',
    ),
    quoteMedia(
      'q2',
      'Fire video. Zero revisions. Shut up and take my money for the next one.',
    ),
  ],
  '5e296c36-0e9f-4229-8ab8-4b6a8fb16dd7': [
    quoteMedia(
      'q1',
      '60K without the edit. 1M+ with it. The edit IS the strategy.',
    ),
    quoteMedia('q2', 'Absolute king. Insane work. This is why we built RIZZ around this.'),
  ],
}

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error('Missing SANITY_TOKEN.')
  }

  const tx = client.transaction()

  for (const [id, bottomMedia] of Object.entries(PROOF_CARD_QUOTES)) {
    tx.patch(id, (patch) => patch.set({bottomMedia}))
  }

  await tx.commit()
  console.log(`Updated hook quotes on ${Object.keys(PROOF_CARD_QUOTES).length} proof cards.`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
