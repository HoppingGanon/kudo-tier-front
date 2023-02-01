<template>
  <table style="width: 100%">
    <tr>
      <td class="minimum">
        <v-card flat>
          <p class="mt-2">
            <span v-text="`${label} : `" />
          </p>
        </v-card>
      </td>
      <td style="width:auto">
        <review-value-display
          v-if="pointType === 'unlimited'"
          :point-type="pointType"
          :value="sum"
          display-size="large3"
        />
        <review-value-display
          v-else
          :point-type="pointType"
          :value="average"
          display-size="large3"
        />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ReviewFunc, ReviewPointType } from '@/common/review'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewLargeValue',
  components: {
    ReviewValueDisplay
  },
  props: {
    sum: {
      type: Number,
      required: true
    },
    average: {
      type: Number,
      required: true
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {},
  setup (props) {
    return {
      label: computed(() => ReviewFunc.getLergeDisplayLabel(props.pointType))
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
