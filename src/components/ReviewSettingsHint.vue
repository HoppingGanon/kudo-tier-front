<!-- レビュー作成・編集のhintを表示 -->

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
          <v-img src="/hint/review-settings/header.png" />
        </template>
        <template v-slot:text>
          <span class="font-weight-bold">レビュー名</span><br />
          あらゆる場面で表示される名前です。何についての評価なのかを判断できる短い名前を指定してください。<br /><br />
          <span class="font-weight-bold">レビュータイトル</span><br />
          評価を要約した文章です。一目でどんなレビューを書いたのかわかる短い文章を設定しましょう。<br /><br />
          <span class="font-weight-bold">画像を開く</span><br />
          レビューにアイコンを指定できます。<br /><br />
        </template>
      </hint-card>
      <hint-card :title="title" sub-title="評点の設定" @close="close">
        <template v-slot:image>
          <v-img src="/hint/review-settings/point.png" />
        </template>
        <template v-slot:text>
          <span class="font-weight-bold">評点の設定</span><br />
          ここにはTierで設定した評価項目が並んでいます。左右にスライドバーを動かすことで評価を変更できるほか、総合ランクが自動で計算されます。
        </template>
      </hint-card>
      <hint-card :title="title" sub-title="説明文を追加しましょう" @close="close">
        <template v-slot:image>
          <v-img src="/hint/review-settings/section.png" />
        </template>
        <template v-slot:text>
          <v-icon>mdi-image-outline</v-icon>
          <span class="font-weight-bold">画像の追加</span><br />
          画面上部や説明セクションにある「<v-icon>mdi-image-outline</v-icon>」ボタンを押すと、説明セクションに画像を追加できます。<br /><br />

          <v-icon>mdi-link</v-icon>
          <span class="font-weight-bold">リンクの追加</span><br />
          画面上部や説明セクションにある「<v-icon>mdi-link</v-icon>」ボタンを押すと、説明セクションにリンクを追加できます。<br /><br />

          <v-icon>mdi-text-box-plus-outline</v-icon>
          <span class="font-weight-bold">セクションの追加</span><br />
          画面上部や説明セクションにある「<v-icon>mdi-text-box-plus-outline</v-icon>」ボタンを押すと、説明セクションを追加できます。<br /><br />

          <v-icon>mdi-text-box-remove-outline</v-icon>
          <span class="font-weight-bold">セクションの削除</span><br />
          画面上部や説明セクションにある「<v-icon>mdi-text-box-remove-outline</v-icon>」ボタンを押すと、説明セクションを削除できます。<br /><br />

          <br />
          一つのセクション当たり、最大<span v-text="sectionValidation.paragTextLenMax"></span>文字の説明文を書くことができます。<br />
          セクションは最大<span v-text="reviewValidation.sectionLenMax"></span>個まで追加できます。
        </template>
      </hint-card>
      <hint-card :title="title" sub-title="プレビューと作成" @close="close">
        <template v-slot:image>
          <v-img src="/hint/review-settings/preview.png" />
        </template>
        <template v-slot:text>
          <v-icon>mdi-swap-horizontal</v-icon>
          <span class="font-weight-bold">プレビュー切り替え</span><br />
          画面上部の「プレビュー」ボタンか「<v-icon>mdi-swap-horizontal</v-icon>」ボタンを押すと、プレビュー画面を表示できます。<br /><br />
          <v-icon>mdi-send</v-icon>
          <span class="font-weight-bold">送信</span><br />
          見た目が確認出来たら、「作成」ボタンか「<v-icon>mdi-send</v-icon>」ボタンを押してレビューを投稿しましょう。
        </template>
      </hint-card>
    </template>
  </hint-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import HintDialog from '@/components/HintDialog.vue'
import HintCard from '@/components/HintCard.vue'
import { reviewValidation, sectionValidation } from '@/common/review'

export default defineComponent({
  name: 'ReviewSettingsHint',
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
      reviewValidation
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
