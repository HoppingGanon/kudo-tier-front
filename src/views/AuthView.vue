<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store/index'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import restApi, { } from '@/common/restapi'

export default defineComponent({
  name: 'AuthView',
  setup () {
    // const authLink = computed(() => {
    const route = useRoute()
    const store = useStore()
    const code = route.query.code as string

    if (store.state.sessionId !== '') {
      router.push('/')
    } else if (store.state.tempSessionId !== '') {
      // 一時セッションを持っている場合
      restApi.getSession(code, store.state.tempSessionId).then((response) => {
        store.commit('setSessionId', response.data.sessionId)
        store.commit('setExpiredTime', response.data.expiredTime)
        store.commit('setIsNew', response.data.isNew)
        store.commit('setTempSessionId', '')
        if (response.data.isNew) {
          router.push('/regist')
        } else {
          router.push('/')
        }
      }).catch((err) => {
        alert('認証失敗:' + err.response.data)
        store.commit('setTempSessionId', '')
        router.push('/login')
      })
    }
  }
})
</script>
