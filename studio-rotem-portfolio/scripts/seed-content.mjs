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
  contactSection: 'a1000008-0008-4008-8008-000000000008',
}

const introductionPatch = {
  hero: {
    subtitle: {
      en: 'A content and creative agency specializing in building digital presence for businesses, content creators, and personal brands.',
      hb: 'סוכנות תוכן וקריאייטיב המתמחה בבניית נוכחות דיגיטלית עבור עסקים, יוצרי תוכן ומותגים אישיים.',
    },
    cta: {en: 'View My Work', hb: 'צפה בעבודות שלי'},
    wordmarkAlt: {en: 'RIZ Productions', hb: 'RIZ Productions'},
  },
  trustedBy: {
    title: {en: 'Trusted By', hb: 'סומכים עליי'},
    subtitle: {
      en: 'Brands and creators I have helped with sharp, high-converting content.',
      hb: 'מותגים ויוצרים שליוויתי עם תוכן חד, מקצועי וממיר.',
    },
    visitLabel: {en: 'Visit site', hb: 'לאתר'},
    clientLabel: {en: 'Client partner', hb: 'לקוח פעיל'},
  },
}

const highlightsPatch = {
  showcaseTitle: {en: 'HIGHLIGHTS', hb: 'HIGHLIGHTS'},
}

const aboutPatch = {
  title: {en: 'Who Are We', hb: 'מי אנחנו'},
  headline: {
    en: 'We help brands & creators look undeniable on video',
    hb: 'אנחנו עוזרים למותגים ויוצרים להיראות מושלמים בסרטון',
  },
  subline: {
    en: 'More authority. More attention. More clients.',
    hb: 'יותר סמכות. יותר תשומת לב. יותר לקוחות.',
  },
  audience: {
    en: 'personal brands, mentors, and creators who want to turn content into a client-acquisition system.',
    hb: 'מותגים אישיים, מנטורים ויוצרים שרוצים להפוך תוכן למערכת של השגת לקוחות.',
  },
  capabilities: [
    {
      _key: 'cap-video',
      _type: 'aboutCapability',
      title: {en: 'Video Editing (AE + AI)', hb: 'עריכת וידאו (AE + AI)'},
      icon: 'video',
    },
    {
      _key: 'cap-motion',
      _type: 'aboutCapability',
      title: {en: 'Motion Graphics', hb: 'מושן גראפיקס'},
      icon: 'sparkles',
    },
    {
      _key: 'cap-strategy',
      _type: 'aboutCapability',
      title: {en: 'Content Strategy', hb: 'אסטרטגיית תוכן'},
      icon: 'target',
    },
    {
      _key: 'cap-social',
      _type: 'aboutCapability',
      title: {en: 'Social Media Content', hb: 'תוכן לרשתות חברתיות'},
      icon: 'share',
    },
  ],
  founders: [
    {
      _key: 'rotem',
      _type: 'aboutFounder',
      name: {en: 'Rotem Izkovich', hb: 'על רותם איצקוביץ'},
      role: {en: 'Co-founder of RIZZ Productions.', hb: 'מייסד שותף ב־RIZZ Productions.'},
      bio: {
        en: 'Responsible for content strategy, content system development, and production processes. Specializes in building digital presence for businesses, brands, and creators through marketing thinking, viewing psychology, and content that serves business goals.',
        hb: 'אחראי על אסטרטגיית התוכן, פיתוח מערכות תוכן ותהליכי הפקה. מתמחה בבניית נוכחות דיגיטלית לעסקים, מותגים ויוצרים באמצעות חשיבה שיווקית, פסיכולוגיית צפייה ותוכן שמשרת מטרות עסקיות.',
      },
      photoAlt: {en: 'Rotem Izkovich', hb: 'רותם איצקוביץ'},
      glowColor: 'cyan',
      order: 0,
    },
    {
      _key: 'shaked',
      _type: 'aboutFounder',
      name: {en: 'Shaked Siroa', hb: 'על שקד סירואה'},
      role: {en: 'Co-founder of RIZZ Productions.', hb: 'מייסד שותף ב־RIZZ Productions.'},
      bio: {
        en: 'Content creator and creative specializing in storytelling, concept development, and content creation. Responsible for developing ideas, creative direction, and turning messages into content that connects people to brands.',
        hb: 'יוצר תוכן ואיש קריאייטיב המתמחה ב־Storytelling, פיתוח קונספטים ויצירת תוכן. אחראי על פיתוח הרעיונות, הקריאייטיב והפיכת מסרים לתוכן שמחבר אנשים למותגים.',
      },
      photoAlt: {en: 'Shaked Siroa', hb: 'שקד סירואה'},
      glowColor: 'orange',
      order: 1,
    },
  ],
}

