import { createStore, useStore as baseUseStore } from 'vuex'
import persist from 'vuex-persistedstate'

export type State = {
  tempSessionId: string
  sessionId: string
  expiredTime: Date
  isNew: boolean
}

export default createStore<State>({
  state: {
    tempSessionId: '',
    sessionId: '',
    expiredTime: new Date('1970/01/01'),
    isNew: true
  },
  getters: {
    getTempSessionId (state) {
      return state.tempSessionId
    },
    getSessionId (state) {
      return state.sessionId
    },
    getExpiredTime (state) {
      return state.expiredTime
    },
    getIsNew (state) {
      return state.isNew
    }
  },
  mutations: {
    setTempSessionId (state, val: string) {
      state.tempSessionId = val
    },
    setSessionId (state, val: string) {
      state.sessionId = val
    },
    setExpiredTime (state, val: Date) {
      state.expiredTime = val
    },
    setIsNew (state, val: boolean) {
      state.isNew = val
    },
    initAllSession (state) {
      state.tempSessionId = ''
      state.sessionId = ''
      state.expiredTime = new Date('1970/01/01')
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
