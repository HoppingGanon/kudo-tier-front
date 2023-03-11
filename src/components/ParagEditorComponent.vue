<!-- パラグラフを編集するコンポーネント -->

<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <v-col v-if="parag.type === 'text'">
        <auto-text-area
          :model-value="parag.body"
          @update:model-value="$emit('updateParagBody',$event)"
          :multi-lines="true"
          :title="title"
          :no-outline="true"
          @focusin="$emit('focusin')"
          @focusout="$emit('focusout')"
          @move-cursor="$emit('moveCursor', $event)"
          :style="'min-height: 100px;'"
        />
      </v-col>
      <v-col v-else-if="parag.type === 'imageLink'" cols="8" sm="6" md="5" lg="4" xl="3">
        <image-selector
          :cropped-url="parag.body"
          @update-cropped-url="$emit('updateParagBody', $event)"
          img-max-height="320px"
          @clear="$emit('clear')"
          :show-remove-always="true"
        />
      </v-col>
      <v-col v-else-if="parag.type === 'serviceLink'">
        <link-editor
          :model-value="parag.body"
          @update="$emit('updateParagBody', $event)"
          @clear="$emit('clear')"
          :rules="rules"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewParagraph, sectionValidation } from '@/common/review'
import { computed, defineComponent, PropType } from 'vue'
import AutoTextArea from '@/components/AutoTextArea.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import LinkEditor from '@/components/LinkEditor.vue'
import ruleFunc from '@/common/rules'

export default defineComponent({
  name: 'ParagEditorComponent',
  components: {
    AutoTextArea,
    ImageSelector,
    LinkEditor
  },
  props: {
    /** パラグラフ */
    parag: {
      type: Object as PropType<ReviewParagraph>,
      required: true
    },
    /** パラグラフのタイプが'text'に渡すタイトル */
    title: {
      type: String,
      default: ''
    }
  },
  emits: {
    /**
     * パラグラフのbodyが更新された際のイベント
     * @param v 更新内容
     */
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    /** フォーカスを取得した際のイベント */
    focusin: () => true,
    /** フォーカスを失った際のイベント */
    focusout: () => true,
    /**
     * テキスト入力カーソルが移動した際のイベント
     * @param カーソル位置
     */
    moveCursor: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true,
    /** クリア後に呼ばれる処理 */
    clear: () => true
  },
  setup () {
    return {
      rules: computed(() => [ruleFunc.maxLen(sectionValidation.paragLinkLenMax)])
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
