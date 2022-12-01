<template>
  <v-card class="ma-5">
    <tier-settings
      :model-value="tier"
      :point-type="tier.pointType"
      @updateTierName="updateTierName"
      @updatePointType="updatePointType"
      @updateWeightName="updateWeightName"
      @updateWeightIsPoint="updateWeightIsPoint"
      @updateWeight="updateWeight"
      @addWeightItem="addWeightItem"
      @removeWeightItem="removeWeightItem"
      @addParagItem="addParagItem"
      @removeParagItem="removeParagItem"
      @updateParagType="updateParagType"
      @updateParagBody="updateParagBody"
    />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TierSettings from '@/components/TierSettings.vue'
import { ReviewParagraphType, ReviewPointType, Tier } from '@/common/review'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    TierSettings
  },
  setup () {
    const tier = ref({
      tierId: '',
      userName: '',
      userId: '',
      userIconUrl: '',
      pointType: 'stars',
      name: '',
      imageUrl: 'https://placehold.jp/240x240.png',
      parags: [
        {
          type: 'text',
          body: ''
        }
      ],
      reviews: [
        {
          reviewId: '',
          tierId: '',
          userName: '',
          userId: '',
          userIconUrl: '',
          title: 'レビュー1',
          name: 'サンプル',
          iconUrl: 'https://placehold.jp/256x256.png',
          reviewFactors: [
            {
              info: '',
              point: Math.round(Math.random() * 100)
            }
          ],
          pointType: undefined,
          sections: [
            {
              title: 'これはサンプルです',
              parags: [
                {
                  type: 'text',
                  body: 'これはサンプルのレビューです。見た目の例として、各項目にランダムな評価がついています。'
                }
              ]
            }
          ],
          createAt: new Date('1970/01/01'),
          updateAt: new Date('1970/01/01')
        },
        {
          reviewId: '',
          tierId: '',
          userName: '',
          userId: '',
          userIconUrl: '',
          title: 'レビュー2',
          name: 'サンプル',
          iconUrl: 'https://placehold.jp/256x256.png',
          reviewFactors: [
            {
              info: '',
              point: Math.round(Math.random() * 100)
            }
          ],
          pointType: undefined,
          sections: [],
          createAt: new Date('1970/01/01'),
          updateAt: new Date('1970/01/01')
        }
      ],
      reviewFactorParams: [
        {
          name: '',
          isPoint: true,
          weight: 50
        }
      ],
      createAt: new Date('1970/01/01'),
      updateAt: new Date('1970/01/01')
    } as Tier)

    const updateTierName = (value: string) => {
      tier.value.name = value
    }
    const updatePointType = (value: ReviewPointType) => {
      tier.value.pointType = value
    }
    const updateWeightName = (value: string, index: number) => {
      if (index < tier.value.reviewFactorParams.length) {
        tier.value.reviewFactorParams[index].name = value
      }
    }
    const updateWeightIsPoint = (value: boolean, index: number) => {
      if (index < tier.value.reviewFactorParams.length) {
        tier.value.reviewFactorParams[index].isPoint = value
      }
    }
    const updateWeight = (value: number, index: number) => {
      if (index < tier.value.reviewFactorParams.length) {
        tier.value.reviewFactorParams[index].weight = value
      }
    }

    const addWeightItem = () => {
      tier.value.reviewFactorParams.push({
        name: '',
        isPoint: true,
        weight: 50
      })
      tier.value.reviews.forEach((review) => {
        review.reviewFactors.push({
          point: Math.round(Math.random() * 100),
          info: 'サンプル情報' + review.reviewFactors.length
        })
      })
    }
    const removeWeightItem = (index: number) => {
      if (index < tier.value.reviewFactorParams.length) {
        tier.value.reviewFactorParams.splice(index, 1)
      }
      tier.value.reviews.forEach((review) => {
        if (index < review.reviewFactors.length) {
          review.reviewFactors.splice(index, 1)
        }
      })
    }
    const addParagItem = (type: ReviewParagraphType) => {
      tier.value.parags.push({
        body: '',
        type: type
      })
    }
    const removeParagItem = (index: number) => {
      if (index < tier.value.parags.length) {
        tier.value.parags.splice(index, 1)
      }
    }
    const updateParagType = (value: ReviewParagraphType, index: number) => {
      if (index < tier.value.parags.length) {
        tier.value.parags[index].type = value
      }
    }
    const updateParagBody = (value: string, index: number) => {
      if (index < tier.value.parags.length) {
        tier.value.parags[index].body = value
      }
    }

    return {
      tier,
      updateTierName,
      updatePointType,
      updateWeightName,
      updateWeightIsPoint,
      updateWeight,
      addWeightItem,
      removeWeightItem,
      addParagItem,
      removeParagItem,
      updateParagType,
      updateParagBody
    }
  }
})
</script>
