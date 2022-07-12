<template>
  <v-card width="100%" height="720px">
    <v-card-title>
      エラー
    </v-card-title>
    <div class="ma-3">
      {{ comment }}
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorCard',
  props: {
    comment: {
      type: String,
      default: ''
    }
  }
})
</script>
