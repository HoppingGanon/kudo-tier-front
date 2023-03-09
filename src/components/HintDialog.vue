<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)" :fullscreen="true">
    <div class="close-btn">
      <v-btn flat color="primary mt-2 mr-5" icon @click="$emit('update:model-value', false)">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </div>
    <v-carousel
      v-model="pageValue"
      height="100%"
      class="pa-2"
      :hide-delimiter-background="true"
      color="grey-darken-3"
      :interval="0"
      :show-arrows="$vuetify.display.mdAndUp"
    >
      <slot></slot>
    </v-carousel>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HintDialog',
  components: {},
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
    modelValue: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number
    },
    defaultPage: {
      type: Number,
      default: 0
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
