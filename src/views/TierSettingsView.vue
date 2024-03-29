
<!-- Tierを新規作成/編集するページ -->

<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker :no-session-error="true" />

  <v-container class="pa-0">
    <v-card class="ma-0">
      <tier-settings
        :model-value="tier"
        :orgTier="orgTier"
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
        @update-pulling-up="updatePullingUp"
        @update-pulling-down="updatePullingDown"
      />
    </v-card>
  </v-container>

  <!-- 情報の取得時のみ表示-->
  <loading-component :is-loading="loading" :is-force="true" class="mt-5" title="Tierを取得中..." />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import TierSettings from '@/components/TierSettings.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ReviewFactorParam, ReviewFunc, ReviewParagraphType, ReviewPointType } from '@/common/review'
import { useRoute } from 'vue-router'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { emptyReviwew, emptyTier } from '@/common/dummy'
import router from '@/router'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    SessionChecker,
    TierSettings,
    LoadingComponent
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const loading = ref(true)

    const tier = ref(ReviewFunc.cloneTier(emptyTier))
    const orgTier = ref(ReviewFunc.cloneTier(emptyTier))
    tier.value.reviewFactorParams.push({
      name: '',
      weight: 50,
      isPoint: true,
      index: -1
    })
    tier.value.reviewFactorParams.push({
      name: '',
      weight: 50,
      isPoint: true,
      index: -2
    })
    tier.value.reviewFactorParams.push({
      name: '',
      weight: 50,
      isPoint: true,
      index: -3
    })
    tier.value.parags.push({
      type: 'text',
      body: '',
      isChanged: false
    })
    let review = ReviewFunc.cloneReview(emptyReviwew)
    review.name = 'サンプル用レビュー1'
    review.title = 'これはサンプルレビューです'
    review.reviewId = 'sample1'
    review.sections.push({
      title: 'サンプルのセクション',
      parags: [
        {
          type: 'text',
          body: 'サンプルレビューの説明文です\n実際はTier作成後に手動でレビューを追加する必要があります\nまた、このサンプルでは評価項目の評価情報をランダムで設定しています',
          isChanged: false
        }
      ]
    })
    tier.value.reviewFactorParams.forEach(() => {
      review.reviewFactors.push({
        point: Math.round(Math.random() * 100)
      })
    })
    tier.value.reviews.push(review)

    review = ReviewFunc.cloneReview(review)
    review.name = 'サンプル用レビュー2'
    review.reviewId = 'sample2'
    review.reviewFactors = []
    tier.value.reviewFactorParams.forEach(() => {
      review.reviewFactors.push({
        point: Math.round(Math.random() * 100)
      })
    })
    tier.value.reviews.push(review)

    review = ReviewFunc.cloneReview(review)
    review.name = 'サンプル用レビュー3'
    review.reviewId = 'sample3'
    review.reviewFactors = []
    tier.value.reviewFactorParams.forEach(() => {
      review.reviewFactors.push({
        point: Math.round(Math.random() * 100)
      })
    })
    tier.value.reviews.push(review)

    const isNew = ref(true)
    onMounted(() => {
      loading.value = true
      if (route.params.tid && typeof route.params.tid === 'string') {
        RestApi.getTier(route.params.tid).then((res) => {
          // 成功の場合
          tier.value = Parser.parseTier(res.data)
          orgTier.value = ReviewFunc.cloneTier(tier.value)
          isNew.value = false
        }).catch((e) => {
          // 失敗の場合は通知を表示して、新規作成
          toastError(e, toast)
          toast.warning('Tierを新規作成します')
          isNew.value = true
          router.replace('/tier-settings-new')
        }).finally(() => {
          loading.value = false
        })
      } else {
        isNew.value = true
        loading.value = false
        router.replace('/tier-settings-new')
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
        index: tier.value.reviewFactorParams.reduce((min, v) => Math.min(min, v.index), 0) - 1
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
    const addParagItem = (type: ReviewParagraphType | 'section', index: number) => {
      if (type !== 'section') {
        tier.value.parags.splice(index, 0, {
          body: '',
          type: type,
          isChanged: true
        })
      }
    }
    const removeParagItem = (index: number) => {
      if (index < tier.value.parags.length) {
        tier.value.parags.splice(index, 1)
      }
    }
    const updateParagType = (value: ReviewParagraphType, index: number) => {
      if (index < tier.value.parags.length) {
        tier.value.parags[index].type = value
        tier.value.parags[index].body = ''
        tier.value.parags[index].isChanged = true
      }
    }
    const updateParagBody = (value: string, index: number) => {
      if (index < tier.value.parags.length) {
        tier.value.parags[index].body = value
        tier.value.parags[index].isChanged = true
      }
    }
    const updateParams = (value: ReviewFactorParam[]) => {
      tier.value.reviewFactorParams.splice(0)
      tier.value.reviewFactorParams = value
    }
    const updatePullingUp = (value: number) => {
      tier.value.pullingUp = value
    }
    const updatePullingDown = (value: number) => {
      tier.value.pullingDown = value
    }

    return {
      loading,
      tier,
      orgTier,
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
      updateParams,
      updatePullingUp,
      updatePullingDown
    }
  }
})
</script>
