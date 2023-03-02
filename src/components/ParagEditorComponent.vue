<template>
  <auto-text-area
    v-if="parag.type === 'text'"
    :model-value="parag.body"
    @update:model-value="$emit('updateParagBody',$event)"
    :multi-lines="true"
    title="説明文"
    :no-outline="true"
    @focusin="$emit('focusin')"
    @focusout="$emit('focusout')"
    @move-cursor="$emit('moveCursor', $event)"
  />
  <image-selector
    v-else-if="parag.type === 'imageLink'"
    @update="$emit('updateParagBody', $event)"
    @update-cropped-url="$emit('updateParagBody', $event)"
  />
  <link-editor
    v-else-if="parag.type === 'serviceLink'"
    :model-value="parag.body"
    @update="$emit('updateParagBody', $event)"
  />
</template>

<script lang="ts">
import { ReviewParagraph } from '@/common/review'
import { defineComponent, PropType } from 'vue'
import AutoTextArea from '@/components/AutoTextArea.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import LinkEditor from '@/components/LinkEditor.vue'
import rules from '@/common/rules'

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
    focusout: () => true,
    moveCursor: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    return {
      rulesFunc: rules
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
