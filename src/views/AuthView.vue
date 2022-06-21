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

    restApi.getSession(code, store.state.tempSessionId).then((response) => {
      console.log(response.data)
    }).catch((err) => {
      console.log(err)
    })
  }
})
</script>
