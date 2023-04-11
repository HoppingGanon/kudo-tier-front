<!-- 新規にコンポーネントを追加する際のテンプレート -->

<template>
  <v-container>
    <v-carousel
      v-model="page"
      color="primary"
      :hide-delimiter-background="true"
      :cycle="false"
    >
      <v-carousel-item>
        <v-card class="text-center x-padding">
          <matchings-title />
        </v-card>
      </v-carousel-item>
      <v-carousel-item class="text-center x-padding">
        質問1
      </v-carousel-item>
      <v-carousel-item class="text-center x-padding">
        結果
      </v-carousel-item>

      <template v-slot:prev="{ props }" >
        <v-btn :disabled="page === 0" :class="page === 0 ? 'none' : ''" icon @click="props.onClick" color="primary">
          <v-icon> mdi-chevron-left </v-icon>
        </v-btn>
      </template>
      <template v-slot:next="{ props }" >
        <v-btn :disabled="page === 2" :class="page === 2 ? 'none' : ''" icon @click="props.onClick" color="primary">
          <v-icon> mdi-chevron-right </v-icon>
        </v-btn>
      </template>
    </v-carousel>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MatchingsTitle from '@/components/MatchingsTitle.vue'

export default defineComponent({
  name: 'MatchingsView',
  components: {
    MatchingsTitle
  },
  props: {},
  emits: {},
  setup () {
    const page = ref(0)
    return {
      page
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

/* 左右の名印を非表示にするクラス */
.none{
  opacity: 0;
}

.x-padding {
  padding-right: 64px;
  padding-left: 64px;
}
</style>
