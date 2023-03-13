<!-- セクションやパラグラフの編集に使用するツールバーのコンポーネント -->

<template>
  <v-card class="anime" :flat="!floatingStyle" :class="floatingStyle ? 'floating-style' : 'fixed-style'">
    <div class="d-flex" :class="floatingStyle ? 'pt-5' : ''" mb-2>

      <!-- 画像追加ボタン -->
      <v-btn v-if="!hideParag" icon flat @click="$emit('addObject', 'imageLink')">
        <v-icon>
          mdi-image-outline
        </v-icon>
      </v-btn>

      <!-- リンク追加ボタン -->
      <v-btn v-if="!hideParag" icon flat @click="$emit('addObject', 'serviceLink')">
        <v-icon>
          mdi-link
        </v-icon>
      </v-btn>

      <!-- セクション追加ボタン -->
      <v-btn v-if="!hideSection" icon flat @click="$emit('addObject', 'section')">
        <v-icon>
        mdi-text-box-plus-outline
        </v-icon>
      </v-btn>
      <v-menu v-if="!hideSection" :location="floatingStyle ? 'top center' : 'bottom center'">
        <template v-slot:activator="{ props }">
          <!-- セクション追加ボタン -->
          <v-btn icon flat v-bind="props">
            <v-icon>
            mdi-text-box-remove-outline
            </v-icon>
          </v-btn>
        </template>
        <v-card flat class="pa-2 text-center" color="#000A" style="color: white;">
          選択中のセクションを削除しますか？<br />
          <v-btn @click="$emit('delSection')" flat color="primary">削除</v-btn>
        </v-card>
      </v-menu>

      <div class="d-flex justify-end" style="width: 100%;">
        <!-- ピンボタン(floatingStyleの切り替えボタン) -->
        <v-btn v-if="allowToggle" icon flat @click="$emit('togglePin')">
          <v-icon v-show="floatingStyle">
            mdi-pin-off
          </v-icon>
          <v-icon v-show="!floatingStyle">
            mdi-pin
          </v-icon>
        </v-btn>

        <!-- プレビュー切り替えボタン -->
        <v-btn icon flat @click="$emit('preview')">
          <v-icon>
            mdi-swap-horizontal
          </v-icon>
        </v-btn>

        <!-- 送信ボタン -->
        <v-btn icon flat @click="$emit('submit')">
          <v-icon>
            mdi-send
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { ReviewParagraphType } from '@/common/review'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditorTools',
  props: {
    /** 絶対位置で画面上部に配置される */
    floatingStyle: {
      type: Boolean,
      default: false
    },
    /** セクションのツールを隠す */
    hideSection: {
      type: Boolean,
      default: false
    },
    /** パラグラフのツールを隠す */
    hideParag: {
      type: Boolean,
      default: false
    },
    /** ピンボタン(floatingStyleの切り替えボタン)を表示する */
    allowToggle: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    /**
     * セクション/パラグラフを追加するイベント
     * @param pType 追加対象のタイプ
     */
    addObject: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      pType: ReviewParagraphType | 'section'
    ) => true,
    /** 送信ボタンが押された際のイベント */
    submit: () => true,
    /** プレビュー切り替えボタンが押された際のイベント */
    preview: () => true,
    /** セクション削除ボタンが押された際のイベント */
    delSection: () => true,
    /** ピンボタン(floatingStyleの切り替えボタン)が押された際のイベント */
    togglePin: () => true
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.anime {
  transition: all 0.25s;
}

.floating-style {
  width: 100%;
  position: fixed;
  top: 50px;
  left: 0px;
  z-index: 1;
}

.fixed-style {
  width: 100%;
  position: sticky;
  top: 0px;
  left: 0px;
}
</style>
