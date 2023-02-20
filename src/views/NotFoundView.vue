<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <error-component title="ページが見つかりません" comment="URLが間違っていないかご確認ください" />
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
