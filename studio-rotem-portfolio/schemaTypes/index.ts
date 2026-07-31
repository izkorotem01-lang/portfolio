import {portfolioCategory} from './documents/portfolioCategory'
import {portfolioVideo} from './documents/portfolioVideo'
import {proofCard} from './documents/proofCard'
import {proofCardMedia} from './objects/proofCardMedia'
import {proofCardStatistic} from './objects/proofCardStatistic'
import {proofCardTitleSegment} from './objects/proofCardTitleSegment'
import {review} from './documents/review'
import {rizzPage} from './documents/rizzPage'
import {trustedByClient} from './documents/trustedByClient'
import {localeString} from './objects/localeString'
import {localeText} from './objects/localeText'

export const schemaTypes = [
  localeString,
  localeText,
  proofCardStatistic,
  proofCardMedia,
  proofCardTitleSegment,
  rizzPage,
  trustedByClient,
  proofCard,
  portfolioCategory,
  portfolioVideo,
  review,
]
