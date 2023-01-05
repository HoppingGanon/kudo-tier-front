import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '@/store'
import { Review, Tier, TierEditingData, ReviewFactor, ReviewPointType, ReviewSection, ReviewParagraph, ReviewFactorParam, ReviewEditingData } from './review'
import { TierSortType } from './page'

export interface TempSession {
  // eslint-disable-next-line camelcase
  sessionId: string
  // eslint-disable-next-line camelcase
  codeChallenge: string
}

export interface TwitterAuthCode {
  code: string
  state: string
}

export interface Session {
  sessionId: string
  userId: string
  expiredTime: string
  twitterName: string
  /** 俗にいうTeittwrのユーザーID */
  twitterUserName: string
  iconUrl: string
  isNew: string
}

export interface InitUserData {
  name: string
  profile: string
  accept: boolean
}

export interface UserData {
  name: string
  profile: string
  /** Teittwrの表示名 */
  twitterName: string
  iconUrl: string
}

export interface ReviewData {
  /** review識別ID */
  reviewId: string

  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  /** 親tier識別ID */
  tierId: string

  /** レビューの表示タイトル */
  title: string
  /** 作品名や商品名 */
  name: string
  /** レビューのアイコンURL */
  iconUrl: string
  /** レビュー評点 */
  reviewFactors: ReviewFactor []

  /** レビューポイントの表示方法 レビュー単品でGetする際にのみ参照される */
  pointType?: ReviewPointType
  sections: ReviewSection[]
  createAt: string
  updateAt: string
}

export interface TierData {
  /** Tier識別ID */
  tierId: string

  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  /** Tierの名称 */
  name: string
  /** TierのアイコンURL */
  imageUrl: string

  /** 本文 */
  parags: ReviewParagraph[]

  /** Tierの構成要素 */
  reviews: ReviewData[]
  /** レビューポイントの表示方法 */
  pointType: ReviewPointType
  /** レビュー評点に対する情報 */
  reviewFactorParams: ReviewFactorParam[]

  createAt: string
  updateAt: string
}

export interface ErrorResponse {
  code: number
  message: string
}

export default class RestApi {
  static get <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.get<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  static update <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.patch<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  static post <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.post<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  static del <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.delete<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  static getTempSession () : Promise<AxiosResponse<TempSession>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return axios.get<TempSession>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/tempsession`)
  }

  static getSession (code: string, tempSessionId: string) : Promise<AxiosResponse<Session>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return axios.get<Session>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/session`, {
      headers: {
        code: code,
        tempSessionId: tempSessionId
      }
    })
  }

  static delSession () : Promise<AxiosResponse<Session>> {
    return this.del('/auth/session')
  }

  static createUser (data: InitUserData) {
    return this.post('/user', data)
  }

  static getUserData (userId: string) {
    return this.get<UserData>('/user/' + userId)
  }

  static postTier (data: TierEditingData) {
    return this.post('/tier', data)
  }

  static getTier (userId: string, tierId: string) {
    return this.get<TierData>(`/tier/${userId}/${tierId}`)
  }

  static updateTier (data: TierEditingData) {
    return this.update('/tier', data)
  }

  static getTierList (userId: string, word: string, sortType: TierSortType, page: number) {
    return this.get<TierData[]>(encodeURI(`/tiers?userid=${userId}&word=${word}&sorttype=${sortType}&page=${page}`))
  }

  static postReview (data: ReviewEditingData) {
    return this.post('/review', data)
  }
}

export class Parser {
  static parseTier (tierData: TierData) : Tier {
    const reviews: Review[] = []
    tierData.reviews.forEach((v) => {
      reviews.push(Parser.parseReview(v))
    })
    return {
      tierId: tierData.tierId,
      userName: tierData.userName,
      userId: tierData.userId,
      userIconUrl: tierData.userIconUrl,
      pointType: tierData.pointType,
      name: tierData.name,
      imageUrl: tierData.imageUrl,
      parags: tierData.parags,
      reviews: reviews,
      reviewFactorParams: tierData.reviewFactorParams,
      createAt: new Date(tierData.createAt),
      updateAt: new Date(tierData.updateAt)
    }
  }

  static parseReview (reviewData: ReviewData) : Review {
    return {
      reviewId: reviewData.reviewId,
      tierId: reviewData.tierId,
      userName: reviewData.userName,
      userId: reviewData.userId,
      userIconUrl: reviewData.userIconUrl,
      title: reviewData.title,
      name: reviewData.name,
      iconUrl: reviewData.iconUrl,
      reviewFactors: reviewData.reviewFactors,
      pointType: reviewData.pointType,
      sections: reviewData.sections,
      createAt: new Date(reviewData.createAt),
      updateAt: new Date(reviewData.updateAt)
    }
  }
}
