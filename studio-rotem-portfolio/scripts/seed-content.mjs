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
      he: 'סוכנות תוכן וקריאייטיב המתמחה בבניית נוכחות דיגיטלית עבור עסקים, יוצרי תוכן ומותגים אישיים.',
    },
    cta: {en: 'View My Work', he: 'צפה בעבודות שלי'},
    wordmarkAlt: {en: 'RIZ Productions', he: 'RIZ Productions'},
  },
  trustedBy: {
    title: {en: 'Trusted By', he: 'סומכים עליי'},
    subtitle: {
      en: 'Brands and creators I have helped with sharp, high-converting content.',
      he: 'מותגים ויוצרים שליוויתי עם תוכן חד, מקצועי וממיר.',
    },
    visitLabel: {en: 'Visit site', he: 'לאתר'},
    clientLabel: {en: 'Client partner', he: 'לקוח פעיל'},
  },
}

const highlightsPatch = {
  showcaseTitle: {en: 'HIGHLIGHTS', he: 'HIGHLIGHTS'},
}

const aboutPatch = {
  title: {en: 'Who Are We', he: 'מי אנחנו'},
  headline: {
    en: 'We help brands & creators look undeniable on video',
    he: 'אנחנו עוזרים למותגים ויוצרים להיראות מושלמים בסרטון',
  },
  subline: {
    en: 'More authority. More attention. More clients.',
    he: 'יותר סמכות. יותר תשומת לב. יותר לקוחות.',
  },
  audience: {
    en: 'personal brands, mentors, and creators who want to turn content into a client-acquisition system.',
    he: 'מותגים אישיים, מנטורים ויוצרים שרוצים להפוך תוכן למערכת של השגת לקוחות.',
  },
  capabilities: [
    {
      _key: 'cap-video',
      _type: 'aboutCapability',
      title: {en: 'Video Editing (AE + AI)', he: 'עריכת וידאו (AE + AI)'},
      icon: 'video',
    },
    {
      _key: 'cap-motion',
      _type: 'aboutCapability',
      title: {en: 'Motion Graphics', he: 'מושן גראפיקס'},
      icon: 'sparkles',
    },
    {
      _key: 'cap-strategy',
      _type: 'aboutCapability',
      title: {en: 'Content Strategy', he: 'אסטרטגיית תוכן'},
      icon: 'target',
    },
    {
      _key: 'cap-social',
      _type: 'aboutCapability',
      title: {en: 'Social Media Content', he: 'תוכן לרשתות חברתיות'},
      icon: 'share',
    },
  ],
  founders: [
    {
      _key: 'rotem',
      _type: 'aboutFounder',
      name: {en: 'Rotem Itzkovich', he: 'על רותם איצקוביץ'},
      role: {en: 'Co-founder of RIZZ Productions.', he: 'מייסד שותף ב־RIZZ Productions.'},
      bio: {
        en: 'Responsible for content strategy, content system development, and production processes. Specializes in building digital presence for businesses, brands, and creators through marketing thinking, viewing psychology, and content that serves business goals.',
        he: 'אחראי על אסטרטגיית התוכן, פיתוח מערכות תוכן ותהליכי הפקה. מתמחה בבניית נוכחות דיגיטלית לעסקים, מותגים ויוצרים באמצעות חשיבה שיווקית, פסיכולוגיית צפייה ותוכן שמשרת מטרות עסקיות.',
      },
      photoAlt: {en: 'Rotem Itzkovich', he: 'רותם איצקוביץ'},
      glowColor: 'cyan',
      order: 0,
    },
    {
      _key: 'shaked',
      _type: 'aboutFounder',
      name: {en: 'Shaked Siroa', he: 'על שקד סירואה'},
      role: {en: 'Co-founder of RIZZ Productions.', he: 'מייסד שותף ב־RIZZ Productions.'},
      bio: {
        en: 'Content creator and creative specializing in storytelling, concept development, and content creation. Responsible for developing ideas, creative direction, and turning messages into content that connects people to brands.',
        he: 'יוצר תוכן ואיש קריאייטיב המתמחה ב־Storytelling, פיתוח קונספטים ויצירת תוכן. אחראי על פיתוח הרעיונות, הקריאייטיב והפיכת מסרים לתוכן שמחבר אנשים למותגים.',
      },
      photoAlt: {en: 'Shaked Siroa', he: 'שקד סירואה'},
      glowColor: 'orange',
      order: 1,
    },
  ],
}

const packagesPatch = {
  title: {en: 'Content Systems', he: 'מערכות תוכן'},
  statement: {
    en: "I don't sell videos — I build content systems that drive results",
    he: 'אני לא מוכר סרטונים — אני בונה מערכת תוכן שמביאה תוצאות',
  },
  badge: {en: 'Main Package', he: 'החבילה המרכזית'},
  cta: {en: "Let's Build Your System", he: 'בואו נבנה את המערכת שלכם'},
}

const workPatch = {
  title: {en: 'Our Work', he: 'העבודות שלנו'},
  allWorkLabel: {en: 'All Work', he: 'כל העבודות'},
  expandVideoLabel: {en: 'Large view', he: 'תצוגה גדולה'},
  maxVideosDisplayed: 8,
}

const contactPatch = {
  title: {en: "Let's Work Together", he: 'בואו נעבוד יחד'},
  subtitle: {
    en: 'Ready to take your content to the next level?',
    he: 'מוכנים לקחת את התוכן שלכם לשלב הבא?',
  },
  socialLinks: [
    {
      _key: 'ig',
      platform: 'instagram',
      url: 'https://www.instagram.com/rotemizko_/',
      label: {en: 'Instagram', he: 'אינסטגרם'},
    },
    {
      _key: 'yt',
      platform: 'youtube',
      url: 'https://www.youtube.com/@RoTeMIZKo',
      label: {en: 'YouTube', he: 'יוטיוב'},
    },
    {
      _key: 'tt',
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@rotem.izko',
      label: {en: 'TikTok', he: 'טיקטוק'},
    },
  ],
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
  await client.patch('fc9da28d-61bb-4b75-8d35-31dacf7fc281').set({popular: true}).commit()
  console.log('Content seeded successfully')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
