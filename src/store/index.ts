import RestApi, { LoginServiceType, LoginVersionType } from '@/common/restapi'
import { createStore, useStore as baseUseStore } from 'vuex'
import persist from 'vuex-persistedstate'

export type State = {
  /** 受け取った一時セッション（普段は空文字列） */
  tempSessionId: string
  /** 一時セッションの要求中に指定している連携サービス（普段は空文字列） */
  tempSessionService: LoginServiceType | ''
  /** 一時セッションの要求中に指定しているOAuthバージョン（普段は空文字列） */
  tempSessionVersion: LoginVersionType | ''
  /** 連携サービス追加のために一時セッションを要求している（普段は空文字列） */
  tempSessionAdditioning: boolean

  sessionId: string
  userId: string
  userName: string
  userProfile: string
  userIconUrl: string
  tiersCount: number
  reviewsCount: number

  twitterName: string
  twitterUserName: string
  twitterIconUrl: string

  googleEmail: string
  googleImageUrl: string

  expiredTime: string
  isNew: boolean
}

export default createStore<State>({
  state: {
    tempSessionId: '',
    tempSessionService: '',
    tempSessionVersion: '',
    tempSessionAdditioning: false,
    sessionId: '',
    userId: '',
    userName: '',
    userProfile: '',
    userIconUrl: '',
    tiersCount: 0,
    reviewsCount: 0,
    twitterName: '',
    twitterUserName: '',
    twitterIconUrl: '',
    googleEmail: '',
    googleImageUrl: '',
    expiredTime: '',
    isNew: true
  },
  getters: {
    /** ログイン状態かつユーザーIDを持っていて、セッション有効期限内かどうかチェック */
    isRegistered: (state) => state.sessionId && state.userId && true
  },
  mutations: {
    setTempSessionId (state, val: string) {
      state.tempSessionId = val
    },
    setTempSessionService (state, val: LoginServiceType | '') {
      state.tempSessionService = val
    },
    setTempSessionVersion (state, val: LoginVersionType | '') {
      state.tempSessionVersion = val
    },
    setTempSessionAdditioning (state, val: boolean) {
      state.tempSessionAdditioning = val
    },
    setSessionId (state, val: string) {
      state.sessionId = val
    },
    setExpiredTime (state, val: string) {
      state.expiredTime = val
    },
    setIsNew (state, val: boolean) {
      state.isNew = val
    },
    setUserId (state, val: string) {
      state.userId = val
    },
    setUserName (state, val: string) {
      state.userName = val
    },
    setUserProfile (state, val: string) {
      state.userProfile = val
    },
    setUserIcon (state, val: string) {
      state.userIconUrl = val
    },
    setReviewsCount (state, val: number) {
      state.reviewsCount = val
    },
    setTiersCount (state, val: number) {
      state.tiersCount = val
    },
    setTwitterName (state, val: string) {
      state.twitterName = val
    },
    setTwitterUserName (state, val: string) {
      state.twitterUserName = val
    },
    setTwitterIconUrl (state, val: string) {
      state.twitterIconUrl = val
    },
    setGoogleEmail (state, val: string) {
      state.googleEmail = val
    },
    setGoogleImageUrl (state, val: string) {
      state.googleImageUrl = val
    },
    initTempsSession (state) {
      state.tempSessionId = ''
      state.tempSessionService = ''
      state.tempSessionVersion = ''
      state.tempSessionAdditioning = false
    },
    initAllSession (state) {
      state.tempSessionId = ''
      state.tempSessionService = ''
      state.tempSessionVersion = ''
      state.tempSessionAdditioning = false
      state.sessionId = ''
      state.twitterName = ''
      state.userId = ''
      state.twitterUserName = ''
      state.twitterIconUrl = ''
      state.googleEmail = ''
      state.googleImageUrl = ''
      state.expiredTime = ''
      state.isNew = false
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    downloadUserData (state, userId?: string, success?: (v: any) => void, failure?: (v: any) => void) {
      if (userId) {
        state.userId = userId
        RestApi.getUserData(userId).then((res) => {
          state.userName = res.data.name
          state.userProfile = res.data.profile
          state.userIconUrl = res.data.iconUrl
          state.reviewsCount = res.data.reviewsCount
          state.tiersCount = res.data.tiersCount
        }).then(success).catch(failure)
      } else if (userId === undefined && state.userId) {
        RestApi.getUserData(state.userId).then((res) => {
          state.userName = res.data.name
          state.userProfile = res.data.profile
          state.userIconUrl = res.data.iconUrl
          state.reviewsCount = res.data.reviewsCount
          state.tiersCount = res.data.tiersCount
        }).then(success).catch(failure)
      }
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    persist({
      storage: window.localStorage
    })
  ]
})

export function useStore () {
  return baseUseStore()
}
