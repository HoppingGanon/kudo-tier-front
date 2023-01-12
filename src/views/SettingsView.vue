<template>
  <session-checker :is-going="true" :no-session-error="true" />
  <v-container>
    <v-card>
      <v-toolbar color="secondary">
        <v-card-title class="font-weight-bold">
          ユーザー設定
        </v-card-title>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'SettingsView',
  components: {
    SessionChecker
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
