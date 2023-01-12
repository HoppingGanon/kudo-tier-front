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
        <span v-if="title !== undefined" v-text="title"></span>
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
  components: {},
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    isFloating: {
      type: Boolean,
      default: false
    },
    isForce: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    size: {
      type: String,
      default: '64'
    },
    width: {
      type: String,
      default: '8'
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
