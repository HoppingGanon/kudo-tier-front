<!-- エラー表示のコンポーネント -->

<template>
  <v-card-title>
    エラー
  </v-card-title>
  <div class="ma-3">
    {{ comment }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorComponent',
  props: {
    /** 追加で表示するコメント */
    comment: {
      type: String,
      default: ''
    }
  }
})
</script>
