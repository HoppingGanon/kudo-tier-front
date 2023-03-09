<template>
  <hint-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
    <hint-card title="レビューの作成/編集">
      <v-img src="@/assets/hint/review-settings/header.png" />
    </hint-card>
    <hint-card title="レビューの作成/編集">

    </hint-card>
  </hint-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import HintDialog from '@/components/HintDialog.vue'
import HintCard from '@/components/HintCard.vue'

export default defineComponent({
  name: 'ReviewSettingsHint',
  components: {
    HintDialog,
    HintCard
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:model-value': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true
  },
  setup () {
    return {
      dummyPage: ref<number | undefined>(undefined)
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
