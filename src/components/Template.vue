<!-- 新規にコンポーネントを追加する際のテンプレート -->

<template>
  <div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TemplateView',
  components: {},
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
