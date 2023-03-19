<!-- ページの下部に必ず表示するフッターのコンポーネント -->

<template>
  <v-divider class="ma-5"></v-divider>
  <v-footer
    class="text-center d-flex flex-column"
  >
    <div>
      <span v-text="buildDate"></span> <span class="font-weight-bold" v-text="appName"></span> version <span v-text="version"></span><br />
      built by <span v-text="myName"></span>
    </div>
    <div>
      <v-btn
        class="mx-4"
        icon="mdi-twitter"
        variant="text"
        href="https://twitter.com/hoppingganonapp"
      ></v-btn>
      <v-btn
        class="mx-4"
        icon="mdi-github"
        variant="text"
        href="https://github.com/HoppingGanon/kudo-tier-front"
      ></v-btn>
    </div>
    <div class="d-flex">
      <term-of-servise />
      <v-btn flat to="/about">このサイトについて</v-btn>
    </div>
  </v-footer>
</template>

<script lang="ts">
import { buildDate, myName, version, appName } from '@/common/names'
import { defineComponent } from 'vue'
import TermOfServise from '@/components/TermOfServise.vue'

export default defineComponent({
  name: 'FooterComponent',
  components: {
    TermOfServise
  },
  setup () {
    return {
      myName,
      version,
      buildDate,
      appName
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
