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

  <v-container v-else class="pa-0">
    <v-row>
      <v-col cols="0" sm="0" md="1" lg="2" xl="3" />
      <v-col cols="12" sm="12" md="10" lg="8" xl="6">
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
                  :disp-name="dispName"
                  :icon-url="iconUrl"
                  :profile="profile"
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
                    <v-btn @click="goTierSearch">
                      <v-icon>mdi-magnify</v-icon>投稿の検索
                    </v-btn>
                  </div>
                  <template v-slot:extension>
                    <v-tabs v-model="tab">
                      <v-tab>
                        最新のレビュー
                      </v-tab>
                      <v-tab>
                        最新のTier
                      </v-tab>
                    </v-tabs>
                  </template>
                </v-toolbar>
                <v-card v-if="tab === 0">
                  <v-card
                    id="reviewsWindow"
                    class="scroll"
                    flat
                    height="55vh"
                    color="thirdry"
                  >
                    <review-list
                      class="pa-1"
                      :reviews="reviews"
                      :review-factor-params="tier.reviewFactorParams"
                      @update-point-type="updatePointType"
                      :is-link="true"
                      display-type="summary"
                      :point-types="pointTypes"
                    />
                  </v-card>
                </v-card>

                <v-card v-if="tab === 1">
                  <v-card
                    class="scroll"
                    flat
                    height="55vh"
                    color="thirdry"
                  >
                    <v-card v-if="tiers.length == 0" height="40vh" class="flex-center pa-1">
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
                  </v-card>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import RestApi, { Parser } from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierList from '@/components/TierList.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { useRoute } from 'vue-router'
import { ReviewFunc, ReviewPointType, Tier } from '@/common/review'
import { reviews as reviewsOrg, tier as tierOrg } from '@/common/dummy'
import { useToast } from 'vue-toast-notification'
import router from '@/router'

export default defineComponent({
  name: 'HomeView',
  components: {
    ProfileComponent,
    SessionChecker,
    ErrorComponent,
    ReviewList,
    TierList
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNotFound = ref(false)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')
    const userId = ref('')
    const reviewsWindow = ref(null as HTMLElement | null)

    // テストデータ
    const reviews = ref(reviewsOrg)
    const tier = ref(tierOrg)

    const tiers = ref([] as Tier[])

    const tab = ref(0)

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        userId.value = route.params.id
        // URIにIDが含まれている場合
        RestApi.getUserData(route.params.id).then((res) => {
          dispName.value = res.data.name
          profile.value = res.data.profile
          iconUrl.value = res.data.iconUrl
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

    // ポイント表示方法のリスト
    const pointTypes = ref(ReviewFunc.getPointTypes(reviews.value))

    // ポイント表示方法の切り替えを子コンポーネントに提供する
    const updatePointType = (value: ReviewPointType, index: number) => {
      if (index >= 0 && index < reviews.value.length) {
        pointTypes.value[index] = value
      }
    }

    const goTierSearch = () => {
      router.push(`/tier-search/${userId.value}`)
    }

    const goTierSettings = () => {
      router.push('/tier-settings')
    }

    return {
      isNotFound,
      dispName,
      profile,
      iconUrl,
      reviews,
      tier,
      tiers,
      tab,
      updatePointType,
      pointTypes,
      goTierSearch,
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
