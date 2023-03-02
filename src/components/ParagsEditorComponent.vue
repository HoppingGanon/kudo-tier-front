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
          @clear="() => clear(i)"
          :title="parags.length === 1 && i === 0 ? '説明文を入力してください' : ''"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewParagraph, ReviewParagraphType } from '@/common/review'
import { computed, defineComponent, PropType } from 'vue'
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
      paragIndex: number) => true,
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
  setup (props, { emit }) {
    const clear = (paragIndex: number) => {
      if (props.parags.length > 2 &&
        paragIndex > 0 && paragIndex < props.parags.length - 1 &&
        props.parags[paragIndex - 1].type === 'text' && props.parags[paragIndex + 1].type === 'text'
      ) {
        const body = props.parags[paragIndex - 1].body + '\n' + props.parags[paragIndex + 1].body
        emit('delParag', paragIndex - 1)
        emit('delParag', paragIndex - 1)
        emit('updateParagBody', body, paragIndex - 1)
      } else {
        emit('delParag', paragIndex)
      }
    }

    return {
      clear
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
