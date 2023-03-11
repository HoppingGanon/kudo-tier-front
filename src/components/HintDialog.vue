<!-- 使い方を説明するhintダイアログのコンポーネント -->

<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)" :fullscreen="true">
    <v-carousel
      v-model="pageValue"
      height="100%"
      class="pa-2"
      :hide-delimiter-background="true"
      color="green-darken-3"
      :cycle="false"
      :show-arrows="$vuetify.display.mdAndUp"
    >
      <slot name="default" :close="() => $emit('update:model-value', false)"></slot>
    </v-carousel>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HintDialog',
  computed: {
    pageValue: {
      set (v: number) {
        this.$emit('update:page', v)
        this.dummyPage = v
      },
      get () : number {
        if (this.page !== undefined) {
          return this.page
        } else if (this.dummyPage !== undefined) {
          return this.dummyPage
        } else {
          return this.defaultPage
        }
      }
    }
  },
  props: {
    /** ダイアログが開いてる状態かどうか */
    modelValue: {
      type: Boolean,
      default: false
    },
    /** ページ番号 */
    page: {
      type: Number
    },
    /** 初期ページ番号 */
    defaultPage: {
      type: Number,
      default: 0
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
      dummyPage: ref<number | undefined>(undefined)
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.close-btn {
  text-align: right;
}
</style>
