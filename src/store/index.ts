import RestApi from '@/common/restapi'
import { createStore, useStore as baseUseStore } from 'vuex'
import persist from 'vuex-persistedstate'

export type State = {
  tempSessionId: string
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
  expiredTime: string
  isNew: boolean
  barIsVisible: boolean
}

export default createStore<State>({
  state: {
    tempSessionId: '',
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
    expiredTime: '',
    isNew: true,
    barIsVisible: true
  },
  getters: {
    isRegistered: (state) => state.sessionId && state.userId && true
  },
  mutations: {
    setTempSessionId (state, val: string) {
      state.tempSessionId = val
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
    initAllSession (state) {
      state.tempSessionId = ''
      state.sessionId = ''
      state.twitterName = ''
      state.userId = ''
      state.twitterUserName = ''
      state.twitterIconUrl = ''
      state.expiredTime = ''
      state.isNew = false
    },
    setBarIsVisible (state, val: boolean) {
      state.barIsVisible = val
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
