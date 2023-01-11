<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="false" />

  <v-container v-if="isNotFound">
    <v-row>
      <v-col>
        <v-card>
          <error-component
            comment="ユーザーが見つかりません"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <padding-component v-else :target-user-id="userId">
    <v-container fluid class="ma-0 pa-0">
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar color="secondary" dark>
              <v-card-title>
                <b>
                  プロフィール
                </b>
              </v-card-title>
            </v-toolbar>
            <profile-component
              :disp-name="user.name"
              :icon-url="user.iconUrl"
              :profile="user.profile"
              :tier-count="user.tierCount"
              :review-count="user.reviewCount"
              :user-id="userId"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar color="secondary">
              <v-card-title>
                投稿
              </v-card-title>
              <div class="d-flex flex-row-reverse" style="width: 100%">
                <v-btn @click="goSearch(tab === 0 ? 'tier' : 'review')">
                  <v-icon>mdi-magnify</v-icon>検索
                </v-btn>
              </div>
              <template v-slot:extension>
                <v-tabs v-model="tab" centered slider-color="primary" grow>
                  <v-tab>
                    最新のTier
                  </v-tab>
                  <v-tab>
                    最新のレビュー
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>

            <v-card v-show="tab === 0">
              <v-card
                flat
              >
                <v-card v-if="tiers.length === 0" height="40vh" class="flex-center pa-1">
                  <div style="text-align: center;">
                    Tierがありません<br />
                    初めてのTierを作成しましょう<br />
                    <v-btn color="primary" @click="goTierSettings">Tierを作成する</v-btn>
                  </div>
                </v-card>
                <tier-list
                  v-else
                  class="pa-1"
                  :tiers="tiers"
                  :is-link="true"
                />
                <v-card v-if="tiers.length !== 0" flat class="pa-3 mb-3 d-flex flex-row-reverse cursor-pointer" @click="goSearch('tier')">
                  もっと投稿を見る
                </v-card>
              </v-card>
            </v-card>

            <v-card v-show="tab === 1">
              <v-card
                id="reviewsWindow"
                flat
              >
                <v-card v-if="tiers.length === 0 && reviews.length === 0" height="40vh" class="flex-center pa-1">
                  <div style="text-align: center;">
                    レビューがありません<br />
                    レビューを作成するにはまずはTierを作成しましょう<br />
                    <v-btn color="primary" @click="goTierSettings">Tierを作成する</v-btn>
                  </div>
                </v-card>
                <v-card v-else-if="tiers.length !== 0 && reviews.length === 0" height="40vh" class="flex-center pa-1">
                  <div style="text-align: center;">
                    レビューがありません<br />
                    Tierからレビューを追加しましょう<br />
                    <v-btn color="primary" @click="goSearch('tier')">Tierを表示する</v-btn>
                  </div>
                </v-card>
                <review-list
                  class="pa-1"
                  :reviews="reviews"
                  :review-factor-params="params"
                  :is-link="true"
                  display-type="summary"
                />
                <v-card v-if="reviews.length !== 0" flat class="pa-3 mb-3 d-flex flex-row-reverse cursor-pointer" @click="goSearch('review')">
                  もっと投稿を見る
                </v-card>
              </v-card>
            </v-card>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </padding-component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import RestApi, { Parser, toastError } from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierList from '@/components/TierList.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import { useRoute } from 'vue-router'
import { Tier, Review, ReviewFactorParam } from '@/common/review'
import { emptyUser } from '@/common/dummy'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import { TierContentType } from '@/common/page'

export default defineComponent({
  name: 'HomeView',
  components: {
    ProfileComponent,
    SessionChecker,
    ErrorComponent,
    ReviewList,
    TierList,
    PaddingComponent
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNotFound = ref(false)
    const user = ref(emptyUser)
    const userId = ref('')
    const reviewsWindow = ref(null as HTMLElement | null)

    // テストデータ
    const reviews = ref([] as Review[])

    const tiers = ref([] as Tier[])
    const params = ref([] as ReviewFactorParam[][])

    const tab = ref(0)

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        userId.value = route.params.id
        // URIにIDが含まれている場合、ユーザーの情報をダウンロード
        RestApi.getUserData(route.params.id).then((res) => {
          user.value = {
            name: res.data.name,
            profile: res.data.profile,
            iconUrl: res.data.iconUrl,
            twitterName: res.data.twitterName,
            tierCount: res.data.tierCount,
            reviewCount: res.data.reviewCount
          }
        }).catch(() => {
          isNotFound.value = true
        })

        // 並行してTierもダウンロードする
        RestApi.getTierList(userId.value, '', 'updatedAtDesc', 1).then((res) => {
          const tierDataList = res.data
          tiers.value.splice(0)
          tierDataList.forEach((v) => {
            tiers.value.push(Parser.parseTier(v))
          })
        }).catch((e) => toastError(e, toast))

        // 並行してレビューもダウンロードする
        RestApi.getReviewPairs(route.params.id, '', 'updatedAtDesc', 1).then((res) => {
          reviews.value.splice(0)
          params.value.splice(0)
          res.data.forEach((v) => {
            reviews.value.push(Parser.parseReview(v.review))
            params.value.push(v.params)
          })
        }).catch((e) => {
          const v = e.response.data
          toast.error(`${v.message} (${v.code})`)
        })
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        isNotFound.value = true
      }

      reviewsWindow.value = document.getElementById('reviewsWindow')
    })

    const goSearch = (tab: TierContentType) => {
      router.push(`/tier-search/${userId.value}?tab=${tab}`)
    }

    const goTierSettings = () => {
      router.push('/tier-settings-new')
    }

    return {
      isNotFound,
      user,
      userId,
      reviews,
      params,
      tiers,
      tab,
      goSearch,
      goTierSettings
    }
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
.scroll {
  overflow-y: scroll;
}
</style>
