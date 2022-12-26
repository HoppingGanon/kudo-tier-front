<template>
  <div>
  </div>
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
    isGoing: {
      type: Boolean,
      default: false
    },
    noSessionError: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const toast = useToast()
    const store = useStore()

    onMounted(() => {
      try {
        // noSessionErrorがあれば、セッションが無い場合に強制転送
        if (props.noSessionError && store.state.sessionId === '') {
          toast.warning('セッションがありません。ログインしてください。')
          router.push('/login')
        }
        if (store.state.sessionId !== '' && new Date(store.state.expiredTime) < new Date()) {
          RestApi.delSession().then(() => {
            store.commit('initAllSession')
            toast.warning('セッションの有効期限が切れました。再度ログインしてください。')
            if (props.isGoing) {
              router.push('/login')
            }
          }).catch(() => {
            store.commit('initAllSession')
            toast.warning('セッションの有効期限が切れました。再度ログインしてください。')
            if (props.isGoing) {
              router.push('/login')
            }
          })
        }
      } catch {
        store.commit('initAllSession')
        toast.warning('セッションが壊れています。再度ログインしてください。')
        router.push('/login')
        if (props.isGoing) {
          router.push('/login')
        }
      }
    })
  }
})
</script>
