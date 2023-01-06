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
            id="reviewsWindow"
            class="scroll pa-1"
            flat
            :style="reviewWindowsStyle"
            color="thirdry"
          >
            <review-list
              :reviews="reviews"
              :review-factor-params="tier.reviewFactorParams"
              @update-point-type="updatePointType"
              :is-link="true"
              display-type="summary"
              :point-types="pointTypes"
            />
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-toolbar color="secondary" @click="goTierSearch" class="cursor-pointer">
            <v-card-title>
              <b>最新のTier</b>
              <v-icon>mdi-magnify</v-icon>
            </v-card-title>
          </v-toolbar>
          <v-card
            class="scroll pa-1"
            flat
            :style="reviewWindowsStyle"
            color="thirdry"
          >
            <v-card v-if="tiers.length == 0" height="40vh" class="flex-center">
              <div style="text-align: center;">
                Tierがありません<br />
                初めてのTierを作成しましょう<br />
                <v-btn color="primary" @click="goTierSettings">Tierを作成する</v-btn>
              </div>
            </v-card>
            <tier-list
              v-else
              :tiers="tiers"
              :is-link="true"
            />
          </v-card>
        </v-card>
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
import { onBeforeRouteLeave, useRoute } from 'vue-router'
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
    const reviewWindowsStyle = ref('height: 50vh')

    // テストデータ
    const reviews = ref(reviewsOrg)
    const tier = ref(tierOrg)

    const tiers = ref([] as Tier[])

    const onResize = () => {
      if (reviewsWindow.value) {
        reviewWindowsStyle.value = `height: -webkit-calc(100vh - ${reviewsWindow.value.getBoundingClientRect().top + 10}px)`
      }
    }

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
      onResize()
    })

    window.onresize = onResize

    // これがないとイベントが設定できない
    history.replaceState(null, '')

    // 去り際にイベントを削除
    onBeforeRouteLeave(() => {
      window.onresize = null
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
      reviewWindowsStyle,
      tier,
      tiers,
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
