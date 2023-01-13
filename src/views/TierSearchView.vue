<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <padding-component :target-user-id="userId" title="ユーザー情報">
    <v-container class="pa-0 ma-0" fluid>
      <v-card class="ma-0" flat>
        <v-toolbar color="secondary" class="d-flex" dark>
          <div class="no-break-box">
            <v-card-title class="font-weight-bold">
              <span v-text="dispName" />
            </v-card-title>
          </div>
          <div>
            <v-card-title class="font-weight-bold">
              <span>さんの投稿</span>
            </v-card-title>
          </div>
          <template v-slot:extension>
            <v-tabs v-model="tab" centered slider-color="primary" grow>
              <v-tab>
                Tier
              </v-tab>
              <v-tab>
                レビュー
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-card v-if="isNotFound" flat>
          <span>
            ユーザーが存在しません
          </span>
        </v-card>
        <tier-search
          v-show="!isNotFound && tab === 0"
          :tiers="tiers"
          :user-id="userId"
          @clear-tiers="clearTiers"
          @update-tiers="updateTiers"
          @add-tiers="addTiers"
          :is-loading="isTiersLoading"
        />
        <review-search
          v-show="!isNotFound && tab === 1"
          :reviews="reviews"
          :user-id="userId"
          :params-list="paramsList"
          @clear-reviews-pair="clearReviewsPair"
          @update-reviews-pair="updateReviewsPair"
          @add-reviews-pair="addReviewsPair"
          :is-loading="isReviewsLoading"
        />
      </v-card>
    </v-container>
  </padding-component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import TierSearch from '@/components/TierSearch.vue'
import ReviewSearch from '@/components/ReviewSearch.vue'
import { useRoute } from 'vue-router'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { Review, ReviewFactorParam, Tier } from '@/common/review'
import PaddingComponent from '@/components/PaddingComponent.vue'

export default defineComponent({
  name: 'TierSearchView',
  components: {
    SessionChecker,
    TierSearch,
    ReviewSearch,
    PaddingComponent
  },
  props: {},
  emits: {},
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(true)
    const dispName = ref('')
    const userId = ref('')
    const tab = ref(0)

    const tiers = ref([] as Tier[])
    const reviews = ref([] as Review[])
    const paramsList = ref([] as ReviewFactorParam[][])

    const isReviewsLoading = ref(true)
    const isTiersLoading = ref(true)

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        const id = route.params.id
        // URIにIDが含まれている場合
        RestApi.getUserData(id).then((res) => {
          dispName.value = res.data.name
          userId.value = id
          // ユーザーが存在する場合は、Tierの検索(初動)
          RestApi.getTierList(id, '', 'updatedAtDesc', 1).then((res) => {
            const tierDataList = res.data
            tiers.value.splice(0)
            tierDataList.forEach((v) => {
              tiers.value.push(Parser.parseTier(v))
            })
            isTiersLoading.value = false
          }).catch((e) => {
            toastError(e, toast)
            isTiersLoading.value = false
          })

          // ユーザーが存在する場合は、レビューの検索(初動)
          RestApi.getReviewPairs(id, '', 'updatedAtDesc', 1).then((res) => {
            if (res.data.length !== 0) {
              // 取得件数1件以上
              reviews.value.splice(0)
              paramsList.value.splice(0)
              res.data.forEach((v) => {
                reviews.value.push(Parser.parseReview(v.review))
                paramsList.value.push(v.params)
              })
            }
            isReviewsLoading.value = false
          }).catch((e) => {
            toastError(e, toast)
            isReviewsLoading.value = false
          })
          isNotFound.value = false
        }).catch((e) => {
          toastError(e, toast)
          isNotFound.value = true
        })
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        isNotFound.value = true
      }
      switch (route.query.tab) {
        case 'tier':
          tab.value = 0
          break
        case 'review':
          tab.value = 1
          break
      }
    })

    const clearTiers = () => {
      tiers.value.splice(0)
    }

    const updateTiers = (v: Tier[]) => {
      clearTiers()
      setTimeout(() => {
        tiers.value = v
      }, 0)
    }

    const addTiers = (v: Tier[]) => {
      tiers.value = tiers.value.concat(v)
    }

    const clearReviewsPair = () => {
      reviews.value.splice(0)
      paramsList.value.splice(0)
    }

    const updateReviewsPair = (r: Review[], p: ReviewFactorParam[][]) => {
      clearReviewsPair()
      setTimeout(() => {
        reviews.value = r
        paramsList.value = p
      }, 0)
    }

    const addReviewsPair = (r: Review[], p: ReviewFactorParam[][]) => {
      reviews.value = reviews.value.concat(r)
      paramsList.value = paramsList.value.concat(p)
    }

    return {
      tiers,
      reviews,
      paramsList,
      isNotFound,
      dispName,
      userId,
      tab,
      isReviewsLoading,
      isTiersLoading,
      clearTiers,
      updateTiers,
      addTiers,
      clearReviewsPair,
      updateReviewsPair,
      addReviewsPair
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
