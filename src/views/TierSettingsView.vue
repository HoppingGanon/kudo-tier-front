<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="true" :no-session-error="true" />

  <v-container class="pa-0">
    <v-card class="ma-0" flat>
      <tier-settings
        :model-value="tier"
        :point-type="tier.pointType"
        :is-new="isNew"
        @updateTierName="updateTierName"
        @updateImageUrl="updateImageUrl"
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
        @update-params="updateParams"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import TierSettings from '@/components/TierSettings.vue'
import { ReviewFactorParam, ReviewParagraphType, ReviewPointType, Tier } from '@/common/review'
import { useRoute } from 'vue-router'
import RestApi, { ErrorResponse, Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    SessionChecker,
    TierSettings
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const tier = ref({
      tierId: '',
      userName: '',
      userId: '',
      userIconUrl: '',
      pointType: 'stars',
      name: '',
      imageUrl: '',
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

    const isNew = ref(true)
    onMounted(() => {
      if (route.params.uid && typeof route.params.uid === 'string' && route.params.tid && typeof route.params.tid === 'string') {
        RestApi.getTier(route.params.uid, route.params.tid).then((res) => {
          // 成功の場合
          tier.value = Parser.parseTier(res.data)
          isNew.value = false
        }).catch((e) => {
          // 失敗の場合は通知を表示して、新規作成
          const v = e.response.data as ErrorResponse
          toast.warning(`${v.message}(${v.code}) Tierを新規作成します`)
          isNew.value = true
        })
      }
    })

    const updateTierName = (value: string) => {
      tier.value.name = value
    }
    const updateImageUrl = (value: string) => {
      tier.value.imageUrl = value
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
        weight: 50,
        // indexをユニークにするため、0未満のindexのうち最小値より1少ない値を付加する
        index: tier.value.reviewFactorParams.reduce((min, v) => Math.min(min, v.index), 0)
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
    const updateParams = (value: ReviewFactorParam[]) => {
      tier.value.reviewFactorParams.splice(0)
      tier.value.reviewFactorParams = value
    }

    return {
      tier,
      isNew,
      updateTierName,
      updateImageUrl,
      updatePointType,
      updateWeightName,
      updateWeightIsPoint,
      updateWeight,
      addWeightItem,
      removeWeightItem,
      addParagItem,
      removeParagItem,
      updateParagType,
      updateParagBody,
      updateParams
    }
  }
})
</script>
