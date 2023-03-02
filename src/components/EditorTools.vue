<template>
  <div v-if="floatingStyle" class="floating-style d-flex flex-column">
    <v-btn class="ma-1" color="primary" icon @click="$emit('addObject', 'imageLink')">
      <v-icon>
        mdi-image-plus-outline
      </v-icon>
    </v-btn>
    <v-btn class="ma-1" color="primary" icon @click="$emit('submit')">
      <v-icon>
        mdi-send
      </v-icon>
    </v-btn>
  </div>
  <div v-else class="fixed-style">
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
      <v-btn icon flat @click="$emit('addObject', 'section')">
        <v-icon>
        mdi-text-box-plus-outline
        </v-icon>
      </v-btn>
      <v-menu location="top center">
        <template v-slot:activator="{ props }">
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
        <v-btn icon flat @click="$emit('preview')">
          <v-icon>
            mdi-eye
          </v-icon>
        </v-btn>
        <v-btn icon flat @click="$emit('submit')">
          <v-icon>
            mdi-send
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
    submit: () => true,
    preview: () => true,
    delSection: () => true
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.floating-style {
  position:fixed;
  bottom: 0px;
  right: 0px;
  z-index: 1;
}

.fixed-style {
  width: 100%;
  position: sticky;
  top: 0px;
  left: 0px;
}
</style>
