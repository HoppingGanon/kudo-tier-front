<!-- 利用規約を表示するコンポーネント -->

<template>
  <v-btn class="body-1" flat @click="() => { dialog = true }">
    利用規約を読む
  </v-btn>

  <simple-dialog
    v-model="dialog"
    title="利用規約"
    :show-submit-button="false"
    :fullscreen="true"
    width="100%"
  >
    <term-of-servise-content />
  </simple-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import TermOfServiseContent from '@/components/TermOfServiseContent.vue'

export default defineComponent({
  name: 'TermOfServise',
  components: {
    SimpleDialog,
    TermOfServiseContent
  },
  setup () {
    return {
      dialog: ref(false)
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
