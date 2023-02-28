<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row v-for="tier,index in tiers" :key="index">
      <v-col>
        <v-card class="pa-2">
          <!-- Tierで参照したり、Search等でスクロール検知をするためにIDを振る -->
          <a :id="`tir${tier.tierId}`">
            <tier-component
              :tier="tier"
              :is-link="isLink"
              display-type="summary"
              @update-point-type="updatePointTypeEm($event, index)"
              @reload="$emit('reload')"
            />
          </a>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-col>
        <loading-component class="mt-5" title="Tierを取得中..." />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Tier, ReviewPointType } from '@/common/review'
import TierComponent from '@/components/TierComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

export default defineComponent({
  name: 'TierList',
  components: {
    TierComponent,
    LoadingComponent
  },
  props: {
    tiers: {
      type: Array as PropType<Tier[]>,
      required: true
    },
    isLink: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType, index: number) => true,
    reload: () => true
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
