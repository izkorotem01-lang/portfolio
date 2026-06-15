import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const SHAKED_CARD_ID = '5e296c36-0e9f-4229-8ab8-4b6a8fb16dd7'

const segment = (key, text, accent = false) => ({
  _key: key,
  _type: 'proofCardTitleSegment',
  text,
  accent,
})

const stat = (key, label, value) => ({
  _key: key,
  _type: 'proofCardStatistic',
  label,
  value,
})

const quoteMedia = (key, quote) => ({
  _key: key,
  _type: 'proofCardMedia',
  isMain: false,
  quote,
})

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error(
      'Missing SANITY_TOKEN. Run with a Sanity write token or `sanity login` session token.',
    )
  }

  const existing = await client.fetch(
    `*[_id == $id][0]{ headerMedia }`,
    {id: SHAKED_CARD_ID},
  )

  if (!existing) {
    throw new Error(`Proof card not found: ${SHAKED_CARD_ID}`)
  }

  await client
    .patch(SHAKED_CARD_ID)
    .set({
      clientName: 'Shaked Siroa',
      clientRole: 'Co-Founder · Personal Brand',
      cardNumber: '03',
      order: 2,
      active: true,
      titleSegments: [
        segment('t1', 'Our own personal brand — ', false),
        segment('t2', 'a decade of content, now viral.', true),
      ],
      checkpoints: [
        'Co-founder with nearly 10 years of content creation experience.',
        'Built a reel system with RIZZ that turned consistency into viral reach.',
        'Personal brand and RIZZ Productions grow together — same engine, same standards.',
        'Audience scaled through scroll-stopping branded content, not random posts.',
      ],
      statistics: [
        stat('s1', 'Viral videos', '120+'),
        stat('s2', 'Total views', '10M+'),
        stat('s3', 'Years creating', '10+'),
        stat('s4', 'Top reel views', '1M+'),
      ],
      bottomMedia: [
        quoteMedia(
          'q1',
          "Most of the credit goes to the edit — otherwise we'd be stuck at 60K views.",
        ),
        quoteMedia('q2', "You're insane, bro — absolute king."),
      ],
      ...(existing.headerMedia ? {headerMedia: existing.headerMedia} : {}),
    })
    .commit()

  console.log(`Updated Shaked proof card in Sanity (${SHAKED_CARD_ID}).`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
