<template>
  <v-container class="ma-0 pa-0" fulid>
    <v-row>
      <v-col>
        <editor-tools
          :floatingStyle="$vuetify.display.mobile"
          @add-object="addObject"
          @del-section="delSectionProxy"
        />
      </v-col>
    </v-row>
    <v-row v-for="section, i of sections" :key="i">
      <v-col>
        <div class="bordered-box" :class="selSection === i ? 'bordered-box-focus' : 'bordered-box-no-focus'">
          <auto-text-area
            :model-value="section.title"
            @update:model-value="(v) => $emit('updateSectionTitle', v, i)"
            class="font-weight-bold"
            :multi-lines="false"
            title="説明の見出しを入力できます"
            :no-outline="true"
            @focusin="() => focusinProxy(i, -1)"
            @focusout="() => focusoutProxy(i, -1)"
          />
          <v-divider></v-divider>
          <parags-editor-component
            :parags="section.parags"
            @update:parags="(v) => $emit('update:parags', v, i)"
            @update-parag-body="(v, j) => $emit('updateParagBody', v, i, j)"
            @add-parag="(v, j) => $emit('updateParagBody', v, i, j)"
            @del-parag="(j) => $emit('delParag', i, j)"
            @focusin="(j) => focusinProxy(i, j)"
            @focusout="(j) => focusoutProxy(i, j)"
            @move-cursor="moveCursor"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewParagraph, ReviewParagraphType, ReviewSection } from '@/common/review'
import { defineComponent, PropType, ref } from 'vue'
import ParagsEditorComponent from '@/components/ParagsEditorComponent.vue'
import AutoTextArea from '@/components/AutoTextArea.vue'
import EditorTools from '@/components/EditorTools.vue'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'SectionEditorComponent',
  components: {
    ParagsEditorComponent,
    AutoTextArea,
    EditorTools
  },
  props: {
    sections: {
      type: Object as PropType<ReviewSection[]>,
      required: true
    }
  },
  emits: {
    updateSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewSection, sectionIndex: number) => true,
    updateSectionTitle: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, sectionIndex: number) => true,
    'update:parags': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewParagraph[], sectionIndex: number) => true,
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, sectionIndex: number, paragIndex: number) => true,
    addSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number) => true, //, paragIndex: number
    addParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragType: ReviewParagraphType, sectionIndex: number, paragIndex: number) => true,
    delParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    delSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number) => true,
    focusin: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    focusout: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true
  },
  setup (props, { emit }) {
    const toast = useToast()
    const selSection = ref(-1)
    const selParag = ref(-1)
    const cursorIndex = ref(0)
    const focusinProxy = (sectionIndex: number, paragIndex: number) => {
      selSection.value = sectionIndex
      selParag.value = paragIndex
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const focusoutProxy = (sectionIndex: number, paragIndex: number) => {
      // selSection.value = -1
      // selParag.value = -1
    }

    const addObject = (pType: ReviewParagraphType | 'section') => {
      let sectionIndex = -1
      let paragIndex = -1
      let target: ReviewParagraph
      let targetBody1: string
      let targetBody2: string
      switch (pType) {
        case 'section':
          // セクション追加
          if (selParag.value === -1) {
            sectionIndex = Math.max(selSection.value, 0)
            emit('addSection', sectionIndex)
          } else {
            sectionIndex = Math.min(props.sections.length, selSection.value + 1)
            emit('addSection', sectionIndex)
          }
          break
        default:
          // Parag追加
          if (props.sections.length === 0) {
            // セクションがなければ追加
            emit('addSection', 0)
          }
          sectionIndex = selSection.value < 0 ? 0 : selSection.value
          paragIndex = selParag.value < 0 ? 0 : selParag.value

          target = props.sections[sectionIndex].parags[paragIndex]
          if (selSection.value >= 0 && selParag.value >= 0 && target.type === 'text' && target.body.length > 0) {
            // Parag選択状態かつテキストタイプで1文字以上の入力がある場合
            if (cursorIndex.value === target.body.length) {
              // カーソルが末尾を指してる場合
              targetBody1 = target.body
              targetBody2 = ''
            } else if (cursorIndex.value >= 0 && cursorIndex.value < target.body.length) {
              // カーソルが末尾以外を指してる場合
              targetBody1 = target.body.substring(0, cursorIndex.value)
              targetBody2 = target.body.substring(cursorIndex.value, target.body.length)
            } else {
              // カーソルが場所を指していない場合
              targetBody1 = ''
              targetBody2 = target.body
            }

            // 文字列を分割しつつ、Parag追加
            emit('updateParagBody', targetBody2, selSection.value, selParag.value)
            emit('addParag', pType, sectionIndex, paragIndex)
            emit('addParag', 'text', sectionIndex, paragIndex)
            emit('updateParagBody', targetBody1, selSection.value, selParag.value)
          } else {
            // それ以外の場合
            // Parag追加
            emit('addParag', pType, sectionIndex, paragIndex)
            emit('addParag', 'text', sectionIndex, paragIndex)
          }
          break
      }
    }

    const delSectionProxy = () => {
      if (selSection.value !== -1) {
        emit('delSection', selSection.value)
        toast.info('セクションを削除しました')
        selSection.value = selSection.value - 1
      } else {
        toast.info('セクションが選択されていません')
      }
    }

    const moveCursor = (index: number) => {
      cursorIndex.value = index
    }

    return {
      selSection,
      selParag,
      focusinProxy,
      focusoutProxy,
      addObject,
      delSectionProxy,
      moveCursor
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.bordered-box {
  outline: none;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  padding: 4px;
  transition: all 0.25s;
}
.bordered-box-focus {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-thirdry));
}
.bordered-box-no-focus {
  border-color: #CCC;
  background-color: white;
}

</style>
