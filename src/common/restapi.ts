import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '@/store'
import { Review, Tier, TierEditingData, ReviewFactor, ReviewPointType, ReviewSection, ReviewParagraph, ReviewFactorParam, ReviewEditingData, ReviewWithParams } from './review'
import { TierSortType } from './page'
import { ToastPluginApi } from 'vue-toast-notification'
import Base64Api from './base64api'

export interface TempSession {
  sessionId: string
  codeChallenge: string
  url: string
}

export interface TwitterAuthCode {
  code: string
  state: string
}

export interface Session {
  sessionId: string
  userId: string
  /** セッション期限 */
  expiredTime: string
  /** twitter @ 名 */
  twitterUserName: string
  /** twitter表示名  */
  twitterName: string
  twitterIconUrl: string
  iconUrl: string
  isNew: string
}

export interface UserCreatingData {
  name: string
  profile: string
  iconBase64: string
  accept: boolean
}

export interface UserEditingData {
  name: string
  profile: string
  iconBase64: string
  iconIsChanged: boolean
  allowTwitterLink: boolean
  keepSession: number
}

export interface UserData {
  userId: string
  name: string
  profile: string
  /** Teittwrの表示名 */
  twitterId: string
  /** ログイン状態の保持時間 */
  keepSession?: number
  iconUrl: string
  reviewsCount: number
  tiersCount: number
  allowTwitterLink: boolean
}

/** レビューをダウンロードする際の構造 */
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
  createdAt: string
  updatedAt: string
}

export interface ReviewDataWithParams {
  review: ReviewData
  params: ReviewFactorParam[]
  pullingUp: number
  pullingDown: number
}

/** Tierをダウンロードする際の構造 */
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

  /** Tierを上方向に引き上げる */
  pullingUp: number
  /** Tierを下方向に引き下げる */
  pullingDown: number

  createdAt: string
  updatedAt: string
}

export interface PostListItem {
  id: string
  name: string
}

export interface PostListsData {
  tiers: PostListItem[]
  reviews: PostListItem[]
}

export interface ErrorResponse {
  code: number
  message: string
}

export type LoginServiceType = 'twitter' | 'google'
export type LoginVersionType = '1' | '2'

export const getImgSource = (uri: string) => {
  switch (Base64Api.isDataUrl(uri)) {
    case true:
      return uri
    case false:
      return `${process.env.VUE_APP_BACK_BASE_URI}/${uri}`
    case undefined:
      return ''
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toastError = (err: any, toast: ToastPluginApi, func?: (e: any) => void) => {
  const v = err.response.data
  toast.error(`${v.message} (${v.code})`)
  if (func) {
    func(err)
  }
}

export default class RestApi {
  static get <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.get<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  static update <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.patch<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  static post <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.post<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  static delete <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.delete<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  static getTempSession (service: LoginServiceType, version: LoginVersionType) : Promise<AxiosResponse<TempSession>> {
    return axios.get<TempSession>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/tempsession/${service}/${version}`)
  }

  // セッションではなく一時セッションを用いる特殊なGETでセッションを取得する
  static postSession (tempSessionId: string, service: LoginServiceType, version: LoginVersionType, authorizationCode: string, oAuthToken: string, oAuthVerifier: string, state: string) : Promise<AxiosResponse<Session>> {
    return axios.post<Session>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/session/${service}/${version}`, {
      sessionId: tempSessionId,
      authorizationCode: authorizationCode,
      oAuthToken: oAuthToken,
      oAuthVerifier: oAuthVerifier,
      state: state
    })
  }

  static delSession () : Promise<AxiosResponse<Session>> {
    return this.delete('/auth/session')
  }

  static getCheckSession () {
    return this.get('/auth/check-session')
  }

  static createUser (data: UserCreatingData) {
    return this.post<UserData>('/user', data)
  }

  static updateUser (data: UserEditingData, userId: string) {
    return this.update<UserData>(`/user/${userId}`, data)
  }

  static getUserData (userId: string) {
    return this.get<UserData>(`/user/${userId}`)
  }

  static deleteUser1 (userId: string) {
    return this.delete<string>(`/user/${userId}/try`)
  }

  static deleteUser2 (userId: string, delcode: string) {
    return this.delete<null>(`/user/${userId}/commit?delcode=${delcode}`)
  }

  static getLatestPostLists (userId: string, length: number) {
    return this.get<PostListsData>(`/latest-post-lists/${userId}?length=${length}`)
  }

  static postTier (data: TierEditingData) {
    return this.post('/tier', data)
  }

  static getTier (tierId: string) {
    return this.get<TierData>(`/tier/${tierId}`)
  }

  static updateTier (data: TierEditingData, tierId: string) {
    return this.update(`/tier/${tierId}`, data)
  }

  static getTierList (userId: string, word: string, sortType: TierSortType, page: number) {
    return this.get<TierData[]>(encodeURI(`/tiers?userid=${userId}&word=${word}&sorttype=${sortType}&page=${page}`))
  }

  static deleteTier (tierId: string) {
    return this.delete(`/tier/${tierId}`)
  }

  static postReview (data: ReviewEditingData) {
    return this.post('/review', data)
  }

  static getReview (reviewId: string) {
    return this.get<ReviewDataWithParams>(`/review/${reviewId}`)
  }

  static updateReview (reviewId: string, data: ReviewEditingData) {
    return this.update<ReviewDataWithParams>(`/review/${reviewId}`, data)
  }

  static getReviewPairs (userId: string, word: string, sortType: TierSortType, page: number) {
    return this.get<ReviewDataWithParams[]>(encodeURI(`/review-pairs?userid=${userId}&word=${word}&sorttype=${sortType}&page=${page}`))
  }

  static deleteReview (reviewId: string) {
    return this.delete(`/review/${reviewId}`)
  }

  static getImage (userFilePath: string) {
    return axios.get(getImgSource(userFilePath), { responseType: 'blob' })
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
      pullingUp: tierData.pullingUp,
      pullingDown: tierData.pullingDown,
      createdAt: new Date(tierData.createdAt),
      updatedAt: new Date(tierData.updatedAt)
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
      createdAt: new Date(reviewData.createdAt),
      updatedAt: new Date(reviewData.updatedAt)
    }
  }

  static parseReviewWithParams (pair: ReviewDataWithParams) : ReviewWithParams {
    return {
      review: Parser.parseReview(pair.review),
      params: pair.params,
      pullingUp: pair.pullingUp,
      pullingDown: pair.pullingDown
    }
  }
}
