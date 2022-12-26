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

  <v-container v-else>
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
      <v-col cols="6">
        <v-card>
          <v-toolbar color="secondary">
            <v-card-title>
              <b>
                最新のレビュー
              </b>
            </v-card-title>
          </v-toolbar>
          <v-card
            class="scroll pa-1"
            flat
            min-height="30vh"
            max-height="50vh"
            color="thirdry"
          >
            <review-list
              :reviews="reviews"
              :review-factor-params="tier.reviewFactorParams"
              @update-point-type="updatePointType"
              display-type="summary"
              :point-types="pointTypes"
            />
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-toolbar color="secondary">
            <v-card-title>
              <b>
                ピックアップTier
              </b>
            </v-card-title>
          </v-toolbar>
          <v-card
            class="scroll pa-1"
            flat
            min-height="30vh"
            max-height="50vh"
            color="thirdry"
          >
            <tier-list
              :tiers="tiers"
            />
          </v-card>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import RestApi from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierList from '@/components/TierList.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { useRoute } from 'vue-router'
import { ReviewFunc, ReviewPointType } from '@/common/review'
import { reviews as reviewsOrg, tier as tierOrg, tiers as tiersOrg } from '@/common/dummy'

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

    const isNotFound = ref(false)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        // URIにIDが含まれている場合
        RestApi.getUserData(route.params.id).then((res) => {
          dispName.value = res.data.name
          profile.value = res.data.profile
          iconUrl.value = res.data.iconUrl
        }).catch(() => {
          isNotFound.value = true
        })
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        isNotFound.value = true
      }
    })

    // テストデータ
    const reviews = ref(reviewsOrg)
    const tier = ref(tierOrg)
    const tiers = ref(tiersOrg)

    // ポイント表示方法のリスト
    const pointTypes = ref(ReviewFunc.getPointTypes(reviews.value))

    // ポイント表示方法の切り替えを子コンポーネントに提供する
    const updatePointType = (value: ReviewPointType, index: number) => {
      if (index >= 0 && index < reviews.value.length) {
        pointTypes.value[index] = value
      }
    }

    return {
      isNotFound,
      dispName,
      profile,
      iconUrl,
      reviews,
      tier,
      tiers,
      updatePointType,
      pointTypes
    }
  }
})
</script>

<style Modules>
.scroll {
  overflow-y: scroll;
}
</style>
