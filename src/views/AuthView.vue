<template>
  <div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from '@/store/index'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import RestApi, { Session, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { Store } from 'vuex'

/**
 * 受け取ったセッションを保存する関数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveSession (data: Session, store: Store<any>) {
  store.commit('setSessionId', data.sessionId)
  store.commit('setUserId', data.userId)
  store.commit('setExpiredTime', data.expiredTime)
  store.commit('setIsNew', data.isNew)
}

/**
 * 受け取ったTwitterアカウントの情報を保存する関数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveTwitterSession (data: Session, store: Store<any>) {
  store.commit('setTwitterUserName', data.twitterUserName)
  store.commit('setTwitterName', data.twitterName)
  store.commit('setTwitterIconUrl', data.twitterIconUrl)
}

/**
 * 受け取ったGoogleアカウントの情報を保存する関数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveGoogleSession (data: Session, store: Store<any>) {
  store.commit('setGoogleImageUrl', data.googleImageUrl)
  store.commit('setGoogleEmail', data.googleEmail)
}
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
      const state = (route.query.state || '') as string

      if (code === '' && oAuthVerifier === '' && oAuthToken === '') {
        if (store.state.tempSessionAdditioning) {
          router.replace('/settings?tab=detail')
          return
        } else {
          router.replace('/login')
          return
        }
      }

      if (store.getters.isRegistered && store.state.tempSessionId && store.state.tempSessionAdditioning) {
        // 既存のセッションとユーザーに新しいサービスを連携する場合
        RestApi.updateService(store.state.tempSessionId, store.state.tempSessionService, store.state.tempSessionVersion, code, oAuthToken, oAuthVerifier, state).then(() => {
          // 一時セッション情報のクリア
          store.commit('initTempSession')
          router.replace('/settings?tab=detail')
        }).catch((err) => {
          toastError(err, toast)
          router.replace('/settings?tab=detail')
        })
      } else if (!store.getters.isRegistered && store.state.tempSessionId && !store.state.setTempSessionAdditioning) {
        // 通常ログイン
        RestApi.postSession(store.state.tempSessionId, store.state.tempSessionService, store.state.tempSessionVersion, code, oAuthToken, oAuthVerifier, state).then((response) => {
          // セッションの保存
          saveSession(response.data, store)

          // 連携サービスの情報を保存
          switch (store.state.tempSessionService) {
            case 'twitter':
              saveTwitterSession(response.data, store)
              break
            case 'google':
              saveGoogleSession(response.data, store)
              break
          }

          // 一時セッション情報のクリア
          store.commit('initTempSession')

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
      } else {
        // 組み合わせエラー
        toast.error('クライアントの一時セッションの状態が異常です')
        router.replace('/')
      }
    }

    onMounted(() => {
      authorize()
    })
  }
})
</script>
