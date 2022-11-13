<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="false" />

  <error-card
    v-if="isNotFound"
    class="ma-3"
    comment="指定したIDのホーム画面は存在しません"
  />

  <v-container v-else>
    <v-row>
      <v-col>
        <profile-component
          :disp-name="dispName"
          :icon-url="iconUrl"
          :profile="profile"
        />
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
            class="scroll"
            flat
            min-height="360px"
            max-height="400px"
          >
            <review-list
              :reviews="reviews"
              :review-factor-params="tier.reviewFactorParams"
              @update-point-type="updatePointType"
              display-type="summary"
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
            class="scroll"
            flat
            min-height="360px"
            max-height="400px"
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
import restApi from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierList from '@/components/TierList.vue'
import ErrorCard from '@/components/ErrorCard.vue'
import { useRoute } from 'vue-router'
import { ReviewPointType } from '@/common/review'
import { reviews as reviewsOrg, tier as tierOrg, tiers as tiersOrg } from '@/common/dummy'

export default defineComponent({
  name: 'HomeView',
  components: {
    ProfileComponent,
    SessionChecker,
    ErrorCard,
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
        restApi.getUserData(route.params.id).then((res) => {
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

    // ポイント表示方法の切り替えを子コンポーネントに提供する
    const updatePointType = (value: ReviewPointType, index: number) => {
      if (index >= 0 && index < reviews.value.length) {
        reviews.value[index].pointType = value
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
      updatePointType
    }
  }
})
</script>

<style Modules>
.scroll {
  overflow-y: scroll;
}
</style>
