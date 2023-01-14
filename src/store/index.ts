import { createStore, useStore as baseUseStore } from 'vuex'
import persist from 'vuex-persistedstate'

export type State = {
  tempSessionId: string
  sessionId: string
  userId: string
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
