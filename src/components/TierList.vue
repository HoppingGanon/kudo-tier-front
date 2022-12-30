<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row v-for="tier,index in tiers" :key="index">
      <v-col>
        <v-card class="pa-2">
          <tier-component
            :tier="tier"
            min-height="200px"
            width="100%"
            display-type="summary"
            point-display-type="normal"
            @update-point-type="updatePointTypeEm($event, index)"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Tier, ReviewPointType } from '@/common/review'
import TierComponent from '@/components/TierComponent.vue'

export default defineComponent({
  name: 'TierList',
  components: {
    TierComponent
  },
  props: {
    tiers: {
      type: Array as PropType<Tier[]>,
      required: true
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType, index: number) => true
  },
  setup (props, { emit }) {
    const updatePointTypeEm = (value: ReviewPointType, index: number) => {
      emit('updatePointType', value, index)
    }
    return {
      updatePointTypeEm
    }
  }
})
</script>
