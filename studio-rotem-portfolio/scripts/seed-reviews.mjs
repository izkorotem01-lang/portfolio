import {createClient} from '@sanity/client'
import {pathToFileURL} from 'url'

const client = createClient({
  projectId: 'v9h3c4gc',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

/** Real client quotes from YouTube comments and WhatsApp feedback */
export const TESTIMONIAL_REVIEWS = [
  {
    _id: 'review-noam-firuz',
    name: 'Noam Firuz',
    company: 'Content Creator',
    rating: 5,
    text: {
      he: 'נראה מעולה אחי. כל הכבוד.',
      en: 'Looks amazing, bro. Well done.',
    },
    order: 0,
    showOnMainSection: true,
  },
  {
    _id: 'review-yishai-gabian-budget',
    name: 'Yishai Gabian',
    company: 'Entrepreneur & Mentor',
    rating: 5,
    text: {
      he: 'הורדנו פי שתיים תקציב בזכותך — מ-30₪ לליד ל-15₪ לליד. חסכון של בערך 15,000₪.',
      en: 'We cut the budget in half thanks to you — from ₪30 per lead to ₪15 per lead. Savings of about ₪15,000.',
    },
    order: 1,
    showOnMainSection: true,
  },
  {
    _id: 'review-yishai-gabian-fire',
    name: 'Yishai Gabian',
    company: 'Entrepreneur & Mentor',
    rating: 5,
    text: {
      he: 'הסרטון אש, לא צריך תיקונים.',
      en: 'The video is fire — no revisions needed.',
    },
    order: 2,
    showOnMainSection: false,
  },
  {
    _id: 'review-yishai-gabian-love-it',
    name: 'Yishai Gabian',
    company: 'Entrepreneur & Mentor',
    rating: 5,
    text: {
      he: 'כן עפתי על זה. יאללה בוא נתחיל את הסרטון הבא.',
      en: "Yes, I loved it. Let's start the next video.",
    },
    order: 3,
    showOnMainSection: false,
  },
  {
    _id: 'review-nitai-nakel-insane',
    name: 'Nitai Nakel',
    company: 'Bold Academy',
    rating: 5,
    text: {
      he: 'זה הנוכחי בכלל חולני. חשמל חשמל פיצוצים.',
      en: "This one's totally insane. Electric, electric, explosive.",
    },
    order: 4,
    showOnMainSection: true,
  },
  {
    _id: 'review-nitai-nakel-artist',
    name: 'Nitai Nakel',
    company: 'Bold Academy',
    rating: 5,
    text: {
      he: 'אתה אמן. נהדררר!',
      en: "You're an artist. Wonderful!",
    },
    order: 5,
    showOnMainSection: false,
  },
  {
    _id: 'review-shaked-siroa-credit',
    name: 'Shaked Siroa',
    company: 'Content Creator',
    rating: 5,
    text: {
      he: 'הרבה מהקרדיט הולך לאיצקו על העריכה — אחרת הסרטון היה על 60K צפיות.',
      en: "A lot of the credit goes to Itzko for the editing — otherwise the video would've been at 60K views.",
    },
    order: 6,
    showOnMainSection: true,
  },
  {
    _id: 'review-shaked-siroa-king',
    name: 'Shaked Siroa',
    company: 'Content Creator',
    rating: 5,
    text: {
      he: 'אתה מטורף אחי, איזה מלך.',
      en: "You're insane, bro — what a king.",
    },
    order: 7,
    showOnMainSection: false,
  },
  {
    _id: 'review-youtube-ivri3235',
    name: '@ivri3235',
    company: 'YouTube',
    rating: 5,
    text: {
      he: 'וואלה אהבתי את העריכה — אשכרה כל רגע, המעברים המהירים, וכל הדברים הקטנים. באמת סרטון אש.',
      en: 'Wow, I loved the editing — literally every moment, the fast cuts, and all the little details. Truly a fire video.',
    },
    order: 8,
    showOnMainSection: false,
  },
  {
    _id: 'review-youtube-editor-inquiry',
    name: '@GhhvBdbbh',
    company: 'YouTube',
    rating: 5,
    text: {
      he: 'מי עורך לך את הסרטונים ביוטיוב? אשמח ליצור קשר עם העורך.',
      en: "Who edits your YouTube videos? I'd love to get in touch with the editor.",
    },
    order: 9,
    showOnMainSection: false,
  },
  {
    _id: 'review-maal-crazy',
    name: "Ma'al",
    company: 'Client',
    rating: 5,
    text: {
      he: 'וואלה באמת מטורף אחי. בגדול פסיכי.',
      en: 'Wow, really crazy, bro. Overall insane.',
    },
    order: 10,
    showOnMainSection: false,
  },
  {
    _id: 'review-amor-amazing',
    name: 'Amor',
    company: 'Client',
    rating: 5,
    text: {
      he: 'נראה ממש טוב אחי — בגדול מדהים.',
      en: 'Looks really good, bro — overall amazing.',
    },
    order: 11,
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
  'b98b45f4-aff0-491f-ad55-cb2067270f9d',
  '115cc0da-1963-4367-94d5-dac51df2747e',
  'a25fd373-9f6c-4bd6-aa85-29eb7c8a2e3e',
]

const LEGACY_REVIEW_IDS = [
  'fa0ca959-984f-4d57-8284-13cdcc344406',
  'cbd780ab-5753-4449-a954-b36fa299e02c',
  'b0722850-60e0-43dd-af2d-e77036cbe010',
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
    const {_id: stableId, ...rest} = review
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
