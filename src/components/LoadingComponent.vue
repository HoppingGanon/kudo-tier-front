<!-- ロード状態を画面に表示するコンポーネント -->

<template>
  <v-dialog v-if="isLoading && isForce" :persistent="true" :model-value="isLoading" class="d-flex justify-center">
    <div>
      <div style="width: 100%" class="d-flex justify-center">
        <v-progress-circular
          :indeterminate="true"
          color="primary"
          :size="size"
          :width="width"
        />
      </div>
      <div style="width: 100%" class="d-flex justify-center">
        <span v-if="title !== undefined" v-text="title" class="force-title"></span>
      </div>
    </div>
  </v-dialog>
  <v-card
    v-else-if="isLoading && isFloating"
    class="pa-3 d-flex justify-center align-center absolute-center-center"
  >
    <div>
      <div style="width: 100%" class="d-flex justify-center">
        <v-progress-circular
          :indeterminate="true"
          color="primary"
          :size="size"
          :width="width"
        />
      </div>
      <div style="width: 100%" class="d-flex justify-center">
        <span v-if="title !== undefined" v-text="title"></span>
      </div>
    </div>
  </v-card>
  <div v-else-if="isLoading" style="width: 100%;" class="d-flex justify-center">
    <div>
      <div style="width: 100%" class="d-flex justify-center">
        <v-progress-circular
          :indeterminate="true"
          color="primary"
          :size="size"
          :width="width"
        />
      </div>
      <div style="width: 100%" class="d-flex justify-center">
        <span v-if="title !== undefined" v-text="title"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingComponent',
  props: {
    /** ロード中かどうか */
    isLoading: {
      type: Boolean,
      default: true
    },
    /** trueにすると絶対位置でフローティング表示 */
    isFloating: {
      type: Boolean,
      default: false
    },
    /** trueにすると他の操作を受け付けない */
    isForce: {
      type: Boolean,
      default: false
    },
    /** タイトル */
    title: {
      type: String
    },
    /** 進捗サークルの大きさ */
    size: {
      type: String,
      default: '64'
    },
    /** 進捗サークルの太さ */
    width: {
      type: String,
      default: '8'
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.force-title {
  text-shadow: 1px 1px 3px black, -1px 1px 3px black, -1px -1px 3px black, 1px -1px 3px black;
  color: white;
}
</style>
