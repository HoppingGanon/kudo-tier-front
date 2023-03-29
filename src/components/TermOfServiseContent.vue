<!-- 利用規約の本文を表示するコンポーネント -->

<template>
  <div v-html="source" class="pa-5">
  </div>
  <loading-component :is-loading="source === ''" title="利用規約を読み込んでいます..." />
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

export default defineComponent({
  name: 'TermOfServiseContent',
  components: {
    LoadingComponent
  },
  setup () {
    const source = ref('')
    axios.get(`${process.env.VUE_APP_BASE_URI}/terms/service.html`).then((res) => {
      source.value = res.data
    }).catch(() => {
      source.value = '利用規約の読み込みに失敗しました'
    })
    return {
      source
    }
  }
})
</script>
