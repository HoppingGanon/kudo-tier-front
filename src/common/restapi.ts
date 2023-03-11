import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '@/store'
import { Review, Tier, TierEditingData, ReviewFactor, ReviewPointType, ReviewSection, ReviewParagraph, ReviewFactorParam, ReviewEditingData, ReviewWithParams } from './review'
import CommonApi from './commonapi'
import { PostSortType } from './page'
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

/** セッションの受信データ */
export interface Session {
  /** セッションID */
  sessionId: string
  /** ユーザーID */
  userId: string
  /** セッション期限 */
  expiredTime: string
  /** 新規作成状態かどうか */
  isNew: string
  /** ユーザーアイコン */
  iconUrl: string

  /** twitter @ 名 */
  twitterUserName: string
  /** twitter表示名  */
  twitterName: string
  /** twitterアイコン */
  twitterIconUrl: string

  /** Google Email */
  googleEmail: string
  /** Googleアイコン */
  googleImageUrl: string

}

/** ユーザー作成時の送信データ */
export interface UserCreatingData {
  name: string
  profile: string
  iconBase64: string
  accept: boolean
}

/** ユーザー編集時の送信データ */
export interface UserEditingData {
  name: string
  profile: string
  iconBase64: string
  iconIsChanged: boolean
  allowTwitterLink: boolean
  keepSession: number
}

/** ユーザーの受信データ */
export interface UserData {
  /** ユーザーID */
  userId: string
  /** ログインユーザー自分自身かどうか */
  isSelf: boolean
  /** ユーザー名 */
  name: string
  /** プロフィール文 */
  profile: string
  /** ログイン状態の保持時間 */
  keepSession?: number
  /** Twitterリンクをホームに表示するかどうか */
  allowTwitterLink: boolean

  /** Twitterの固有ID（allowTwitterLinkがtrueの時または本人がリクエストした場合以外は空白） */
  twitterId: string
  /** Twitterの@ 名 */
  twitterUserName: string

  /** GoogleのGmailアドレス（本人がリクエストした場合のみ含まれる） */
  googleEmail?: string
  /** ユーザーアイコン */
  iconUrl: string

  /** 今まで投稿したレビューの合計数 */
  reviewsCount: number
  /** 今まで投稿したTierの合計数 */
  tiersCount: number
}

/** レビューの受信データ */
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

/** レビューと評価項目とTier調整値の受信データ */
export interface ReviewDataWithParams {
  review: ReviewData
  params: ReviewFactorParam[]
  pullingUp: number
  pullingDown: number
}

/** Tierの受信データ */
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
  /** レビューの評価項目 */
  reviewFactorParams: ReviewFactorParam[]

  /** Tierを上方向に引き上げる */
  pullingUp: number
  /** Tierを下方向に引き下げる */
  pullingDown: number

  createdAt: string
  updatedAt: string
}

/** 投稿リスト一件分のデータ */
export interface PostListItem {
  id: string
  name: string
}

/** Tier及びレビューの投稿データのリスト */
export interface PostListsData {
  tiers: PostListItem[]
  reviews: PostListItem[]
}

/** エラー発生時にサーバーから受信するメッセージとコード */
export interface ErrorResponse {
  code: number
  message: string
}

/** サービス連携のタイプ */
export type LoginServiceType = 'twitter' | 'google'
export const LoginServiceTypeNames = {
  twitter: 'Twitter',
  google: 'Google'
}

/** サービス連携のバージョン（OAuthバージョン） */
export type LoginVersionType = '1' | '2'

/** 通知の受信データ */
export interface NotificationData {
  /** 通知ID */
  id: number
  /** 表示する文章 */
  content: string
  /** 既読フラグ */
  isRead: boolean
  /** 重要情報フラグ */
  isImportant: boolean
  /** クリックした際に飛ぶURL */
  url: string
  /** 発信日時 */
  createdAt: string
}

/** 件数カウントのみの場合の受信データ */
export interface CountData {
  count: number
}

export const getImgSource = (uri: string) => {
  switch (Base64Api.isDataUrl(uri)) {
    case 'base64':
      return uri
    case 'blob':
      return uri
    case 'link':
      return `${process.env.VUE_APP_BACK_BASE_URI}/userfile/${uri}`
    case 'empty':
      return ''
  }
}

/** サーバーから受信したエラーをトーストする汎用関数 */
export const toastError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any, toast: ToastPluginApi, func?: (e: any) => void) => {
  if (err && err.response && err.response.data) {
    if (err.response.data.code) {
      const v = err.response.data
      toast.warning(`${v.message} (${v.code})`)
    } else {
      toast.warning('fatal エラーが発生しました')
    }
  } else {
    toast.error('fatal APIサーバーと正常な通信が確立出来ません')
  }
  if (func) {
    func(err)
  }
}

