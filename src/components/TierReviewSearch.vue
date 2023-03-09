<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container class="pa-0 ma-0" fluid>
    <v-card class="ma-0" flat>
      <v-toolbar color="secondary" class="d-flex" dark>
        <slot name="title"></slot>
        <template v-slot:extension>
          <v-tabs v-model="tab" centered slider-color="primary" grow>
            <v-tab class="text-no-transform">
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
        :pairs="pairs"
        :user-id="userId"
        @clear-reviews-pair="clearReviewsPair"
        @update-reviews-pair="updateReviewsPair"
        @add-reviews-pair="addReviewsPair"
        :is-loading="isReviewsLoading"
        :exists-tier="tiers.length !== 0"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import TierSearch from '@/components/TierSearch.vue'
import ReviewSearch from '@/components/ReviewSearch.vue'
import { useRoute } from 'vue-router'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { ReviewWithParams, Tier } from '@/common/review'

export default defineComponent({
  name: 'TierReviewSearch',
  components: {
    SessionChecker,
    TierSearch,
    ReviewSearch
  },
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(true)
    const userId = ref('')
    const tab = ref(0)

    const tiers: Ref<Tier[]> = ref([] as Tier[])
    const pairs: Ref<ReviewWithParams[]> = ref([] as ReviewWithParams[])

    const isReviewsLoading = ref(true)
    const isTiersLoading = ref(true)

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        const id = route.params.id
        // URIにIDが含まれている場合
        RestApi.getUserData(id).then(() => {
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
              pairs.value.splice(0)
              pairs.value = res.data.map((pair) => Parser.parseReviewWithParams(pair))
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
      pairs.value.splice(0)
    }

    const updateReviewsPair = (v: ReviewWithParams[]) => {
      clearReviewsPair()
      setTimeout(() => {
        pairs.value = v
      }, 0)
    }

    const addReviewsPair = (v: ReviewWithParams[]) => {
      pairs.value = pairs.value.concat(v)
    }

    return {
      tiers,
      pairs,
      isNotFound,
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
