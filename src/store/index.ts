import { createStore, useStore as baseUseStore } from 'vuex'
import { State } from '@/store/types'
import persist from 'vuex-persistedstate'

export default createStore<State>({
  state: {
    tempSessionId: '',
    jwt: ''
  },
  getters: {
    getCodeVer (state) {
      return state.tempSessionId
    }
  },
  mutations: {
    setCodeVer (state, val: string) {
      state.tempSessionId = val
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
