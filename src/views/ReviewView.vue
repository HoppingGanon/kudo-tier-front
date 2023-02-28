<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container v-if="isNotFound" class="pa-0">
    <v-row>
      <v-col>
        <v-card>
          <error-component
            comment="レビューが見つかりません"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <padding-component v-else :target-user-id="userId">
    <template v-slot:left>
      <v-container fluid class="ma-0 pl-1 pt-0 pr-0 pb-0">
        <v-card>
          <v-toolbar class="pl-2" color="thirdry">
            <span class="font-weight-bold">レビュー元のTier</span>
          </v-toolbar>
          <simple-tier :tier="tier" :this-review-id="review.reviewId"/>
        </v-card>
      </v-container>
    </template>
    <v-container class="pa-0 ma-0" fluid>
      <v-card class="block-center">
        <v-toolbar color="secondary" dark>
          <v-card-title>
            レビュー
          </v-card-title>
          <v-spacer />
          <menu-button :items="menuItems" @select="goThere" :return-object="true">
            <template v-slot:button="{ open, props }">
              <v-btn @click="open" v-bind="props" icon flat>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </menu-button>
        </v-toolbar>

        <div class="pa-1">
          <review-component
            :review="review"
            :review-factor-params="params"
            :point-type="pointType"
            @update-point-type="updatePointType"
            display-type="all"
            :pulling-up="tier.pullingUp"
            :pulling-down="tier.pullingDown"
          />
        </div>
      </v-card>
    </v-container>
    <simple-dialog
      v-model="delDialog"
      title="レビューの削除"
      text="本当にレビューを削除しますか？"
      submit-button-text="削除"
      @submit="deleteReview"
    />
  </padding-component>

  <!-- ユーザーロード中の時のみ表示されるコンポーネント -->
  <loading-component :is-loading="isLoading" :is-floating="true" :is-force="true" title="レビュー情報を取得中..." />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { ReviewFactorParam, ReviewFunc, ReviewPointType } from '@/common/review'
import ReviewComponent from '@/components/ReviewComponent.vue'
import SimpleTier from '@/components/SimpleTier.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { emptyReviwew, emptyTier } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import store from '@/store'
import router from '@/router'
import { SelectObject } from '@/common/page'

export default defineComponent({
  name: 'ReviewView',
  components: {
    ReviewComponent,
    SimpleTier,
    ErrorComponent,
    SessionChecker,
    PaddingComponent,
    MenuButton,
    SimpleDialog,
    LoadingComponent
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(false)
    const isSelf = ref(false)
    const userId = ref('')
    const isLoading = ref(true)

    const review = ref(ReviewFunc.cloneReview(emptyReviwew))
    const params = ref([] as ReviewFactorParam[])
    const pointType = ref('stars' as ReviewPointType)
    const updatePointType = (v: ReviewPointType) => {
      pointType.value = v
    }

    const tier = ref(emptyTier)

    // レビューの初期値を設定
    onMounted(() => {
      if (route.params.rid && typeof route.params.rid === 'string') {
        // URIにIDが含まれている場合
        isLoading.value = true
        RestApi.getReview(route.params.rid).then((res) => {
          review.value = Parser.parseReview(res.data.review)
          params.value = res.data.params
          pointType.value = review.value.pointType || 'point'
          userId.value = review.value.userId
          isNotFound.value = false

          // レビューの取得に成功した場合、続けてTierの取得を試みる
          RestApi.getTier(review.value.tierId).then((res) => {
            tier.value = Parser.parseTier(res.data)
            // 重みを考慮した合計点を算出する
            tier.value.reviews.sort((review1, review2) => {
              return ReviewFunc.calcSum(review2, tier.value.reviewFactorParams) - ReviewFunc.calcSum(review1, tier.value.reviewFactorParams)
            })
            // 自身のレビューを表示している場合
            isSelf.value = review.value.userId === store.state.userId
          }).catch((e) => {
            isNotFound.value = true
            toastError(e, toast)
          }).finally(() => { isLoading.value = false })
        }).catch((e) => {
          isNotFound.value = true
          toastError(e, toast)
        }).finally(() => { isLoading.value = false })
      }
    })

    const menuItems = computed(() => {
      const items: SelectObject[] = [
        {
          value: 'original',
          text: '元のTierを開く',
          icon: 'mdi-book-plus-outline'
        }
      ]
      if (isSelf.value) {
        items.push({
          value: 'edit',
          text: 'レビューを編集',
          icon: 'mdi-pencil-box-outline'
        })
        items.push({
          value: 'add',
          text: '新しいレビューを追加',
          icon: 'mdi-plus'
        })
        items.push({
          value: 'delete',
          text: 'レビューを削除',
          icon: 'mdi-trash-can'
        })
      }
      return items
    })

    const goThere = (page: SelectObject) => {
      switch (page.value) {
        case 'original':
          router.push(`/tier/${review.value.tierId}`)
          break
        case 'edit':
          router.push(`/review-settings/${review.value.reviewId}`)
          break
        case 'add':
          router.push(`/review-settings-new/${review.value.tierId}`)
          break
        case 'delete':
          delDialog.value = true
          break
      }
    }

    const deleteReview = () => {
      RestApi.deleteReview(review.value.reviewId).then(() => {
        toast.success('レビューを削除しました')
        router.push(`/tier/${review.value.tierId}`)
      }).catch((e) => {
        toastError(e, toast)
      })
    }

    const delDialog = ref(false)

    return {
      review,
      params,
      pointType,
      userId,
      isNotFound,
      isSelf,
      isLoading,
      updatePointType,
      tier,
      menuItems,
      goThere,
      delDialog,
      deleteReview
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
