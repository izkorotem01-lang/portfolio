import {execFileSync} from 'node:child_process'
import {readFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const snapshotPath = join(repoRoot, 'public', 'cms', 'site-content.json')
const fetchScript = join(repoRoot, 'scripts', 'fetch-cms-content.mjs')

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const withIntro = args.has('--with-intro')
const skipSnapshot = args.has('--skip-snapshot')

const TARGET_NAME_EN = 'Pelle Bino'

/** Swap `role` to SHORT_ROLE to guarantee a single line down to ~1024px. */
const FULL_ROLE = {en: 'Co-Founder & Technological Partner · CTO', hb: 'שותף מייסד וטכנולוגי · CTO'}
const SHORT_ROLE = {en: 'Co-Founder & Tech Partner · CTO', hb: 'שותף מייסד וטכנולוגי · CTO'}

const CARD = {
  variant: 'portrait',
  name: {en: TARGET_NAME_EN, hb: 'פלא בינו'},
  role: FULL_ROLE,
  badge: {en: 'AI Agents — Coming Soon', hb: 'סוכני AI — בקרוב'},
  keywords: {
    en: 'Landing Pages • Websites • AI Automations',
    hb: 'דפי נחיתה • אתרים • אוטומציות AI',
  },
  bio: {
    en: "Drives RIZZ's technical infrastructure, automated systems, and software scaling. Specializes in building high-converting websites, landing pages, and custom AI workflows while educating creators and businesses on technology and scale.",
    hb: 'מוביל את התשתית הטכנולוגית, האוטומציות והתוכנה ב-RIZZ לפיתוח העסק ל-Scale. מתמחה בבניית אתרים, דפי נחיתה ומערכות AI, לצד הנגשת ידע טכנולוגי ועסקי ברשתות.',
  },
}

const INTRO = {
  en: 'RIZZ Productions is led by three founders who have been on both sides of the camera — and behind the technology that scales it. Strategy, creative, and engineering in one team, building content systems that grow without sacrificing quality.',
  hb: 'את RIZZ Productions מובילים שלושה מייסדים שעמדו משני צידי המצלמה — וגם מאחורי הטכנולוגיה שמניעה אותה. אסטרטגיה, קריאייטיב ופיתוח בצוות אחד, שבונה מערכות תוכן שגדלות בלי להתפשר על איכות.',
}

const SNAPSHOT_ATTEMPTS = 3
const SNAPSHOT_RETRY_MS = 5000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fail = (message) => {
  console.error(`\nABORTED: ${message}\n`)
  process.exit(1)
}

/** Escapes non-ASCII so Hebrew stays verifiable on terminals that are not UTF-8. */
const printable = (value) =>
  JSON.stringify(value, null, 2).replace(/[\u0080-\uffff]/g, (char) => {
    return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
  })

const localesMatch = (a, b) => a?.en === b?.en && a?.hb === b?.hb

const runSnapshot = () => {
  execFileSync(process.execPath, [fetchScript], {cwd: repoRoot, stdio: 'inherit'})
}

const snapshotIsFresh = async () => {
  const parsed = JSON.parse(await readFile(snapshotPath, 'utf8'))
  return parsed?.rizzPage?.founders?.cards?.[2]?.name?.en === TARGET_NAME_EN
}

/**
 * fetch-cms-content.mjs reads through the Sanity CDN, which can still serve
 * pre-mutation data for a short window and silently bake the old card into the
 * snapshot. Regenerate until the file actually contains the new card.
 */
const regenerateSnapshot = async () => {
  for (let attempt = 1; attempt <= SNAPSHOT_ATTEMPTS; attempt += 1) {
    console.log(`\n> Regenerating CMS snapshot (attempt ${attempt}/${SNAPSHOT_ATTEMPTS})...`)
    runSnapshot()

    if (await snapshotIsFresh()) {
      console.log(`OK   Snapshot verified: cards[2].name.en === "${TARGET_NAME_EN}".`)
      return
    }

    console.warn('WARN Snapshot still holds pre-patch data (stale CDN read).')
    if (attempt < SNAPSHOT_ATTEMPTS) await sleep(SNAPSHOT_RETRY_MS)
  }

  fail(
    'Snapshot never picked up the patch after ' +
      `${SNAPSHOT_ATTEMPTS} attempts. The mutation itself succeeded — re-run ` +
      '`node scripts/fetch-cms-content.mjs` from the repo root in a minute.',
  )
}

async function main() {
  const doc = await client.fetch(`*[_id == "rizzPage"][0]{
    "cards": founders.cards[]{_key, variant, name},
    "intro": founders.intro
  }`)

  if (!doc) fail('rizzPage document not found.')

  const cards = doc.cards
  if (!Array.isArray(cards) || cards.length < 3) {
    fail(`Expected at least 3 founders cards, found ${cards?.length ?? 0}.`)
  }

  const target = cards[2]
  if (!target?._key) {
    fail('Third founders card has no _key; cannot patch deterministically.')
  }

  console.log('Resolved target card:')
  console.log(`  index   : 2 of ${cards.length}`)
  console.log(`  _key    : ${target._key}`)
  console.log(`  name.en : ${target.name?.en ?? '(none)'}`)
  console.log(`  variant : ${target.variant ?? '(none)'}`)

  const cardApplied = target.name?.en === TARGET_NAME_EN
  const introApplied = localesMatch(doc.intro, INTRO)

  if (cardApplied) {
    console.log(`\nCard already applied (cards[2].name.en === "${TARGET_NAME_EN}").`)
    if (!withIntro || introApplied) {
      console.log('Nothing to do.')
      process.exit(0)
    }
    console.log('Intro copy still pending — patching intro only.')
  } else {
    const looksLikeTeamCard = target.variant === 'team' || /team/i.test(target.name?.en ?? '')
    if (!looksLikeTeamCard) {
      fail(
        'Refusing to patch. cards[2] is not the Extended Team card ' +
          `(name.en="${target.name?.en ?? ''}", variant="${target.variant ?? ''}"). ` +
          'The array may have been reordered.',
      )
    }
    console.log('OK   Target verified as the Extended Team card.')
  }

  const at = (field) => `founders.cards[_key=="${target._key}"].${field}`
  const payload = {}

  if (!cardApplied) {
    payload[at('variant')] = CARD.variant
    payload[at('name')] = CARD.name
    payload[at('role')] = CARD.role
    payload[at('badge')] = CARD.badge
    payload[at('keywords')] = CARD.keywords
    payload[at('bio')] = CARD.bio
  }

  if (withIntro) {
    if (introApplied) {
      console.log('OK   Intro copy already matches; leaving it untouched.')
    } else {
      console.log('\nIntro copy will be replaced.')
      console.log(`  current.en : ${doc.intro?.en ?? '(none)'}`)
      console.log(`  new.en     : ${INTRO.en}`)
      payload['founders.intro'] = INTRO
    }
  }

  if (Object.keys(payload).length === 0) {
    console.log('\nNothing to patch.')
    process.exit(0)
  }

  console.log('\nPatch payload:')
  console.log(printable(payload))

  if (dryRun) {
    console.log('\nDRY RUN — no mutation committed, no snapshot regenerated.')
    return
  }

  if (!process.env.SANITY_TOKEN) {
    fail(
      'Missing SANITY_TOKEN. Create a write token at ' +
        'https://sanity.io/manage/project/v9h3c4gc/api and run:\n' +
        '  $env:SANITY_TOKEN="your-token"; node studio-rotem-portfolio/scripts/patch-tech-founder.mjs --with-intro',
    )
  }

  await client.patch('rizzPage').set(payload).commit()
  console.log('\nOK   Committed patch to rizzPage.')

  const verify = await client.fetch(`*[_id == "rizzPage"][0]{
    "card": founders.cards[_key == $key][0]{name, role, keywords, badge, bio, variant},
    "intro": founders.intro
  }`, {key: target._key})

  console.log('\nRead-back of cards[2]:')
  console.log(printable(verify.card))
  if (withIntro) {
    console.log('\nRead-back of founders.intro:')
    console.log(printable(verify.intro))
  }

  if (skipSnapshot) {
    console.log('\n--skip-snapshot set; run `node scripts/fetch-cms-content.mjs` yourself.')
    return
  }

  await regenerateSnapshot()
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
