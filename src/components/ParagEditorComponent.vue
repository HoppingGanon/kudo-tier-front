<template>
  <auto-text-area
    v-if="parag.type === 'text'"
    :model-value="parag.body"
    @update:model-value="$emit('updateParagBody',$event)"
    :multi-lines="true"
    title="説明の本文"
    :no-outline="true"
    @focusin="$emit('focusin')"
    @focusout="$emit('focusout')"
  />
  <image-selector
    v-else-if="parag.type === 'imageLink'"
  />
  <link-editor
    v-else-if="parag.type === 'serviceLink'"
  />
</template>

<script lang="ts">
import { ReviewParagraph } from '@/common/review'
import { defineComponent, PropType } from 'vue'
import AutoTextArea from '@/components/AutoTextArea.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import LinkEditor from '@/components/LinkEditor.vue'

export default defineComponent({
  name: 'ParagEditorComponent',
  components: {
    AutoTextArea,
    ImageSelector,
    LinkEditor
  },
  props: {
    parag: {
      type: Object as PropType<ReviewParagraph>,
      required: true
    }
  },
  emits: {
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    focusin: () => true,
    focusout: () => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
