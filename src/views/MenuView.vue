<template>
  <div class="home">

    <!-- セッション有効期限をチェックする -->
    <session-checker :is-going="true"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'MenuView',
  components: {
    SessionChecker
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>