const packagesPatch = {
  title: {en: 'Content Systems', hb: 'מערכות תוכן'},
  statement: {
    en: "I don't sell videos — I build content systems that drive results",
    hb: 'אני לא מוכר סרטונים — אני בונה מערכת תוכן שמביאה תוצאות',
  },
  badge: {en: 'Main Package', hb: 'החבילה המרכזית'},
  cta: {en: "Let's Build Your System", hb: 'בואו נבנה את המערכת שלכם'},
}

const workPatch = {
  title: {en: 'Our Work', hb: 'העבודות שלנו'},
  allWorkLabel: {en: 'All Work', hb: 'כל העבודות'},
  expandVideoLabel: {en: 'Large view', hb: 'תצוגה גדולה'},
  maxVideosDisplayed: 8,
}

const contactPatch = {
  title: {en: "Let's Work Together", hb: 'בואו נעבוד יחד'},
  subtitle: {
    en: 'Ready to take your content to the next level?',
    hb: 'מוכנים לקחת את התוכן שלכם לשלב הבא?',
  },
  socialLinks: [
    {
      _key: 'ig',
      platform: 'instagram',
      url: 'https://www.instagram.com/rotemizko_/',
      label: {en: 'Instagram', hb: 'אינסטגרם'},
    },
    {
      _key: 'yt',
      platform: 'youtube',
      url: 'https://www.youtube.com/@RoTeMIZKo',
      label: {en: 'YouTube', hb: 'יוטיוב'},
    },
    {
      _key: 'tt',
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@rotem.izko',
      label: {en: 'TikTok', hb: 'טיקטוק'},
    },
  ],
}

const RIZZ_NAV_HREFS = {
  results: '#proof',
  howWeGetYouThere: '#how-we-get-you-there',
  work: '#work',
  testimonials: '#testimonials',
  about: '#about',
  contact: '#contact',
}

