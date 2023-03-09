<template>
  <v-carousel-item>
    <v-card width="80%" height="100%" class="centering">
      <v-toolbar color="secondary">
        <v-card-title v-if="title" v-text="title" />
      </v-toolbar>
      <slot></slot>
    </v-card>
  </v-carousel-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HintCard',
  props: {
    title: {
      type: String
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.centering {
  margin: 0 auto;
}
</style>
