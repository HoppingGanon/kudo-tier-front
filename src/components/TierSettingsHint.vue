<!-- Tier作成・編集のhintを表示 -->

<template>
  <hint-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :page="page"
    @update:page="$emit('update:page', $event)"
    :enable-prev="page !== 0"
    :enable-next="page !== 3"
  >
    <template v-slot:default="{ close }">
      <hint-card :title="title" sub-title="名前をつけましょう" @close="close">
        <template v-slot:image>
          <v-img src="/hint/tier-settings/header.png" />
        </template>
        <template v-slot:text>
          <span class="font-weight-bold">Tier名</span><br />
          短くて分かりやすいTierの名称をつけましょう。<br /><br />
          <span class="font-weight-bold">画像を開く</span><br />
          Tierのトップに表示する画像を指定できます。<br />
        </template>
      </hint-card>
      <hint-card :title="title" sub-title="評価項目の設定" @close="close">
        <template v-slot:image>
          <v-img src="/hint/tier-settings/params.png" />
        </template>
        <template v-slot:text>
          ここに設定した項目がレビューを作成する際に評価基準となります。<br /><br />

          <span class="font-weight-bold">並び替えつまみ</span><br />
          ドラッグすると、並び替えが可能です。<br /><br />

          <span class="font-weight-bold">評価の項目名</span><br />
          評価の名前として、短い文を設定できます。<br /><br />

          <span class="font-weight-bold">削除ボタン</span><br />
          ドラッグすると、並び替えが可能です。<br /><br />

          <span class="font-weight-bold">アイテム追加</span><br />
          評価項目を最大<span v-text="tierValidation.paramsLenMax"></span>個まで追加できます<br />

        </template>
      </hint-card>
      <hint-card :title="title" sub-title="説明文を追加しましょう" @close="close">
        <template v-slot:image>
          <v-img src="/hint/tier-settings/parag.png" />
        </template>
        <template v-slot:text>
          <v-icon>mdi-image-outline</v-icon>
          <span class="font-weight-bold">画像の追加</span><br />
          画面上部や説明セクションにある「<v-icon>mdi-image-outline</v-icon>」ボタンを押すと、説明セクションに画像を追加できます。<br /><br />

          <v-icon>mdi-link</v-icon>
          <span class="font-weight-bold">リンクの追加</span><br />
          画面上部や説明セクションにある「<v-icon>mdi-link</v-icon>」ボタンを押すと、説明セクションにリンクを追加できます。<br />
          <br />
          <br />
          説明文は合計<span v-text="sectionValidation.paragTextLenMax"></span>文字の説明文を書くことができます。<br />
        </template>
      </hint-card>
      <hint-card :title="title" sub-title="プレビューと作成" @close="close">
        <template v-slot:image>
          <v-img src="/hint/review-settings/preview.png" />
        </template>
        <template v-slot:text>
          <v-icon>mdi-swap-horizontal</v-icon>
          <span class="font-weight-bold">プレビュー切り替え</span><br />
          画面上部の「プレビュー」ボタンや「<v-icon>mdi-swap-horizontal</v-icon>」ボタンを押すと、プレビュー画面を表示できます。<br />
          <v-icon>mdi-send</v-icon>
          <span class="font-weight-bold">送信</span><br />
          見た目が確認出来たら、「作成」ボタンや「<v-icon>mdi-send</v-icon>」ボタンを押してレビューを投稿しましょう。
        </template>
      </hint-card>
    </template>
  </hint-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import HintDialog from '@/components/HintDialog.vue'
import HintCard from '@/components/HintCard.vue'
import { tierValidation, sectionValidation } from '@/common/review'

export default defineComponent({
  name: 'TierSettingsHint',
  components: {
    HintDialog,
    HintCard
  },
  props: {
    /** ダイアログが開いてる状態かどうか */
    modelValue: {
      type: Boolean,
      required: true
    },
    /** ページ番号 */
    page: {
      type: Number,
      required: true
    },
    /** 初期ページ番号 */
    title: {
      type: String,
      default: ''
    }
  },
  emits: {
    /**
     * ダイアログの開閉操作が行われた際のイベント
     * @param v ダイアログの状態
     */
    'update:model-value': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true,
    /**
     * ページが変化した際のイベント
     * @param v ページ番号
     */
    'update:page': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: number) => true
  },
  setup () {
    return {
      dummyPage: ref<number | undefined>(undefined),
      sectionValidation,
      tierValidation
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.outlined {
  border: 1px solid gray;
}
</style>
