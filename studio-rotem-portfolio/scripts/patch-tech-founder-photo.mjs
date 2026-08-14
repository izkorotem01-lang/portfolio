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
const portraitPath = join(repoRoot, 'public', 'e7a8e9f1-4fc4-4e53-9430-831ca9c75622.jpg')

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const skipSnapshot = args.has('--skip-snapshot')

const TARGET_NAME_EN = 'Pelle Bino'
const TARGET_VARIANT = 'portrait'

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

const runSnapshot = () => {
  execFileSync(process.execPath, [fetchScript], {cwd: repoRoot, stdio: 'inherit'})
}

const snapshotIsFresh = async () => {
  const parsed = JSON.parse(await readFile(snapshotPath, 'utf8'))
  const card = parsed?.rizzPage?.founders?.cards?.[2]
  return (
    card?.name?.en === TARGET_NAME_EN &&
    typeof card?.imageUrl === 'string' &&
    card.imageUrl.length > 0 &&
    typeof card?.backImageUrl === 'string' &&
    card.backImageUrl.length > 0
  )
}

/**
 * fetch-cms-content.mjs reads through the Sanity CDN, which can still serve
 * pre-mutation data for a short window and silently bake the old card into the
 * snapshot. Regenerate until the file actually contains the new image URLs.
 */
const regenerateSnapshot = async () => {
  for (let attempt = 1; attempt <= SNAPSHOT_ATTEMPTS; attempt += 1) {
    console.log(`\n> Regenerating CMS snapshot (attempt ${attempt}/${SNAPSHOT_ATTEMPTS})...`)
    runSnapshot()

    if (await snapshotIsFresh()) {
      console.log('OK   Snapshot verified: cards[2] has imageUrl and backImageUrl.')
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
  let portraitBuffer
  try {
    portraitBuffer = await readFile(portraitPath)
  } catch {
    fail(`Portrait file not found at ${portraitPath}`)
  }

  console.log(`Portrait source: ${portraitPath}`)
  console.log(`Portrait size  : ${portraitBuffer.length} bytes`)

  const doc = await client.fetch(`*[_id == "rizzPage"][0]{
    "cards": founders.cards[]{
      _key,
      variant,
      name,
      "imageRef": image.asset._ref,
      "backImageRef": backImage.asset._ref
    }
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

  console.log('\nResolved target card:')
  console.log(`  index         : 2 of ${cards.length}`)
  console.log(`  _key          : ${target._key}`)
  console.log(`  name.en       : ${target.name?.en ?? '(none)'}`)
  console.log(`  variant       : ${target.variant ?? '(none)'}`)
  console.log(`  imageRef      : ${target.imageRef ?? '(none)'}`)
  console.log(`  backImageRef  : ${target.backImageRef ?? '(none)'}`)

  if (target.name?.en !== TARGET_NAME_EN || target.variant !== TARGET_VARIANT) {
    fail(
      'Refusing to patch. cards[2] is not Pelle Bino portrait card ' +
        `(name.en="${target.name?.en ?? ''}", variant="${target.variant ?? ''}"). ` +
        'The array may have been reordered.',
    )
  }

  console.log('OK   Target verified as Pelle Bino portrait card.')

  if (target.imageRef) {
    console.log(`\nCard already has an image (image.asset._ref === "${target.imageRef}").`)
    console.log('Nothing to do.')
    process.exit(0)
  }

  const at = (field) => `founders.cards[_key=="${target._key}"].${field}`

  if (dryRun) {
    console.log('\nDRY RUN — would upload portrait and set:')
    console.log(`  ${at('image')}     = {_type: "image", asset: {_type: "reference", _ref: "<uploaded>"}}`)
    console.log(`  ${at('backImage')} = {_type: "image", asset: {_type: "reference", _ref: "<uploaded>"}}`)
    console.log('\nDRY RUN — no mutation committed, no snapshot regenerated.')
    return
  }

  if (!process.env.SANITY_TOKEN) {
    fail(
      'Missing SANITY_TOKEN. Create a write token at ' +
        'https://sanity.io/manage/project/v9h3c4gc/api and run:\n' +
        '  $env:SANITY_TOKEN="your-token"; node studio-rotem-portfolio/scripts/patch-tech-founder-photo.mjs',
    )
  }

  console.log('\n> Uploading portrait to Sanity...')
  const asset = await client.assets.upload('image', portraitBuffer, {
    filename: 'pelle-bino-portrait.jpg',
    contentType: 'image/jpeg',
  })
  console.log(`OK   Uploaded asset: ${asset._id}`)
  console.log(`     url: ${asset.url}`)

  const imageValue = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }

  const payload = {
    [at('image')]: imageValue,
    [at('backImage')]: imageValue,
  }

  console.log('\nPatch payload:')
  console.log(printable(payload))

  await client.patch('rizzPage').set(payload).commit()
  console.log('\nOK   Committed patch to rizzPage.')

  const verify = await client.fetch(
    `*[_id == "rizzPage"][0]{
      "card": founders.cards[_key == $key][0]{
        name,
        variant,
        "imageUrl": image.asset->url,
        "imageRef": image.asset->_id,
        "backImageUrl": backImage.asset->url,
        "backImageRef": backImage.asset->_id
      }
    }`,
    {key: target._key},
  )

  console.log('\nRead-back of cards[2]:')
  console.log(printable(verify.card))

  if (!verify.card?.imageUrl || !verify.card?.backImageUrl) {
    fail('Patch committed but read-back is missing imageUrl and/or backImageUrl.')
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
