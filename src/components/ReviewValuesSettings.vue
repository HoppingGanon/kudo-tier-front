<!-- レビュー評点の編集・作成するコンポーネント -->

<template>
  <v-container class="ma-0 pa-0">
    <v-row class="mb-3">
      <v-col
        cols="3"
        sm="2"
        md="2"
        lg="2"
        xl="2"
      >
        <span v-if="pointType === 'stars'">総合：</span>
        <span v-else-if="pointType === 'rank7'">総合ランク</span>
        <span v-else-if="pointType === 'rank14'">総合ランク</span>
        <span v-else-if="pointType === 'score'">総合スコア</span>
        <span v-else-if="pointType === 'point'">総合点</span>
        <span v-else-if="pointType === 'unlimited'">合計</span>
      </v-col>
      <v-col class="d-flex pt-2">
        <div class="ml-1 mr-2">
          :
        </div>
        <div :class="pointType === 'rank7' || pointType === 'rank14' ? 'text-h4' : ''">
          <review-value-display
            :value="ave()"
            :point-type="pointType"
            display-size="large2"
          />
        </div>
        <div style="width: 100%;" class="d-flex justify-end">
          <slot name="top-right">
          </slot>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-container class="ma-0 pa-1" fluid>
            <v-row :style="`background-color: ${secondaryColor};`">
              <v-col cols="4" :style="`border-right: 1px solid ${primaryColor}50`">
                項目名
              </v-col>
              <v-col>
                評点
              </v-col>
            </v-row>
            <v-row v-for="factor, index in review.reviewFactors" :key="index" class="mt-3" :style="index % 2 == 1 ? `background-color: ${thirdryColor};` : ''">
              <v-col v-if="index < params.length" cols="4" :style="`border-right: 1px solid ${primaryColor}50`">
                <v-container class="pa-0 ma-0" fluid>
                  <v-row>
                    <v-col>
                      <span v-text="params[index].name" /> :
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
              <v-col v-if="index < params.length && params[index].isPoint">
                <v-container class="pa-0 ma-0" fluid>
                  <v-row class="mt-3">
                    <v-col>
                      <v-text-field
                        v-if="pointType === 'unlimited'"
                        type="number"
                        label="評点"
                      />
                      <v-slider
                        v-else-if="pointType === 'point'"
                        :model-value="factor.point"
                        @update:model-value="$emit('updatePoint', $event, index)"
                        class="pr-3"
                        color="primary"
                        :min="0"
                        :max="100"
                        :step="1"
                        label="評点"
                        thumb-label="always"
                      />
                      <v-slider
                        v-else-if="pointType === 'stars'"
                        :model-value="factor.point"
                        @update:model-value="$emit('updatePoint', $event, index)"
                        class="pr-3"
                        color="primary"
                        :min="0"
                        :max="100"
                        :step="step"
                        label="評点"
                        thumb-label="always"
                      >
                        <template v-slot:thumb-label>
                          <span v-text="factor.point !== undefined ? (factor.point / step).toFixed(1) : ''" />
                        </template>
                      </v-slider>
                      <v-slider
                        v-else
                        :model-value="factor.point"
                        @update:model-value="$emit('updatePoint', $event, index)"
                        class="pr-3"
                        color="primary"
                        :min="0"
                        :max="100"
                        :step="step"
                        label="評点"
                        thumb-label="always"
                      >
                        <template v-slot:thumb-label>
                          <review-value-display
                            v-if="factor.point !== undefined"
                            :value="factor.point"
                            :point-type="pointType"
                            display-size="smaller"
                            :compact="true"
                          />
                        </template>
                      </v-slider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
              <v-col v-if="index < params.length && !params[index].isPoint">
                <v-text-field
                  :model-value="factor.info"
                  @update:model-value="$emit('updateInfo', $event, index)"
                  label="情報"
                  :rules="[rules.maxLen(reviewValidation.factorInfoLenMax)]"
                  :hint="`付加したい情報を入力してください(${reviewValidation.factorInfoLenMax}文字以内)`"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { pointTypeTierCountDic, Review, ReviewFactorParam, ReviewFunc, ReviewPointType, reviewValidation } from '@/common/review'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import vuetify from '@/plugins/vuetify'
import rules from '@/common/rules'

export default defineComponent({
  name: 'ReviewValuesSettings',
  components: {
    ReviewValueDisplay
  },
  props: {
    /** レビューデータ */
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    /** レビューの評価項目 */
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    },
    /** レビューポイントの表現方法 */
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    /** Tier調整値 */
    pullingUp: {
      type: Number,
      required: true
    },
    /** Tier調整値 */
    pullingDown: {
      type: Number,
      required: true
    }
  },
  emits: {
    /**
     * レビュー評点の更新イベント
     * @param v レビュー評点
     * @param i レビュー評点のインデックス
     */
    updatePoint: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: number, i: number) => true,
    /**
     * レビュー情報の更新イベント
     * @param v レビュー情報
     * @param i レビュー情報のインデックス
     */
    updateInfo: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, i: number) => true
  },
  setup (props) {
    const ave = () => ReviewFunc.calcAaverage(props.review, props.params, props.pullingUp, props.pullingDown, 0, 100)
    const primaryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary
    const secondaryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.secondary
    const thirdryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry

    const step = computed(() => 100 / (pointTypeTierCountDic[props.pointType] - 1))

    return {
      reviewValidation,
      rules,
      ave,
      primaryColor,
      secondaryColor,
      thirdryColor,
      step
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