const rizzPageDoc = {
  _id: 'rizzPage',
  _type: 'rizzPage',
  nav: {
    logoAlt: {en: 'RIZZ Productions', hb: 'RIZZ Productions'},
    openMenu: {en: 'Open menu', hb: 'פתח תפריט'},
    bookCall: {en: 'Book a Strategy Call →', hb: 'קבעו שיחת אסטרטגיה ←'},
    viewWork: {en: 'View Our Work', hb: 'צפו בעבודות שלנו'},
    switchToEn: {en: 'EN', hb: 'EN'},
    switchToHb: {en: 'עב', hb: 'עב'},
    links: [
      {label: {en: 'Results', hb: 'תוצאות'}, href: RIZZ_NAV_HREFS.results},
      {label: {en: 'Work', hb: 'עבודות'}, href: RIZZ_NAV_HREFS.work},
      {label: {en: 'Testimonials', hb: 'המלצות'}, href: RIZZ_NAV_HREFS.testimonials},
      {label: {en: 'About', hb: 'אודות'}, href: RIZZ_NAV_HREFS.about},
    ],
    footerLinks: [
      {label: {en: 'Results', hb: 'תוצאות'}, href: RIZZ_NAV_HREFS.results},
      {label: {en: 'Work', hb: 'עבודות'}, href: RIZZ_NAV_HREFS.work},
      {label: {en: 'Testimonials', hb: 'המלצות'}, href: RIZZ_NAV_HREFS.testimonials},
      {label: {en: 'About', hb: 'אודות'}, href: RIZZ_NAV_HREFS.about},
      {label: {en: 'Contact', hb: 'צור קשר'}, href: RIZZ_NAV_HREFS.contact},
    ],
  },
  hero: {
    eyebrow: {en: 'RIZZ PRODUCTIONS', hb: 'RIZZ PRODUCTIONS'},
    titleLine1: {en: 'CONTENT THAT', hb: 'תוכן שהופך'},
    titleLine2: {en: 'TURNS INTO', hb: 'ל'},
    titleAccent: {en: 'CLIENTS.', hb: 'לקוחות.'},
    description: {
      en: 'A premium creative production studio for creators, entrepreneurs, brands and mentors. We craft scroll-stopping content and growth systems that turn attention into real, measurable business.',
      hb: 'סטודיו הפקה קריאייטיבי פרימיום ליוצרים, יזמים, מותגים ומנטורים. אנחנו בונים תוכן שעוצר גלילה ומערכות צמיחה שהופכות תשומת לב לעסק מדיד ואמיתי.',
    },
    tagline: {en: 'Strategy · Creative · Production · Growth', hb: 'אסטרטגיה · קריאייטיב · הפקה · צמיחה'},
  },
  proof: {
    eyebrow: {en: 'Case Studies', hb: 'מקרי בוחן'},
    titlePrimary: {en: 'REAL RESULTS,', hb: 'תוצאות אמיתיות,'},
    titleAccent: {en: 'REAL PEOPLE.', hb: 'אנשים אמיתיים.'},
    subtitle: {en: 'Real businesses. Real content. Real transformation.', hb: 'עסקים אמיתיים. תוכן אמיתי. טרנספורמציה אמיתית.'},
  },
  howWeGetYouThere: {
    howWeWork: {en: 'How we work', hb: 'איך אנחנו עובדים'},
    process: [
      {step: '01', title: {en: 'Diagnose', hb: 'אבחון'}, icon: 'search', description: {en: 'Clarity on your goals, audience, and content gaps.', hb: 'בהירות על המטרות, הקהל ופערי התוכן שלכם.'}},
      {step: '02', title: {en: 'Build', hb: 'בנייה'}, icon: 'box', description: {en: 'Production plan built for impact.', hb: 'תוכנית הפקה שנבנית להשפעה.'}},
      {step: '03', title: {en: 'Produce', hb: 'הפקה'}, icon: 'clapperboard', description: {en: 'Premium content designed to connect and convert.', hb: 'תוכן פרימיום שמתוכנן להתחבר ולהמיר.'}},
      {step: '04', title: {en: 'Optimize', hb: 'אופטימיזציה'}, icon: 'chart', description: {en: 'Refine for reach, engagement, and results.', hb: 'שיפור לטובת reach, engagement ותוצאות.'}},
      {step: '05', title: {en: 'Scale', hb: 'סקייל'}, icon: 'trending', description: {en: 'More output, same quality, compounding growth.', hb: 'יותר output, אותה איכות, צמיחה מצטברת.'}},
    ],
  },
  portfolio: {
    eyebrow: {en: 'Our Portfolio', hb: 'תיק העבודות שלנו'},
    titlePrimary: {en: 'SELECTED', hb: 'עבודות'},
    titleAccent: {en: 'WORK', hb: 'נבחרות'},
    allVideos: {en: 'All Videos', hb: 'כל הסרטונים'},
    categoriesAria: {en: 'Portfolio categories', hb: 'קטגוריות תיק עבודות'},
    emptyState: {en: 'No videos found for this category.', hb: 'לא נמצאו סרטונים בקטגוריה זו.'},
    untitled: {en: 'Untitled', hb: 'ללא כותרת'},
  },
  testimonials: {
    eyebrow: {en: 'Testimonials', hb: 'המלצות'},
    titleLine1: {en: 'WHAT OUR CLIENTS', hb: 'מה הלקוחות שלנו'},
    titleAccent: {en: 'SAY ABOUT US.', hb: 'אומרים עלינו.'},
    starsAriaPrefix: {en: '', hb: ''},
    starsAriaSuffix: {en: 'out of 5 stars', hb: 'מתוך 5 כוכבים'},
  },
  founders: {
    eyebrow: {en: 'Studio / Founders', hb: 'הסטודיו / המייסדים'},
    titleBefore: {en: 'BUILT BY SOMEONE WHO', hb: 'נבנה על ידי מישהו ש'},
    titleFilmed: {en: 'FILMED IT', hb: 'צילם את זה'},
    titleEdited: {en: 'EDITED IT', hb: 'ערך את זה'},
    titleLived: {en: 'AND LIVED IT', hb: 'וחי את זה'},
    titleAfter: {en: 'FIRST.', hb: 'קודם.'},
    intro: {
      en: 'RIZZ Productions is led by founders who have been on both sides of the camera — building systems that scale content without sacrificing quality.',
      hb: 'RIZZ Productions מובילים על ידי מייסדים שעמדו משני צידי המצלמה — ובונים מערכות שמגדילות תוכן בלי לוותר על איכות.',
    },
    values: {en: 'International Perspective. | Creative Discipline. | Real Results.', hb: 'פרספקטיבה בינלאומית. | משמעת קריאייטיבית. | תוצאות אמיתיות.'},
    trustedBy: {en: 'Trusted by ambitious brands', hb: 'סומכים עלינו מותגים שאפתניים'},
    showBio: {en: 'show bio', hb: 'הצג ביו'},
    hideBio: {en: 'hide bio', hb: 'הסתר ביו'},
    cards: [
      {name: {en: 'Rotem Izkovich', hb: "רותם איצקוביץ'"}, role: {en: 'Co-Founder', hb: 'מייסד שותף'}, keywords: {en: 'Strategy • Growth • Systems', hb: 'אסטרטגיה • צמיחה • מערכות'}, bio: {en: 'Responsible for content strategy, production system architecture, and turning brand goals into measurable content output.', hb: 'אחראי על אסטרטגיית תוכן, ארכיטקטורת מערכות הפקה והפיכת מטרות מותג לתוצר תוכן מדיד.'}, variant: 'portrait'},
      {name: {en: 'Shaked Siroa', hb: 'שקד סירואה'}, role: {en: 'Co-Founder', hb: 'מייסד שותף'}, keywords: {en: 'Creative • Storytelling • Presence', hb: 'קריאייטיב • סטוריטelling • נוכחות'}, bio: {en: 'Concept development, visual storytelling, and transforming ideas into content that connects with real audiences.', hb: 'פיתוח קונספטים, סטוריטelling ויזואלי והפיכת רעיונות לתוכן שמתחבר לקהלים אמיתיים.'}, variant: 'portrait'},
      {name: {en: 'Our Extended Team', hb: 'הצוות המורחב שלנו'}, role: {en: 'Editors • Producers • AI Agents', hb: 'עורכים • מפיקים • סוכני AI'}, badge: {en: 'The engine behind it all', hb: 'המנוע שמאחורי הכל'}, bio: {en: 'A global team of elite creatives, editors, and AI specialists — aligned to deliver more than content. We deliver results.', hb: 'צוות גלובלי של קריאייטיבים, עורכים ומומחי AI — שמיישרים קו כדי לספק יותר מתוכן. אנחנו מספקים תוצאות.'}, variant: 'team'},
    ],
  },
  cta: {
    eyebrow: {en: "Let's Build Your System", hb: 'בואו נבנה את המערכת שלכם'},
    titleLine1: {en: 'READY TO LOOK', hb: 'מוכנים להיראות'},
    titleAccent: {en: 'UNDENIABLE ON VIDEO?', hb: 'בלתי ניתנים לעמידה בווידאו?'},
    description: {en: 'We help creators, entrepreneurs, brands and mentors turn ideas into high-impact content systems that attract attention, build trust and drive measurable growth.', hb: 'אנחנו עוזרים ליוצרים, יזמים, מותגים ומנטורים להפוך רעיונות למערכות תוכן בעלות impact שמושכות תשומת לב, בונות אמון ומניעות צמיחה מדידה.'},
    tagline: {en: 'Strategy · Production · Distribution', hb: 'אסטרטגיה · הפקה · הפצה'},
    bookCall: {en: 'Book a Strategy Call →', hb: 'קבעו שיחת אסטרטגיה ←'},
    emailUs: {en: 'Email Us', hb: 'כתבו לנו באימייל'},
  },
  footer: {
    description: {en: 'Content that turns into clients. We build high-impact video systems for creators, entrepreneurs, brands, and mentors — with real results you can measure.', hb: 'תוכן שהופך ללקוחות. אנחנו בונים מערכות וידאו בעלות impact ליוצרים, יזמים, מותגים ומנטורים — עם תוצאות אמיתיות שאפשר למדוד.'},
    navigation: {en: 'Navigation', hb: 'ניווט'},
    getStarted: {en: 'Get Started', hb: 'התחילו כאן'},
    getStartedDescription: {en: "Ready to look undeniable on video? Book a strategy call and we'll map a content system built for attention, trust, and growth.", hb: 'מוכנים להיראות בלתי ניתנים לעמידה בווידאו? קבעו שיחת אסטרטגיה ונבנה יחד מערכת תוכן לתשומת לב, אמון וצמיחה.'},
    copyrightPrefix: {en: '© ', hb: '© '},
    copyrightSuffix: {en: ' RIZZ Productions. All rights reserved.', hb: ' RIZZ Productions. כל הזכויות שמורות.'},
    tagline: {en: 'Strategy · Production · Distribution', hb: 'אסטרטגיה · הפקה · הפצה'},
  },
  seo: {
    title: {en: 'RIZZ Productions | We help brands & creators look undeniable on video', hb: 'RIZZ Productions | תוכן שהופך ללקוחות'},
    description: {en: 'A premium creative production studio for creators, entrepreneurs, brands, and mentors. Strategy, creative, production, and growth — content that turns into clients.', hb: 'סטודיו הפקה קריאייטיבי פרימיום ליוצרים, יזמים, מותגים ומנטורים. אסטרטגיה, קריאייטיב, הפקה וצמיחה — תוכן שהופך ללקוחות.'},
  },
}

