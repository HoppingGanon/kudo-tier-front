<template>
  <hint-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)" :page="page" @update:page="$emit('update:page', $event)" >
    <hint-card title="レビューを作成しましょう" sub-title="名前をつけましょう">
      <template v-slot:image>
        <v-img src="@/assets/hint/review-settings/header.png" />
      </template>
      <template v-slot:text>
        <span class="font-weight-bold">レビュー名</span><br />
        あらゆる場面で表示される名前です。何についての評価なのかを判断できる短い名前を指定してください。<br />
        <span class="font-weight-bold">レビュータイトル</span><br />
        評価を要約した文章です。一目でどんなレビューを書いたのかわかる短い文章を設定しましょう。<br />
        <span class="font-weight-bold">画像</span><br />
        どんなものをレビューしているのか、視覚的に分かるように画像が設定できます。<br /><br />

        <div class="text-center">
          <v-img class="mt-3 mb-3" src="@/assets/hint/chart.png" height="200px"></v-img>
          レビューの表示例
        </div>
      </template>
    </hint-card>
    <hint-card title="レビューを作成しましょう" sub-title="評点の設定">
      <template v-slot:image>
        <v-img src="@/assets/hint/review-settings/point.png" />
      </template>
      <template v-slot:text>
        <span class="font-weight-bold">評点の設定</span><br />
        ここにはTierで設定した評価項目が並んでいます。左右にスライドバーを動かすことで評価を変更できるほか、総合ランクが自動で計算されます。

        <div class="text-center">
          <v-img class="mt-3 mb-3" src="@/assets/hint/chart.png" height="200px"></v-img>
          レビューの表示例
        </div>
      </template>
    </hint-card>
    <hint-card title="レビューを作成しましょう" sub-title="説明文を追加しましょう">
      <template v-slot:image>
        <v-img src="@/assets/hint/review-settings/section.png" />
      </template>
      <template v-slot:text>
        <v-icon>mdi-image-outline</v-icon>
        <span class="font-weight-bold">画像の追加</span><br />
        画面上部や説明セクションにある「<v-icon>mdi-image-outline</v-icon>」ボタンを押すと、説明セクションに画像を追加できます。<br />

        <v-icon>mdi-link</v-icon>
        <span class="font-weight-bold">リンクの追加</span><br />
        画面上部や説明セクションにある「<v-icon>mdi-link</v-icon>」ボタンを押すと、説明セクションにリンクを追加できます。<br />

        <v-icon>mdi-text-box-plus-outline</v-icon>
        <span class="font-weight-bold">セクションの追加</span><br />
        画面上部や説明セクションにある「<v-icon>mdi-text-box-plus-outline</v-icon>」ボタンを押すと、説明セクションを追加できます。<br />

        <v-icon>mdi-text-box-remove-outline</v-icon>
        <span class="font-weight-bold">セクションの削除</span><br />
        画面上部や説明セクションにある「<v-icon>mdi-text-box-remove-outline</v-icon>」ボタンを押すと、説明セクションを削除できます。<br />

        <br />
        一つのセクション当たり、最大<span v-text="sectionValidation.paragTextLenMax"></span>文字の説明文を書くことができます。<br />
        セクションは最大<span v-text="reviewValidation.sectionLenMax"></span>個まで追加できます。
      </template>
    </hint-card>
    <hint-card title="レビューを作成しましょう" sub-title="プレビュー機能で確認しましょう">
      <template v-slot:image>
        <v-img src="@/assets/hint/review-settings/preview.png" />
      </template>
      <template v-slot:text>
        <v-icon>mdi-swap-horizontal</v-icon>
        <span class="font-weight-bold">プレビュー切り替え</span><br />
        画面上部の「プレビュー」ボタンや「<v-icon>mdi-swap-horizontal</v-icon>」ボタンを押すと、プレビュー画面を表示できます。<br />
        <v-icon>mdi-send</v-icon>
        <span class="font-weight-bold">送信</span><br />
        見た目が確認出来たら、「送信」ボタンや「<v-icon>mdi-send</v-icon>」ボタンを押してレビューを投稿しましょう。
      </template>
    </hint-card>
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
    modelValue: {
      type: Boolean,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  },
  emits: {
    'update:model-value': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true,
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