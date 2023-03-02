<template>
  <v-container :class="$vuetify.display.mobile ? 'pl-3 pt-0 pb-0 pr-0 ma-0' : 'pl-5 pt-0 pb-0 pr-0 ma-0'" fulid>
    <v-row v-for="p, i of parags" :key="i">
      <v-col>
        <parag-editor-component
          :parag="p"
          @update-parag-body="$emit('updateParagBody',$event, i)"
          @focusin="$emit('focusin', i)"
          @focusout="$emit('focusout', i)"
          @move-cursor="$emit('moveCursor', $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewParagraph, ReviewParagraphType } from '@/common/review'
import { defineComponent, PropType } from 'vue'
import ParagEditorComponent from '@/components/ParagEditorComponent.vue'

export default defineComponent({
  name: 'ParagsEditorComponent',
  components: {
    ParagEditorComponent
  },
  props: {
    parags: {
      type: Object as PropType<ReviewParagraph[]>,
      required: true
    }
  },
  emits: {
    'update:parags': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewParagraph[]) => true,
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, paragIndex: number) => true,
    addParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragType: ReviewParagraphType, sectionIndex: number, paragIndex: number) => true,
    delParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    focusin: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragIndex: number) => true,
    focusout: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragIndex: number) => true,
    moveCursor: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
