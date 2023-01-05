<template>
  <v-container class="ma-0 pa-0">
    <v-row>
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
        <div style="width: 100%" :class="pointType === 'rank7' || pointType === 'rank14' ? 'text-h4' : ''">
          <review-value-display
            :value="ave()"
            :point-type="pointType"
            display-size="larger"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider class="mt-3 mb-3" />
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
                  <v-row v-if="index < params.length && params[index].isPoint">
                    <v-col
                      cols="4"
                      sm="3"
                      md="2"
                      lg="2"
                      xl="2"
                    >
                      <span v-if="pointType === 'stars'">スター数：</span>
                      <span v-else-if="pointType === 'rank7'">ランク</span>
                      <span v-else-if="pointType === 'rank14'">ランク</span>
                      <span v-else-if="pointType === 'score'">スコア</span>
                      <span v-else-if="pointType === 'point'">点数</span>
                      <span v-else-if="pointType === 'unlimited'">数値</span>
                    </v-col>
                    <v-col class="d-flex">
                      <div class="ml-1 mr-2">:</div>
                      <div style="width: 100%">
                        <review-value-display
                          v-if="factor.point !== undefined"
                          :value="factor.point"
                          :point-type="pointType"
                          display-size="larger"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
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
                        thumb-label
                      />
                      <v-slider
                        v-else
                        :model-value="factor.point"
                        @update:model-value="$emit('updatePoint', $event, index)"
                        class="pr-3"
                        color="primary"
                        :min="0"
                        :max="100"
                        :step="step()"
                        label="評点"
                        thumb-label
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
import { defineComponent, PropType } from 'vue'
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
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {
    updatePoint: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: number, i: number) => true,
    updateInfo: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, i: number) => true
  },
  setup (props) {
    const ave = () => ReviewFunc.calcAaverage(props.review, props.params)
    const primaryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary
    const secondaryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.secondary
    const thirdryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry

    const step = () => 100 / (pointTypeTierCountDic[props.pointType] - 1)

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