const toLocaleString = (value) => {
  if (!value) return undefined
  if (typeof value === 'string') return {en: value, hb: value}
  if (typeof value === 'object') {
    if (value.hb) return value
    if (value.he) return {en: value.en, hb: value.he}
    return value
  }
  return undefined
}

const toLocaleText = (value) => {
  if (!value) return undefined
  if (typeof value === 'string') return {en: value, hb: value}
  if (typeof value === 'object') {
    if (value.hb) return value
    if (value.he) return {en: value.en, hb: value.he}
    return value
  }
  return undefined
}

async function migrateProofCardsToLocalized() {
  const docs = await client.fetch(`*[_type == "proofCard"]{
    _id,
    clientRole,
    titleSegments[]{_key, text, accent},
    checkpoints,
    statistics[]{_key, label, value},
    headerMedia{_key, image, videoFile, youtubeUrl, poster, quote, alt, isMain},
    bottomMedia[]{_key, image, videoFile, youtubeUrl, poster, quote, alt, isMain}
  }`)

  for (const doc of docs) {
    const patch = {}
    if (doc.clientRole) patch.clientRole = toLocaleString(doc.clientRole)
    if (Array.isArray(doc.checkpoints)) {
      patch.checkpoints = doc.checkpoints.map((cp) => toLocaleString(cp)).filter(Boolean)
    }
    if (Array.isArray(doc.titleSegments)) {
      patch.titleSegments = doc.titleSegments.map((seg) => ({
        _key: seg._key,
        _type: 'proofCardTitleSegment',
        accent: Boolean(seg.accent),
        text: toLocaleString(seg.text),
      }))
    }
    if (Array.isArray(doc.statistics)) {
      patch.statistics = doc.statistics.map((s) => ({
        _key: s._key,
        _type: 'proofCardStatistic',
        value: s.value,
        label: toLocaleString(s.label),
      }))
    }
    const migrateMedia = (m) =>
      m
        ? {
            _key: m._key,
            _type: 'proofCardMedia',
            image: m.image,
            videoFile: m.videoFile,
            youtubeUrl: m.youtubeUrl,
            poster: m.poster,
            isMain: Boolean(m.isMain),
            alt: toLocaleString(m.alt),
            quote: toLocaleText(m.quote),
          }
        : undefined
    if (doc.headerMedia) patch.headerMedia = migrateMedia(doc.headerMedia)
    if (Array.isArray(doc.bottomMedia))
      patch.bottomMedia = doc.bottomMedia.map(migrateMedia).filter(Boolean)

    await client.patch(doc._id).set(patch).commit()
  }
}

async function main() {
  await client.patch(SECTION_IDS.introductionSection).set(introductionPatch).commit()
  await client.patch(SECTION_IDS.highlightsSection).set(highlightsPatch).commit()
  await client
    .patch(SECTION_IDS.aboutSection)
    .set(aboutPatch)
    .unset(['agencyTitle', 'agencyContent', 'agencyMission', 'stats'])
    .commit()
  await client.patch(SECTION_IDS.workSection).set(workPatch).commit()
  await client.patch(SECTION_IDS.packagesSection).set(packagesPatch).commit()
  await client.patch(SECTION_IDS.contactSection).set(contactPatch).commit()
  await client.createOrReplace(rizzPageDoc)
  await migrateProofCardsToLocalized()
  await client.patch('fc9da28d-61bb-4b75-8d35-31dacf7fc281').set({popular: true}).commit()
  console.log('Content seeded successfully')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
