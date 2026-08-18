import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

/**
 * Replaces the retired linear 5-step process with the 3-tier branching tree.
 * Both engines share step '02' because they run in parallel, not in sequence.
 */
const PROCESS_NODES = [
  {
    _key: 'root',
    _type: 'processStep',
    tier: 'root',
    step: '01',
    icon: 'search',
    title: {en: 'DIAGNOSE & STRATEGIZE', hb: 'אבחון ואסטרטגיה'},
    description: {
      en: 'Clarity on your goals, audience, content gaps, and technological bottlenecks.',
      hb: 'מיפוי העסק, הקהל, פערי התוכן וצווארי הבקבוק הטכנולוגיים.',
    },
  },
  {
    _key: 'creative',
    _type: 'processStep',
    tier: 'creative',
    step: '02',
    icon: 'clapperboard',
    title: {en: 'THE CREATIVE ENGINE', hb: 'מנוע הקריאייטיב'},
    description: {
      en: 'Video production, storytelling, and premium content designed to connect and convert.',
      hb: 'הפקות וידאו, סטוריטלינג ותוכן פרימיום שנועד לחבר ולהמיר.',
    },
    laneLabel: {en: 'Creative Arm', hb: 'הזרוע הקריאייטיבית'},
  },
  {
    _key: 'tech',
    _type: 'processStep',
    tier: 'tech',
    step: '02',
    icon: 'cpu',
    title: {en: 'THE TECH ENGINE', hb: 'המנוע הטכנולוגי'},
    description: {
      en: 'Landing pages, websites, AI agents, and automations to streamline your business.',
      hb: 'דפי נחיתה, בניית אתרים, סוכני AI ואוטומציות ייעודיות.',
    },
    laneLabel: {en: 'Tech Arm', hb: 'הזרוע הטכנולוגית'},
  },
  {
    _key: 'canopy',
    _type: 'processStep',
    tier: 'canopy',
    step: '03',
    icon: 'trending',
    title: {en: 'OPTIMIZE & SCALE', hb: 'אופטימיזציה וסקייל'},
    description: {
      en: 'Combining systems and content for exponential, compounding growth.',
      hb: 'שילוב המערכות והתוכן לכדי צמיחה אקספוננציאלית מהירה ורווחית יותר.',
    },
  },
]

const REQUIRED_TIERS = ['root', 'creative', 'tech', 'canopy']

const VERIFY_QUERY = `*[_id == "rizzPage"][0].howWeGetYouThere.process[]{
  tier, step,
  "titleOk": defined(title.en) && defined(title.hb),
  "descOk": defined(description.en) && defined(description.hb)
}`

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error('Missing SANITY_TOKEN.')
  }

  await client.patch('rizzPage').set({'howWeGetYouThere.process': PROCESS_NODES}).commit()

  console.log(`Migrated howWeGetYouThere.process to ${PROCESS_NODES.length} tiered nodes.`)

  // Self-verify: the frontend throws on any missing locale, so prove both are present
  // for every node before anyone ships a build against this content.
  const rows = await client.fetch(VERIFY_QUERY)
  console.table(rows)

  const tiers = rows.map((row) => row.tier)
  const missing = REQUIRED_TIERS.filter((tier) => !tiers.includes(tier))
  const incomplete = rows.filter((row) => !row.titleOk || !row.descOk)

  if (missing.length > 0) {
    throw new Error(`Verification failed — missing tiers: ${missing.join(', ')}`)
  }
  if (incomplete.length > 0) {
    throw new Error(
      `Verification failed — incomplete locales on: ${incomplete.map((r) => r.tier).join(', ')}`,
    )
  }

  console.log('Verified: all 4 tiers present with en + hb on title and description.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
