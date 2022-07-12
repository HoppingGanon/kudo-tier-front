<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <error-card />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorCard from '@/components/ErrorCard.vue'
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'NotFoundView',
  components: {
    ErrorCard,
    SessionChecker
  },
  props: {
    comment: {
      type: String,
      default: ''
    }
  }
})
</script>
