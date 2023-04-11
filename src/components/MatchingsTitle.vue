<!-- 新規にコンポーネントを追加する際のテンプレート -->

<template>
  <div>
    Title
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MatchingsTitle',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    orgTierName: {
      type: String,
      default: ''
    },
    orgTierId: {
      type: String,
      default: ''
    }
  },
  emits: {},
  setup () {
    return {}
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
