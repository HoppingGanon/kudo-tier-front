import { createStore } from 'vuex'
import { State } from '@/store/types'

export default createStore<State>({
  state: {
    tCodeVer: '',
    jwt: ''
  },
  getters: {
    getCodeVer (state) {
      return state.tCodeVer
    }
  },
  mutations: {
    setCodeVer (state, val: string) {
      state.tCodeVer = val
    }
  },
  actions: {
  },
  modules: {
  }
})
