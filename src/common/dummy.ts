import { UserData } from './restapi'
import { Tier, Review } from './review'

/** 空のTier（ディープコピーして使用する） */
export const emptyTier: Tier = {
  tierId: '',
  userName: '',
  userId: '',
  userIconUrl: '',
  pointType: 'rank7',
  name: '',
  imageUrl: '',
  parags: [],
  reviews: [],
  reviewFactorParams: [],
  pullingUp: 0,
  pullingDown: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

/** 空のレビュー（ディープコピーして使用する） */
export const emptyReviwew: Review = {
  reviewId: '',
  tierId: '',
  userName: '',
  userId: '',
  userIconUrl: '',
  title: '',
  name: '',
  iconUrl: '',
  reviewFactors: [],
  sections: [],
  createdAt: new Date(),
  updatedAt: new Date()
}

/** 空のUser（ディープコピーして使用する） */
export const emptyUser: UserData = {
  userId: '',
  isSelf: false,
  name: '',
  profile: '',
  iconUrl: '',
  allowTwitterLink: false,
  keepSession: 3600,
  twitterId: '',
  twitterUserName: '',
  googleEmail: '',
  tiersCount: 0,
  reviewsCount: 0
}
