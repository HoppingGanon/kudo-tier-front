<template>
  <div v-if="floatingStyle" class="floating-style">
    <v-btn icon>
      <v-icon>
        mdi-send
      </v-icon>
    </v-btn>
    <v-btn icon>
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
      <v-btn icon flat>
        <v-icon>
          mdi-image-outline
        </v-icon>
      </v-btn>
      <v-btn icon flat>
        <v-icon>
          mdi-link
        </v-icon>
      </v-btn>
      <div class="d-flex justify-end" style="width: 100%;">
        <v-btn icon flat>
          <v-icon>
          mdi-text-box-plus-outline
          </v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditorTools',
  components: {},
  props: {
    floatingStyle: {
      type: Boolean,
      default: false
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
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
