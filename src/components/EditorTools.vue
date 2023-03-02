<template>
  <div v-if="floatingStyle" class="floating-style">
    <v-btn icon @click="$emit('submit')">
      <v-icon>
        mdi-send
      </v-icon>
    </v-btn>
    <v-btn icon @click="$emit('addObject', 'imageLink')">
      <v-icon>
        mdi-image-plus-outline
      </v-icon>
    </v-btn>
  </div>
  <div v-else class="fixed-style">
    <span class="ml-3 text-caption">
      ツール
    </span>
    <div class="d-flex">
      <v-btn icon flat @click="$emit('addObject', 'imageLink')">
        <v-icon>
          mdi-image-outline
        </v-icon>
      </v-btn>
      <v-btn icon flat @click="$emit('addObject', 'serviceLink')">
        <v-icon>
          mdi-link
        </v-icon>
      </v-btn>
      <div class="d-flex justify-end" style="width: 100%;">
        <v-btn icon flat @click="$emit('addObject', 'section')">
          <v-icon>
          mdi-text-box-plus-outline
          </v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ReviewParagraphType } from '@/common/review'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditorTools',
  props: {
    floatingStyle: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    addObject: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      pType: ReviewParagraphType | 'section'
    ) => true,
    submit: () => true
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.floating-style {
}

.fixed-style {
  width: 100%;
}
</style>
