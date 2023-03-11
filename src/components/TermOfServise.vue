<!-- 利用規約を表示するコンポーネント -->

<template>
  <v-btn class="body-1" flat @click="() => { dialog = true }">
    利用規約を読む
  </v-btn>

  <simple-dialog
    v-model="dialog"
    title="利用規約"
    :show-submit-button="false"
    :fullscreen="$vuetify.display.smAndDown"
    width="100%"
  >
    <iframe :src="url" style="width: 100%; height: 60vh"></iframe>
  </simple-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SimpleDialog from '@/components/SimpleDialog.vue'

export default defineComponent({
  name: 'TermOfServise',
  components: {
    SimpleDialog
  },
  setup () {
    return {
      dialog: ref(false),
      url: `${process.env.VUE_APP_BASE_URI}/terms/service.html`
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
