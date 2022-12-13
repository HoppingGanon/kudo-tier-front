<template>
  <!-- サイズ調整のためfluidは入れない -->
  <v-container class="pa-0">
    <v-card class="pa-1 block-center" max-width="1080px">
      <tier-component
        :tier="tierTest"
        :point-type="pointType"
        @update-point-type="updatePointType"
        display-type="all"
        point-display-type="normal"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ReviewPointType } from '@/common/review'
import TierComponent from '@/components/TierComponent.vue'
import { tier as tierOrg } from '@/common/dummy'

export default defineComponent({
  name: 'TierView',
  components: {
    TierComponent
  },
  props: {},
  emits: { },
  setup () {
    // test
    const tierTest = ref(tierOrg)
    const pointType = ref('point' as ReviewPointType)
    const updatePointType = (v: ReviewPointType) => {
      pointType.value = v
    }

    return {
      tierTest,
      pointType,
      updatePointType
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
