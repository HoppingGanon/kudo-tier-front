<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <error-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'NotFoundView',
  components: {
    ErrorComponent,
    SessionChecker
  }
})
</script>
