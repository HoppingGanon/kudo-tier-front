<template>
  <v-container class="justify-center">
    <tier-card
      :tier="tierTest"
      display-type="all"
      point-display-type="normal"
      width="100%"
      min-height="200px"
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
  props: { },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup () {
    // test
    const tierTest = ref(tierOrg)

    return {
      tierTest
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
