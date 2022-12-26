import { createStore, useStore as baseUseStore } from 'vuex'
import persist from 'vuex-persistedstate'

export type State = {
  tempSessionId: string
  sessionId: string
  userId: string
  twitterName: string
  twitterUserName: string
  iconUrl: string
  expiredTime: string
  isNew: boolean
}

export default createStore<State>({
  state: {
    tempSessionId: '',
    sessionId: '',
    userId: '',
    twitterName: '',
    twitterUserName: '',
    iconUrl: '',
    expiredTime: '',
    isNew: true
  },
  getters: {},
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
    setIconUrl (state, val: string) {
      state.iconUrl = val
    },
    initAllSession (state) {
      state.tempSessionId = ''
      state.sessionId = ''
      state.twitterName = ''
      state.userId = ''
      state.twitterUserName = ''
      state.expiredTime = ''
      state.isNew = false
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
