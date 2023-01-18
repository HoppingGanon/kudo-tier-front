<template>
  <v-dialog :persistent="persistent" :model-value="modelValue" @update:model-value="setValue" :fullscreen="fullscreen">
    <div width="100%" class="d-flex align-center justify-center">
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
          <v-btn v-if="showSubmitButton" v-text="submitButtonText" @click="submitProxy" />
          <v-btn v-if="showCloseButton" v-text="closeButtonText" @click="closeProxy" />
        </v-card-actions>
      </v-card>
  </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SimpleDialog',
  components: { },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    prependText: {
      type: String
    },
    prependImageSrc: {
      type: String
    },
    text: {
      type: String
    },
    appendImageSrc: {
      type: String
    },
    appendText: {
      type: String
    },
    persistent: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    showTopCloseButton: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    closeButtonText: {
      type: String,
      default: '閉じる'
    },
    submitButtonText: {
      type: String,
      default: 'OK'
    }
  },
  emits: {
    colse: () => true,
    submit: () => true,
    'update:modelValue': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true
  },
  setup (props, { emit }) {
    const setValue = (v: boolean) => {
      emit('update:modelValue', v)
    }

    const closeProxy = () => {
      emit('colse')
      setValue(false)
    }

    const submitProxy = () => {
      emit('submit')
      setValue(false)
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
