<!-- 特に画面表示せずにセッションのチェックのみ行うコンポーネント -->

<template>
  <v-card v-if="false">
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import RestApi from '@/common/restapi'
import router from '@/router'
import { useToast } from 'vue-toast-notification'
import { useStore } from '@/store'

export default defineComponent({
  name: 'SessionChecker',
  props: {
    /** セッションが無い場合はエラー表示してwelcomeページに移動する */
    noSessionError: {
      type: Boolean,
      default: false
    },
    /** 一時セッションが無い場合はエラー表示してwelcomeページに移動する */
    noTempSessionError: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const toast = useToast()
    const store = useStore()

    onMounted(() => {
      // セッションチェッカーが存在するページに一時セッションは不要
      if (store.state.tempSessionId || store.state.tempSessionService || store.state.tempSessionVersion) {
        store.commit('initTempSession')
      }

      try {
        if (props.noSessionError) {
          // セッション必須
          if (store.getters.isRegistered) {
            RestApi.getCheckSession().then(() => true).catch(() => {
              store.commit('initAllSession')
              toast.warning('セッションの有効期限が切れました。ログインしてください。')
              router.push('/')
            })
          } else {
            store.commit('initAllSession')
            toast.warning('セッションがありません。ログインしてください。')
            router.push('/')
          }
        } else if (props.noTempSessionError) {
          // 一時セッション必須
          if (store.state.tempSessionId !== '') {
            store.commit('initAllSession')
            toast.warning('一時セッションがありません。ログインしてください。')
            router.push('/')
          }
        } else {
          // 必須セッション無し
          if (store.getters.isRegistered) {
            if (new Date() < new Date(store.state.expiredTime)) {
              // セッション有効期限内
            } else {
              // セッション有効期限切れ
              store.commit('initAllSession')
              toast.warning('セッションの有効期限が切れました。再度ログインしてください。')
            }
          }
        }
      } catch {
        // 不明なエラー
        store.commit('initAllSession')
        toast.warning('セッションが壊れています。再度ログインしてください。')
        if (props.noSessionError || props.noTempSessionError) {
          router.push('/login')
        }
      }
    })
  }
})
</script>
