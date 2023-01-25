<template>
  <v-container>
    <v-row>
      <v-col>
        Tier表を画像として保存します
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="6" xl="6">
        <v-container fluid class="ma-0 pa-0">
          <v-row>
            <v-col>
              <v-select
                :model-value="theme"
                @update:model-value="$emit('update:theme', $event)"
                label="テーマカラー"
                :items="themeItems"
                item-title="text"
                item-value="value"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <point-type-selector
                :model-value="pointType"
                @update="$emit('updatePointType', $event)"
                :always="true"
                :is-select="true"
                :exclude-unlimited="true"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col>
        【サンプル】
        <tier-ranking-pivot
          :tier-pivot-list="pivotList"
          :pointType="pointType"
          :params="[]"
          :theme="theme"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import TierRankingPivot, { RankingTheme } from '@/components/TierRankingPivot.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import { SelectObject } from '@/common/page'
import { ReviewFunc, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'TierToPicture',
  components: {
    TierRankingPivot,
    PointTypeSelector
  },
  props: {
    theme: {
      type: String as PropType<RankingTheme>,
      default: 'light'
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    }
  },
  emits: {
    'update:theme': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: RankingTheme) => true,
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props) {
    const themeItems: SelectObject<RankingTheme>[] = [
      {
        text: 'ノーマルテーマ',
        value: 'light'
      },
      {
        text: 'ノーマルテーマ(反転)',
        value: 'light-reverse'
      },
      {
        text: 'ダークテーマ',
        value: 'dark'
      },
      {
        text: 'ダークテーマ(反転)',
        value: 'dark-reverse'
      }
    ]
    const pivotList = computed(() => {
      return ReviewFunc.makeTierPivot([], [], '', props.pointType)
    })
    return {
      themeItems,
      pivotList
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
