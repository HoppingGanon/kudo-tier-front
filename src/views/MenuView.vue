<template>
  <div class="home">

    <!-- セッション有効期限をチェックする -->
    <session-checker :is-going="true"/>

    <ReviewTable msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReviewTable from '@/components/ReviewTable.vue' // @ is an alias to /src
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'MenuView',
  components: {
    ReviewTable,
    SessionChecker
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>
