import { createClient } from '@sanity/client'
import { pathToFileURL } from 'url'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

/** Eight carousel reviews — client quotes, YouTube comments, and formal recommendations */
export const TESTIMONIAL_REVIEWS = [
  {
    _id: 'review-michel-zvigi',
    name: 'Michel Zvigi',
    company: 'Shapo Digital',
    rating: 5,
    text: {
      he: 'רותם הוא גורם קריטי להצלחת הקמפיינים שלנו — מפרסומות AI ועד עריכת וידאו, התוצרים שלו תמיד ברמה הגבוהה ביותר. מקצוען אמיתי. ממליצים בלי היסוס.',
      en: 'Rotem is a critical factor in our campaign success — from AI ads to video editing, his work always hits the highest standard. A true professional. We recommend him without hesitation.',
    },
    order: 0,
    showOnMainSection: true,
  },
  {
    _id: 'review-noam-firuz',
    name: 'Noam Firuz',
    company: 'Content Creator',
    rating: 5,
    text: {
      he: 'נראה מטורף אחי. עריכה ברמה אחרת — כל הכבוד.',
      en: 'Looks insane, bro. Editing on another level — well done.',
    },
    order: 1,
    showOnMainSection: true,
  },
  {
    _id: 'review-yishai-gabian-budget',
    name: 'Yishai Gabian',
    company: 'Entrepreneur & Mentor',
    rating: 5,
    text: {
      he: 'הורדנו פי שתיים תקציב — מ-30₪ לליד ל-15₪. חסכון של ~15,000₪. והלידים רק עלו.',
      en: 'We cut the budget in half — from ₪30 to ₪15 per lead. Saved ~₪15K. Leads kept climbing.',
    },
    order: 2,
    showOnMainSection: true,
  },
  {
    _id: 'review-yishai-gabian-fire',
    name: 'Yishai Gabian',
    company: 'Entrepreneur & Mentor',
    rating: 5,
    text: {
      he: 'הסרטון אש. אפס תיקונים — בדיוק מה שרציתי.',
      en: 'The video is fire. Zero revisions — exactly what I wanted.',
    },
    order: 3,
    showOnMainSection: false,
  },
  {
    _id: 'review-yishai-gabian-next',
    name: 'Yishai Gabian',
    company: 'Entrepreneur & Mentor',
    rating: 5,
    text: {
      he: 'עפתי על הסרטון, יאללה בוא נטרוף את הבא.',
      en: "Loved that edit — let's crush the next one.",
    },
    order: 4,
    showOnMainSection: false,
  },
  {
    _id: 'review-shaked-siroa-credit',
    name: 'Shaked Siroa',
    company: 'Co-Founder · RIZZ',
    rating: 5,
    text: {
      he: 'הרבה מהקרדיט הולך לעריכה — בלי זה הסרטון היה נתקע על 60K צפיות.',
      en: "Most of the credit goes to the edit — without it, we'd be stuck at 60K views.",
    },
    order: 5,
    showOnMainSection: true,
  },
  {
    _id: 'review-shaked-siroa-king',
    name: 'Shaked Siroa',
    company: 'Co-Founder · RIZZ',
    rating: 5,
    text: {
      he: 'אתה מטורף אחי — מלך אמיתי.',
      en: "You're insane, bro — absolute king.",
    },
    order: 6,
    showOnMainSection: false,
  },
  {
    _id: 'review-youtube-ivri3235',
    name: '@ivri3235',
    company: 'YouTube comment',
    rating: 5,
    text: {
      he: 'וואלה אהבתי את העריכה — כל רגע, המעברים המהירים, כל הפרטים הקטנים. סרטון אש.',
      en: 'Wow, loved the editing — every moment, the fast cuts, all the little details. Absolute fire.',
    },
    order: 7,
    showOnMainSection: false,
  },
  {
    _id: 'review-youtube-editor-inquiry',
    name: '@GhhvBdbbh',
    company: 'YouTube comment',
    rating: 5,
    text: {
      he: 'מי עורך לך את הסרטונים? חייב לדבר עם העורך הזה.',
      en: 'Who edits your videos? I need to talk to this editor.',
    },
    order: 8,
    showOnMainSection: false,
  },
]

/** Published review document IDs (current production dataset) */
export const PUBLISHED_REVIEW_IDS = [
  '088f2644-2d37-4012-992d-0e7c6cd392b2',
  'deaf4f4e-3b4a-4b6e-a2d7-ec171e8d321a',
  '0c2b0bbd-770c-4e6d-927c-d7ec44f5175f',
  'f9811a5c-09d9-416b-9021-1332f5b7869b',
  'df814855-aeab-42f0-b4e9-cab5763d6fa7',
  'd80df055-1ea7-4521-b614-c625b6447299',
  'e9eaa381-4327-4daa-b43a-963b17ef0569',
  'e612095f-ca69-4d5e-b14d-dc364723a5d2',
  '5cb14440-bb0c-45a8-b425-800357871afa',
]

const LEGACY_REVIEW_IDS = [
  'fa0ca959-984f-4d57-8284-13cdcc344406',
  'cbd780ab-5753-4449-a954-b36fa299e02c',
  'b0722850-60e0-43dd-af2d-e77036cbe010',
  'b98b45f4-aff0-491f-ad55-cb2067270f9d',
  '115cc0da-1963-4367-94d5-dac51df2747e',
  'a25fd373-9f6c-4bd6-aa85-29eb7c8a2e3e',
]

async function main() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error(
      'Missing SANITY_TOKEN. Create a write token at https://sanity.io/manage/project/v9h3c4gc/api and run:\n' +
        '  $env:SANITY_TOKEN="your-token"; npm run seed:reviews',
    )
  }

  const tx = client.transaction()

  for (const id of LEGACY_REVIEW_IDS) {
    tx.delete(id)
  }

  TESTIMONIAL_REVIEWS.forEach((review, index) => {
    const { _id: stableId, ...rest } = review
    const publishedId = PUBLISHED_REVIEW_IDS[index]
    tx.createOrReplace({
      _type: 'review',
      _id: publishedId ?? stableId,
      ...rest,
    })
  })

  await tx.commit()
  console.log(`Seeded ${TESTIMONIAL_REVIEWS.length} testimonial reviews.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
