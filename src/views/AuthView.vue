<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import restApi, { } from '@/common/restapi'

export default defineComponent({
  name: 'AuthView',
  setup () {
    // const authLink = computed(() => {
    const route = useRoute()
    const code = route.query.code as string
    const store = useStore()

    alert(store.state.tempSessionId)
    restApi.getSession(code, store.state.tempSessionId).then((response) => {
      alert(response.data.jwt)
    }).catch((err) => {
      console.log(err)
    })
  }
})
</script>
