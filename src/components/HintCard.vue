<!-- 使い方を説明するhintダイアログの一ページ分のコンポーネント -->

<template>
  <v-carousel-item>
    <div :style="width" class="centering scroll">
      <v-toolbar color="green-darken-3">
        <v-card-title v-if="title" v-text="title" />
        <v-spacer />
        <v-btn icon @click="$emit('close')">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
      <div class="font-weight-bold ma-1 text-h6" v-if="subTitle" v-text="subTitle"></div>
      <slot>
        <div class="wrapper">
          <div style="display: inline-block;" :style="left" class="d-flex pa-1">
            <slot name="image">
            </slot>
          </div>
          <div class="pa-1" style="display: inline-block;" :style="right">
            <slot name="text">
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </v-carousel-item>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export default defineComponent({
  name: 'HintCard',
  props: {
    /** ページタイトル */
    title: {
      type: String
    },
    /** 内容の見出し */
    subTitle: {
      type: String
    }
  },
  emits: {
    /** 閉じるボタンが押された際のイベント */
    close: () => true
  },
  setup () {
    const display = useDisplay()
    return {
      width: computed(() => {
        let size = '100%'
        if (display.md.value) {
          size = '90%'
        } else if (display.lg.value) {
          size = '80%'
        } else if (display.xl.value) {
          size = '70%'
        }
        return `width: ${size};height: 100%`
      }),
      left: computed(() => {
        let size = 'width: 30%;'
        let maxHeight = 'max-height: 700px;'
        if (display.xs.value) {
          size = 'width: 70%;'
          maxHeight = 'max-height: 320px;'
        } else if (display.sm.value) {
          size = 'width: 60%;'
          maxHeight = 'max-height: 400px;'
        } else if (display.md.value) {
          size = 'width: 50%;'
          maxHeight = 'max-height: 400px;'
        } else if (display.lg.value) {
          size = 'width: 40%;'
          maxHeight = 'max-height: 600px;'
        } else if (display.xl.value) {
          size = 'width: 30%;'
          maxHeight = 'max-height: 700px;'
        }
        return `${size}${maxHeight}`
      }),
      right: computed(() => {
        let size = '50%'
        if (display.xs.value) {
          size = '100%'
        } else if (display.sm.value) {
          size = '100%'
        } else if (display.md.value) {
          size = '50%'
        } else if (display.lg.value) {
          size = '50%'
        } else if (display.xl.value) {
          size = '50%'
        }
        return `width: ${size};`
      })
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.centering {
  margin: 0 auto;
  background-color: #F0F0F0;
  border-radius: 5px 5px 5px 5px;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
}

.scroll {
  overflow-y: auto;
}

.outlined {
  border: 1px solid lightgrey;
}
</style>
