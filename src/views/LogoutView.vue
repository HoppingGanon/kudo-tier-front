
<!-- ログアウト時に使用するページ -->

<template>
  <div>
  </div>
</template>

<script lang="ts">
import RestApi from '@/common/restapi'
import store from '@/store'
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'LogoutView',
  components: {},
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const toast = useToast()
    const router = useRouter()
    onMounted(() => {
      if (store.getters.isRegistered) {
        RestApi.delSession().then(() => {
          store.commit('initAllSession')
          toast.success('ログアウトしました')
          router.replace('/')
        }).catch(() => {
          store.commit('initAllSession')
          toast.success('強制ログアウトしました')
          router.replace('/')
        })
      } else {
        toast.warning('セッションがありません')
        router.push('/')
      }
    })
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