/** RestAPI通信用のツールセット */
export default class RestApi {
  /** セッション情報を含めてベースURIに続けてGETリクエスト */
  static get <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.get<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  /** セッション情報を含めてベースURIに続けてPATCHリクエスト */
  static update <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.patch<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  /** セッション情報を含めてベースURIに続けてPOSTリクエスト */
  static post <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.post<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  /** セッション情報を含めてベースURIに続けてDELETEリクエスト */
  static delete <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    }
    return axios.delete<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  /**
   * 一時セッションを受信
   * @param service 連携先サービスタイプ
   * @param version OAuthバージョン
   * @returns Promise
   */
  static getTempSession (service: LoginServiceType, version: LoginVersionType) : Promise<AxiosResponse<TempSession>> {
    return axios.get<TempSession>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/tempsession/${service}/${version}`)
  }

  /**
   * セッションを受信
   * @param tempSessionId セッションID
   * @param service 連携先サービスタイプ
   * @param version OAuthバージョン
   * @param authorizationCode 連携先サービスから受けとったデータ
   * @param oAuthToken 連携先サービスから受けとったデータ
   * @param oAuthVerifier 連携先サービスから受けとったデータ
   * @param state 連携先サービスから受けとったデータ
   * @returns Promise
   */
  static postSession (tempSessionId: string, service: LoginServiceType, version: LoginVersionType, authorizationCode: string, oAuthToken: string, oAuthVerifier: string, state: string) {
    // セッションではなく一時セッションを用いる特殊なGETでセッションを取得する
    return axios.post<Session>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/session/${service}/${version}`, {
      sessionId: tempSessionId,
      authorizationCode: authorizationCode,
      oAuthToken: oAuthToken,
      oAuthVerifier: oAuthVerifier,
      state: state
    })
  }

  /**
   * 現在ログイン中のユーザー情報に連携サービスを追加する
   * @param tempSessionId セッションID
   * @param service 連携先サービスタイプ
   * @param version OAuthバージョン
   * @param authorizationCode 連携先サービスから受けとったデータ
   * @param oAuthToken 連携先サービスから受けとったデータ
   * @param oAuthVerifier 連携先サービスから受けとったデータ
   * @param state 連携先サービスから受けとったデータ
   * @returns Promise
   */
  static updateService (tempSessionId: string, service: LoginServiceType, version: LoginVersionType, authorizationCode: string, oAuthToken: string, oAuthVerifier: string, state: string) {
    return this.update(`/auth/service/${service}/${version}`, {
      sessionId: tempSessionId,
      authorizationCode: authorizationCode,
      oAuthToken: oAuthToken,
      oAuthVerifier: oAuthVerifier,
      state: state
    })
  }

  /**
   * 現在ログイン中のユーザー情報から連携サービスを削除する
   * @param service 連携先サービスタイプ
   * @returns Promise
   */
  static deleteService (service: LoginServiceType) {
    return this.delete(`/auth/service/${service}`)
  }

  /**
   * ログイン中のユーザーセッションをサーバーから削除する
   * @returns Promise
   */
  static delSession () : Promise<AxiosResponse<Session>> {
    return this.delete('/auth/session')
  }

  /**
   * セッションがサーバーにあるか確認
   * @returns Promise
   */
  static getCheckSession () {
    return this.get<string>('/auth/check-session')
  }

  /**
   * ユーザーを作成
   * @param data ユーザーデータ
   * @returns Promise
   */
  static createUser (data: UserCreatingData) {
    return this.post<UserData>('/user', data)
  }

  /**
   * ユーザーデータを更新
   * @param data ユーザーデータ
   * @param userId ユーザーID
   * @returns Promise
   */
  static updateUser (data: UserEditingData, userId: string) {
    return this.update<UserData>(`/user/${userId}`, data)
  }

  /**
   * ユーザーデータを取得
   * @param userId ユーザーID
   * @returns Promise
   */
  static getUserData (userId: string) {
    return this.get<UserData>(`/user/${userId}`)
  }

  /**
   * ユーザーを削除するための削除コードを取得する
   * @param userId ユーザーID
   * @returns Promise
   */
  static deleteUser1 (userId: string) {
    return this.delete<string>(`/user/${userId}/try`)
  }

  /**
   * ユーザーを削除
   * @param userId ユーザーID
   * @param delcode 削除コード
   * @returns Promise
   */
  static deleteUser2 (userId: string, delcode: string) {
    return this.delete<null>(`/user/${userId}/commit?delcode=${delcode}`)
  }

  /**
   * 最近の投稿を取得
   * @param userId ユーザーID
   * @param length 件数
   * @returns Promise
   */
  static getLatestPostLists (userId: string, length: number) {
    return this.get<PostListsData>(`/latest-post-lists/${userId}?length=${length}`)
  }

  /**
   * Tierを作成
   * @param data Tierデータ
   * @returns Promise
   */
  static postTier (data: TierEditingData) {
    return this.post('/tier', data)
  }

  /**
   * Tierを取得
   * @param tierId TierID
   * @returns Promise
   */
  static getTier (tierId: string) {
    return this.get<TierData>(`/tier/${tierId}`)
  }

  /**
   * Tierデータを更新
   * @param data Tierデータ
   * @param tierId TierID
   * @returns Proimise
   */
  static updateTier (data: TierEditingData, tierId: string) {
    return this.update(`/tier/${tierId}`, data)
  }

  /**
   * 条件を指定して、ヒットしたTierリストを取得
   * @param userId ユーザーId
   * @param word 検索ワード
   * @param sortType ソートタイプ
   * @param page リストのページ(1を指定すると1~n件目までを取得、2を指定するとn+1～2n件目までを取得)
   * @returns Promise
   */
  static getTierList (userId: string, word: string, sortType: PostSortType, page: number) {
    return this.get<TierData[]>(encodeURI(`/tiers?userid=${userId}&word=${word}&sorttype=${sortType}&page=${page}`))
  }

  /**
   * Tierを削除
   * @param tierId TierID
   * @returns Promise
   */
  static deleteTier (tierId: string) {
    return this.delete(`/tier/${tierId}`)
  }

  /**
   * レビューを作成
   * @param data レビューデータ
   * @returns Promise
   */
  static postReview (data: ReviewEditingData) {
    return this.post('/review', data)
  }

  /**
   * レビューを取得
   * @param reviewId レビューＩＤ
   * @returns Promise
   */
  static getReview (reviewId: string) {
    return this.get<ReviewDataWithParams>(`/review/${reviewId}`)
  }

  /**
   * レビューを更新
   * @param reviewId レビューID
   * @param data レビューデータ
   * @returns Promise
   */
  static updateReview (reviewId: string, data: ReviewEditingData) {
    return this.update<ReviewDataWithParams>(`/review/${reviewId}`, data)
  }

  /**
   * 条件を指定して、ヒットしたレビューを取得
   * @param userId ユーザーID
   * @param word 検索ワード
   * @param sortType ソートタイプ
   * @param page リストのページ(1を指定すると1~n件目までを取得、2を指定するとn+1～2n件目までを取得)
   * @returns Promise
   */
  static getReviewPairs (userId: string, word: string, sortType: PostSortType, page: number) {
    return this.get<ReviewDataWithParams[]>(encodeURI(`/review-pairs?userid=${userId}&word=${word}&sorttype=${sortType}&page=${page}`))
  }

  /**
   * レビューを削除
   * @param reviewId レビューID
   * @returns Promise
   */
  static deleteReview (reviewId: string) {
    return this.delete(`/review/${reviewId}`)
  }

  /**
   * 画像をBlobで取得
   * @param userFilePath userfileのパス
   * @returns Promise
   */
  static getImage (userFilePath: string) {
    return axios.get(getImgSource(userFilePath), { responseType: 'blob' })
  }

  /**
   * 通知リストを取得
   * @returns Promise
   */
  static getNotifications () {
    return this.get<NotificationData[]>('/common/notifications')
  }

  /**
   * 通知リストを取得
   * @returns Promise
   */
  static getNotificationsCount () {
    return this.get<CountData>('/common/notifications-count')
  }

  /**
   * 通知既読状態を更新
   * @param notificationId 通知ID
   * @param isRead 既読状態
   * @returns Promise
   */
  static updateNotificationRead (notificationId: number, isRead: boolean) {
    return this.update(`/common/notification-read/${notificationId}`, {
      isRead: isRead
    })
  }
}

/** データのパースに使用 */
export class Parser {
  /** 通知のパース */
  static parseNotificationsStr (notifications: NotificationData[]) {
    const converted: NotificationData[] = []
    notifications.forEach((v) => {
      converted.push({
        id: v.id,
        content: v.content,
        isRead: v.isRead,
        isImportant: v.isImportant,
        url: v.url,
        createdAt: CommonApi.dateToString(new Date(v.createdAt), true)
      })
    })

    return converted
  }

  /** Tierのパース */
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

  /** レビューのパース */
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

  /** 評価項目付きレビューのパース */
  static parseReviewWithParams (pair: ReviewDataWithParams) : ReviewWithParams {
    return {
      review: Parser.parseReview(pair.review),
      params: pair.params,
      pullingUp: pair.pullingUp,
      pullingDown: pair.pullingDown
    }
  }
}
