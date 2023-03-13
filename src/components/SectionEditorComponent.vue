<!-- セクションを編集するエディタコンポーネント -->

<template>
  <v-container class="ma-0 pa-0" fulid>
    <v-row>
      <v-col class="d-flex">
        <span v-if="title" style="width: 100%" class="text-title font-weight-bold" v-text="title">
        </span>
        <div style="text-align: end;">
          <v-icon class="mt-1 mr-1" @click="$emit('openHint')">mdi-help</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <editor-tools
          :floatingStyle="true"
          @add-object="addObject"
          @del-section="delSectionProxy"
          @submit="$emit('submit')"
          @preview="$emit('preview')"
          :allow-toggle="false"
          @toggle-pin="$emit('togglePin')"
          :hide-section="noSection"
        />
        <editor-tools
          :floatingStyle="false"
          @add-object="addObject"
          @del-section="delSectionProxy"
          @submit="$emit('submit')"
          @preview="$emit('preview')"
          :allow-toggle="false"
          @toggle-pin="$emit('togglePin')"
          :hide-section="noSection"
        />
      </v-col>
    </v-row>
    <v-row v-for="section, i of sections" :key="i">
      <v-col>
        <div class="bordered-box" :class="selSection === i ? 'bordered-box-focus' : 'bordered-box-no-focus'">
          <auto-text-area
            v-if="!noSection"
            :model-value="section.title"
            @update:model-value="(v) => $emit('updateSectionTitle', v, i)"
            class="font-weight-bold"
            :multi-lines="false"
            title="説明の見出しを入力できます"
            :no-outline="true"
            @focusin="() => focusinProxy(i, -1)"
            @focusout="() => focusoutProxy(i, -1)"
          />
          <v-divider v-if="!noSection"></v-divider>
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
import { ReviewParagraph, ReviewParagraphType, ReviewSection, reviewValidation, sectionValidation } from '@/common/review'
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
    /** セクション配列 */
    sections: {
      type: Object as PropType<ReviewSection[]>,
      required: true
    },
    /** パラグラフのみ編集可能にし、セクションの新規追加を禁止 */
    noSection: {
      type: Boolean,
      default: false
    },
    /** エディタに表示するタイトル */
    title: {
      type: String,
      default: ''
    }
  },
  emits: {
    /**
     * セクションを更新するイベント
     * @param v セクション
     * @param sectionIndex セクションのインデックス
     */
    updateSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewSection, sectionIndex: number) => true,
    /**
     * セクションのタイトルを更新するイベント
     * @param v タイトル
     * @param sectionIndex セクションのインデックス
     */
    updateSectionTitle: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, sectionIndex: number) => true,
    /**
     * パラグラフの配列が更新された際のイベント
     * @param v パラグラフの配列
     * @param sectionIndex セクションのインデックス
     */
    'update:parags': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewParagraph[], sectionIndex: number) => true,
    /**
     * パラグラフのbodyが更新された際のイベント
     * @param v 更新内容
     * @param sectionIndex セクションのインデックス
     * @param paragIndex パラグラフのインデックス
     */
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, sectionIndex: number, paragIndex: number) => true,
    /**
     * セクションを追加する際のイベント
     * @param sectionIndex セクションのインデックス
     */
    addSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number) => true, //, paragIndex: number
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
     * @param sectionIndex セクションのインデックス
     * @param paragIndex パラグラフのインデックス
     */
    delParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    /**
     * セクションが削除された際のイベント
     * @param sectionIndex セクションのインデックス
     */
    delSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number) => true,
    /**
     * フォーカスを取得した際のイベント
     * @param sectionIndex セクションのインデックス
     * @param paragIndex パラグラフのインデックス
     */
    focusin: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    /**
     * フォーカスを取得した際のイベント
     * @param sectionIndex セクションのインデックス
     * @param paragIndex パラグラフのインデックス
     */
    focusout: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    /** 送信ボタンが押された際のイベント */
    submit: () => true,
    /** プレビュー切り替えボタンが押された際のイベント */
    preview: () => true,
    /** ピンボタン(floatingStyleの切り替えボタン)が押された際のイベント */
    togglePin: () => true,
    /** ヒントボタンが押された際のイベント */
    openHint: () => true
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
          if (props.sections.length >= reviewValidation.sectionLenMax) {
            toast.info(`追加できるセクションは${reviewValidation.sectionLenMax}個までです`)
          } else if (selParag.value === -1) {
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
          if (props.sections[sectionIndex].parags.length >= sectionValidation.paragsLenMax - 1) {
            toast.info('説明文・画像・リンクが最大数になりました これ以上追加できません')
          } else if (selSection.value >= 0 && selParag.value >= 0 && target.type === 'text' && target.body.length > 0) {
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
