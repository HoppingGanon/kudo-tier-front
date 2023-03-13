<!-- タイトル付きのダイアログカードが表示ができるコンポーネント -->

<template>
  <v-dialog :persistent="persistent" :model-value="modelValue" @update:model-value="setValue" :fullscreen="fullscreen">
    <v-container :fluid="fullscreen" :class="fullscreen ? 'ma-0 pa-0' : ''">
      <v-card :width="width" :height="height">
        <v-toolbar v-if="title !== undefined" color="secondary" class="font-weight-bold">
          <v-card-title v-text="title" />
          <div style="width: 100%" class="d-flex flex-row-reverse">
            <v-btn v-if="showTopCloseButton" @click="closeProxy" flat icon><v-icon> mdi-close </v-icon></v-btn>
          </div>
        </v-toolbar>
        <div class="ma-3">
          <slot name="prepend" >
            <p v-if="prependText !== undefined" v-text="prependText" />
          </slot>
          <v-img v-if="prependImageSrc !== undefined" :src="prependImageSrc" />
          <slot>
            <p v-if="text !== undefined" v-text="text" />
          </slot>
          <v-img v-if="appendImageSrc !== undefined" :src="appendImageSrc" />
          <slot name="append" >
            <p v-if="appendText !== undefined" v-text="appendText" />
          </slot>
        </div>
        <v-card-actions class="d-flex flex-row-reverse">
          <slot name="submit-button">
            <v-btn v-if="showSubmitButton" v-text="submitButtonText" @click="submitProxy" />
          </slot>
          <slot name="close-button">
            <v-btn v-if="showCloseButton" v-text="closeButtonText" @click="closeProxy" />
          </slot>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SimpleDialog',
  components: { },
  props: {
    /** ダイアログの表示状態 */
    modelValue: {
      type: Boolean,
      required: true
    },
    /** カードのタイトル */
    title: {
      type: String
    },
    /** カードの幅 */
    width: {
      type: String
    },
    /** カードの高さ */
    height: {
      type: String
    },
    /** 本文の前に付加するテキスト */
    prependText: {
      type: String
    },
    /** 本文の前に付加する画像 */
    prependImageSrc: {
      type: String
    },
    /** 本文 */
    text: {
      type: String
    },
    /** 画像 */
    appendImageSrc: {
      type: String
    },
    /** 本文の後に付加するテキスト */
    appendText: {
      type: String
    },
    /** ダイアログの外側をクリックしてもダイアログがとじないようにする */
    persistent: {
      type: Boolean,
      default: false
    },
    /** フルスクリーン表示する */
    fullscreen: {
      type: Boolean,
      default: false
    },
    /** 上部に閉じるボタンを表示する */
    showTopCloseButton: {
      type: Boolean,
      default: true
    },
    /** 下部に閉じるボタンを表示する */
    showCloseButton: {
      type: Boolean,
      default: true
    },
    /** 下部にOKボタンを表示する */
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    /** 閉じるボタンのテキスト */
    closeButtonText: {
      type: String,
      default: '閉じる'
    },
    /** OKボタンのテキスト */
    submitButtonText: {
      type: String,
      default: 'OK'
    }
  },
  emits: {
    /** 閉じるボタンを押したときのイベント */
    colse: () => true,
    /** OKボタンを押したときのイベント */
    submit: () => true,
    /**
     * ダイアログの開閉操作が行われた際のイベント
     * @param v ダイアログの状態
     */
    'update:modelValue': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true
  },
  setup (props, { emit }) {
    const setValue = (v: boolean) => {
      emit('update:modelValue', v)
    }

    const closeProxy = () => {
      setValue(false)
      emit('colse')
    }

    const submitProxy = () => {
      setValue(false)
      emit('submit')
    }

    return {
      setValue,
      closeProxy,
      submitProxy
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
