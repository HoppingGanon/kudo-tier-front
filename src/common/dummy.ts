import { UserData } from './restapi'
import { Tier, Review } from './review'

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
  createdAt: new Date(),
  updatedAt: new Date()
}

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

export const emptyUser: UserData = {
  userId: '',
  name: '',
  profile: '',
  iconUrl: '',
  twitterName: '',
  allowTwitterLink: false,
  keepSession: 3600,
  tiersCount: 0,
  reviewsCount: 0
}
