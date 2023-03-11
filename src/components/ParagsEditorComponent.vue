<!-- パラグラフの編集を束ねたコンポーネント -->

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
          title="説明文を入力できます"
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
    /** パラグラフの配列 */
    parags: {
      type: Object as PropType<ReviewParagraph[]>,
      required: true
    }
  },
  emits: {
    /**
     * パラグラフの配列が更新された際のイベント
     * @param v パラグラフの配列
     */
    'update:parags': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewParagraph[]) => true,
    /**
     * パラグラフのbodyが更新された際のイベント
     * @param v 更新内容
     * @param paragIndex パラグラフのインデックス
     */
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, paragIndex: number) => true,
    /**
     * パラグラフを追加する際のイベント
     * @param paragType パラグラフのタイプ
     * @param sectionIndex セクションのインデックス
     * @param paragIndex パラグラフのインデックス
     */
    addParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragType: ReviewParagraphType, sectionIndex: number, paragIndex: number) => true,
    /**
     * パラグラフを削除する際のイベント
     * @param paragIndex パラグラフのインデックス
     */
    delParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragIndex: number) => true,
    /**
     * フォーカスを取得した際のイベント
     * @param paragIndex パラグラフのインデックス
     */
    focusin: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragIndex: number) => true,
    /**
     * フォーカスを失った際のイベント
     * @param paragIndex パラグラフのインデックス
     */
    focusout: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragIndex: number) => true,
    /**
     * テキスト入力カーソルが移動した際のイベント
     * @param index パラグラフのインデックス
     */
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
