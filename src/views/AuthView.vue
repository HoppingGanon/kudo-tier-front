<template>
  <div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from '@/store/index'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import RestApi, { toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'AuthView',
  component: { },
  setup () {
    const route = useRoute()
    const store = useStore()
    const toast = useToast()

    const authorize = async () => {
      await router.isReady()
      const code = (route.query.code || '') as string
      const oAuthVerifier = (route.query.oauth_verifier || '') as string
      const oAuthToken = (route.query.oauth_token || '') as string
      if (!store.getters.isRegistered && store.state.tempSessionId) {
        // 一時セッションを持っている場合
        if (store.state.tempSessionVersion === '1') {
          switch (store.state.tempSessionService) {
            case 'twitter':
              RestApi.postSession(store.state.tempSessionId, 'twitter', '1', code, oAuthToken, oAuthVerifier).then((response) => {
                store.commit('setTempSessionId', '')
                store.commit('setTempSessionService', '')
                store.commit('setTempSessionVersion', '')
                store.commit('setSessionId', response.data.sessionId)
                store.commit('setTwitterName', response.data.twitterName)
                store.commit('setTwitterUserName', response.data.twitterUserName)
                store.commit('setTwitterIconUrl', response.data.twitterIconUrl)
                store.commit('setUserId', response.data.userId)
                store.commit('setExpiredTime', response.data.expiredTime)
                store.commit('setIsNew', response.data.isNew)
                if (response.data.isNew) {
                  router.replace('/regist')
                } else {
                  router.replace(`/home/${response.data.userId}`)
                }
              }).catch((err) => {
                toastError(err, toast)
                store.commit('initAllSession')
                router.replace('/login')
              })
              break
          }
          return
        } else if (store.state.tempSessionVersion === '2') {
          switch (store.state.tempSessionService) {
            case 'twitter':
              RestApi.postSession(store.state.tempSessionId, 'twitter', '2', code, '', '').then((response) => {
                store.commit('setTempSessionId', '')
                store.commit('setTempSessionService', '')
                store.commit('setTempSessionVersion', '')
                store.commit('setSessionId', response.data.sessionId)
                store.commit('setTwitterName', response.data.twitterName)
                store.commit('setTwitterUserName', response.data.twitterUserName)
                store.commit('setTwitterIconUrl', response.data.twitterIconUrl)
                store.commit('setUserId', response.data.userId)
                store.commit('setExpiredTime', response.data.expiredTime)
                store.commit('setIsNew', response.data.isNew)
                if (response.data.isNew) {
                  router.replace('/regist')
                } else {
                  router.replace(`/home/${response.data.userId}`)
                }
              }).catch((err) => {
                toastError(err, toast)
                store.commit('initAllSession')
                router.replace('/login')
              })
              break
            case 'google':
              break
          }
          return
        }
      }
      router.replace('/login')
    }

    onMounted(() => {
      authorize()
    })
  }
})
</script>
