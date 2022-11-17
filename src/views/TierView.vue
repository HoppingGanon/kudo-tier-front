<template>
  <v-container class="justify-center">
    <tier-card
      :tier="tierTest"
      :point-type="pointType"
      @update-point-type="updatePointType"
      display-type="all"
      point-display-type="normal"
      width="100%"
      min-height="720px"
      class="ma-3"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ReviewPointType } from '@/common/review'
import TierCard from '@/components/TierCard.vue'
import { tier as tierOrg } from '@/common/dummy'

export default defineComponent({
  name: 'TierView',
  components: {
    TierCard
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
