import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const SECTION_IDS = {
  introductionSection: 'a1000001-0001-4001-8001-000000000001',
  highlightsSection: 'a1000002-0002-4002-8002-000000000002',
  aboutSection: 'a1000003-0003-4003-8003-000000000003',
  workSection: 'a1000004-0004-4004-8004-000000000004',
  packagesSection: 'a1000005-0005-4005-8005-000000000005',
  servicesSection: 'a1000006-0006-4006-8006-000000000006',
  reviewsSection: 'a1000007-0007-4007-8007-000000000007',
  contactSection: 'a1000008-0008-4008-8008-000000000008',
}

const HOME_PAGE_ID = 'f7d7fc66-a1f5-468c-9ea6-cf1b17672586'
const SITE_SETTINGS_ID = 'eb29c091-42d8-4d9a-9d71-59a7d91af234'

async function main() {
  const [homePage, siteSettings] = await Promise.all([
    client.fetch(`*[_id == $id][0]`, {id: HOME_PAGE_ID}),
    client.fetch(`*[_id == $id][0]`, {id: SITE_SETTINGS_ID}),
  ])

  if (!homePage && !siteSettings) {
    console.log('No legacy homePage or siteSettings found — creating empty section docs.')
  }

  const tx = client.transaction()

  tx.createOrReplace({
    _id: SECTION_IDS.introductionSection,
    _type: 'introductionSection',
    hero: homePage?.hero,
    trustedBy: homePage?.trustedBy,
  })

  tx.createOrReplace({
    _id: SECTION_IDS.highlightsSection,
    _type: 'highlightsSection',
    showcaseTitle: homePage?.showcaseTitle,
  })

  tx.createOrReplace({
    _id: SECTION_IDS.aboutSection,
    _type: 'aboutSection',
    title: homePage?.about?.title,
    founders: homePage?.about?.founders,
    agencyTitle: homePage?.about?.agencyTitle,
    agencyContent: homePage?.about?.agencyContent,
    agencyMission: homePage?.about?.agencyMission,
    stats: homePage?.about?.stats,
  })

  tx.createOrReplace({
    _id: SECTION_IDS.workSection,
    _type: 'workSection',
    title: homePage?.portfolioSection?.title,
    allWorkLabel: homePage?.portfolioSection?.allWorkLabel,
    expandVideoLabel: homePage?.portfolioSection?.expandVideoLabel,
  })

  tx.createOrReplace({
    _id: SECTION_IDS.packagesSection,
    _type: 'packagesSection',
    title: homePage?.packagesSection?.title,
    statement: homePage?.packagesSection?.statement,
    badge: homePage?.packagesSection?.badge,
    cta: homePage?.packagesSection?.cta,
  })

  tx.createOrReplace({
    _id: SECTION_IDS.servicesSection,
    _type: 'servicesSection',
    title: {en: 'Services', he: 'שירותים'},
  })

  tx.createOrReplace({
    _id: SECTION_IDS.reviewsSection,
    _type: 'reviewsSection',
    title: homePage?.reviewsSection?.title ?? {en: 'Reviews', he: 'המלצות'},
    subtitle:
      homePage?.reviewsSection?.subtitle ?? {
        en: 'What my clients say about my work',
        he: 'מה הלקוחות שלי אומרים על העבודה שלי',
      },
    ctaTitle: homePage?.reviewsSection?.ctaTitle,
    ctaSubtitle: homePage?.reviewsSection?.ctaSubtitle,
    ctaContact: homePage?.reviewsSection?.ctaContact,
    ctaPortfolio: homePage?.reviewsSection?.ctaPortfolio,
  })

  tx.createOrReplace({
    _id: SECTION_IDS.contactSection,
    _type: 'contactSection',
    title: homePage?.contactSection?.title,
    subtitle: homePage?.contactSection?.subtitle,
    contactEmail: siteSettings?.contactEmail,
    contactPhone: siteSettings?.contactPhone,
    whatsappLabel: siteSettings?.whatsappLabel,
    whatsappUrl: siteSettings?.whatsappUrl,
    socialLinks: siteSettings?.socialLinks,
  })

  if (siteSettings) {
    tx.patch(SITE_SETTINGS_ID, (patch) =>
      patch.set({
        footerText: siteSettings.footerText,
      }),
    )
  }

  await tx.commit()
  console.log('Section documents migrated successfully.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
