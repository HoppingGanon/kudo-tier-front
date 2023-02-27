<template>
  <v-divider class="ma-5"></v-divider>
  <v-footer
    class="text-center d-flex flex-column"
  >
    <div>
      <span v-text="buildDate"></span> <span class="font-weight-bold">TierReviews</span> version <span v-text="version"></span><br />
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
        href="https://github.com/HoppingGanon"
      ></v-btn>
    </div>
    <div>
      <term-of-servise />
    </div>
  </v-footer>
</template>

<script lang="ts">
import { buildDate, myName, version } from '@/common/names'
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
      buildDate
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
