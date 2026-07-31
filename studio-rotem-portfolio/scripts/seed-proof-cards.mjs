import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const media = (youtubeUrl) => ({
  _type: 'proofCardMedia',
  youtubeUrl,
})

const quoteMedia = (key, quote) => ({
  _key: key,
  _type: 'proofCardMedia',
  quote,
})

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

/** Three People / Three Real Outcomes — primary site cards */
export const OUTCOME_PROOF_CARDS = [
  {
    _id: 'proofCard-noam-firuz',
    cardNumber: '01',
    clientName: 'Noam Firuz',
    clientRole: 'Content Creator',
    headerMedia: media('https://www.youtube.com/watch?v=lPB_KyjWZko'),
    titleSegments: [
      segment('t1', 'One edit reignited a dead channel — ', false),
      segment('t2', '46K views, audience back.', true),
    ],
    checkpoints: [
      'Channel was inactive for about a year before the comeback edit.',
      'Comeback video reached 46K views and kept climbing.',
      'Comments flooded in — audience re-engaged instantly.',
      'Fans asked who edited the video.',
    ],
    statistics: [
      stat('s1', 'Views', '46K'),
      stat('s2', 'New subs', '+340'),
      stat('s3', 'Engagement', '8.7%'),
      stat('s4', 'Channel dormant', '1 yr'),
    ],
    bottomMedia: [
      quoteMedia(
        'q1',
        'My channel was dead for a year. One edit. 50K views in 10 hours. Who does that?!',
      ),
      quoteMedia(
        'q2',
        'Comments flooded in asking one thing: who the hell edited this?',
      ),
    ],
    order: 0,
  },
  {
    _id: 'proofCard-yishai-gabian',
    cardNumber: '02',
    clientName: 'Yishai Gabian',
    clientRole: 'Entrepreneur & Mentor',
    headerMedia: media('https://www.youtube.com/watch?v=DR0deXOlWJQ'),
    titleSegments: [
      segment('t1', 'Half the ad spend. ', false),
      segment('t2', 'Hundreds of leads every week.', true),
    ],
    checkpoints: [
      'Worked together for over 6 months on YouTube, reels, and campaigns.',
      'Marketing budget cut by ~50% while lead volume kept climbing.',
      'Hundreds of qualified leads every week from organic + paid.',
    ],
    statistics: [
      stat('s1', 'Weekly leads', '350+'),
      stat('s2', 'Marketing budget', '-50%'),
      stat('s3', 'ROI increase', '4.3x'),
      stat('s4', 'Cost per lead', '₪15'),
    ],
    bottomMedia: [
      quoteMedia(
        'q1',
        'Halved our ad spend. Halved cost per lead. Saved ~₪15K — and leads went UP.',
      ),
      quoteMedia(
        'q2',
        'Fire video. Zero revisions. Shut up and take my money for the next one.',
      ),
    ],
    order: 1,
  },
  {
    _id: '5e296c36-0e9f-4229-8ab8-4b6a8fb16dd7',
    cardNumber: '03',
    clientName: 'Shaked Siroa',
    clientRole: 'Co-Founder · Personal Brand',
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
    headerMedia: undefined,
    bottomMedia: [
      quoteMedia(
        'q1',
        '60K without the edit. 1M+ with it. The edit IS the strategy.',
      ),
      quoteMedia(
        'q2',
        'Absolute king. Insane work. This is why we built RIZZ around this.',
      ),
    ],
    order: 2,
  },
]

const LEGACY_CARD_IDS = [
  '2621e06f-8742-427c-9a22-da0dfefcca5f',
  'proofCard-analytics',
  'proofCard-leads',
  'proofCard-authority',
  'proofCard-viral',
  'proofCard-jewelry',
  'proofCard-industry',
  'proofCard-cafe',
  'proofCard-tattoo',
  'proofCard-shaked-siroa',
]

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error(
      'Missing SANITY_TOKEN. Create a write token at https://sanity.io/manage/project/v9h3c4gc/api and run:\n' +
        '  $env:SANITY_TOKEN="your-token"; npm run seed:proof',
    )
  }

  const tx = client.transaction()

  for (const id of LEGACY_CARD_IDS) {
    tx.patch(id, (patch) => patch.set({active: false}))
  }

  for (const card of OUTCOME_PROOF_CARDS) {
    const {headerMedia, bottomMedia, ...rest} = card
    tx.createOrReplace({
      _type: 'proofCard',
      active: true,
      ...rest,
      ...(headerMedia ? {headerMedia} : {}),
      bottomMedia: bottomMedia ?? [],
    })
  }

  await tx.commit()
  console.log(`Seeded ${OUTCOME_PROOF_CARDS.length} outcome cards (legacy cards deactivated).`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
