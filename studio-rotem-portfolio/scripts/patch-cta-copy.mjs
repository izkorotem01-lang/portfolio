import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const CTA_COPY = {
  'cta.eyebrow': {
    en: "Let's Build Your Growth Engine",
    hb: 'בואו נבנה את מנוע הצמיחה שלכם',
  },
  'cta.titleLine1': {
    en: 'READY TO SCALE & BECOME',
    hb: 'מוכנים לצמוח ולהפוך',
  },
  'cta.titleAccent': {
    en: 'AN UNDENIABLE FORCE?',
    hb: 'לכוח בלתי ניתן לעצירה?',
  },
  'cta.description': {
    en: 'Combine world-class creative with exponential tech. We build the content, AI, and scalable systems that make your business impossible to ignore.',
    hb: 'השילוב המדויק בין קריאייטיב פרימיום לטכנולוגיה. אנחנו בונים את התוכן, סוכני ה-AI ומערכות הסקייל שיהפכו את העסק שלכם לבלתי ניתן לעצירה.',
  },
  'cta.tagline': {
    en: 'CREATIVE · TECHNOLOGY · SCALE',
    hb: 'קריאייטיב · טכנולוגיה · סקייל',
  },
}

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error(
      'Missing SANITY_TOKEN. Create a write token and run:\n' +
        '  $env:SANITY_TOKEN="your-token"; node studio-rotem-portfolio/scripts/patch-cta-copy.mjs',
    )
  }

  await client.patch('rizzPage').set(CTA_COPY).commit()

  console.log('Patched rizzPage.cta eyebrow, titleLine1, titleAccent, description, tagline.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
