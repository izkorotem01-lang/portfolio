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
      segment('t1', 'We revived a dead YouTube channel — ', false),
      segment('t2', '50K views in 10 hours.', true),
    ],
    checkpoints: [
      'Channel was inactive for about a year before the comeback edit.',
      'Comeback video crossed 50K views within the first 10 hours.',
      'Comments flooded in — audience re-engaged instantly.',
      'Fans asked who edited the video (add comment screenshots in Bottom media).',
    ],
    statistics: [
      stat('s1', 'Views', '50K'),
      stat('s2', 'To 50K', '10 hrs'),
      stat('s3', 'Subs gained', '+312%'),
      stat('s4', 'Engagement', '8.7%'),
    ],
    bottomMedia: [],
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
      'Add comment screenshots in Bottom media when ready.',
    ],
    statistics: [
      stat('s1', 'Weekly leads', '350+'),
      stat('s2', 'Marketing budget', '-50%'),
      stat('s3', 'ROI increase', '4.3x'),
      stat('s4', 'CPA reduction', '-62%'),
    ],
    bottomMedia: [],
    order: 1,
  },
  {
    _id: 'proofCard-shaked-siroa',
    cardNumber: '03',
    clientName: 'Shaked Siroa',
    clientRole: 'Content Creator',
    titleSegments: [
      segment('t1', 'A creator we took from steady posts to ', false),
      segment('t2', 'repeat viral hits.', true),
    ],
    checkpoints: [
      'Built a reel system designed for shareability, not just consistency.',
      'Multiple videos broke out — views, saves, and shares stacked fast.',
      'Personal brand started getting recognized beyond his existing audience.',
      'Upload viral reel screenshots to Bottom media (1–2 images side by side).',
    ],
    statistics: [
      stat('s1', 'Viral videos', '120+'),
      stat('s2', 'Total views', '2.3M+'),
      stat('s3', 'Avg. per hit', '48K'),
      stat('s4', 'Top reel views', '850K+'),
    ],
    headerMedia: undefined,
    bottomMedia: [],
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
