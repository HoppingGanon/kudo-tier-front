<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

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

  <padding-component v-else :target-user-id="userId" title="ユーザー">
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
              <v-spacer />
              <v-btn v-if="isSelf" @click="goSettings">
                <v-icon>
                  mdi-pencil-box-outline
                </v-icon>
                編集
              </v-btn>
            </v-toolbar>
            <profile-component
              :disp-name="user.name"
              :icon-url="user.iconUrl"
              :profile="user.profile"
              :tiers-count="user.tiersCount"
              :reviews-count="user.reviewsCount"
              :user-id="userId"
              :allow-twitter-link="user.allowTwitterLink"
              :twitter-id="user.twitterId"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <tier-review-search>
            <template v-slot:title>
              <v-card-title>投稿</v-card-title>
            </template>
          </tier-review-search>
        </v-col>
      </v-row>
    </v-container>
  </padding-component>

  <!-- ユーザーロード中の時のみ表示されるコンポーネント -->
  <loading-component :is-loading="isLoadingUser" :is-floating="true" :is-force="true" title="ユーザー情報の取得中..." />
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import RestApi, { Parser, toastError } from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import TierReviewSearch from '@/components/TierReviewSearch.vue'
import { useRoute } from 'vue-router'
import { Tier, ReviewWithParams } from '@/common/review'
import { emptyUser } from '@/common/dummy'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import { TierContentType } from '@/common/page'
import store from '@/store'

export default defineComponent({
  name: 'HomeView',
  components: {
    ProfileComponent,
    SessionChecker,
    ErrorComponent,
    PaddingComponent,
    LoadingComponent,
    TierReviewSearch
  },
  emits: {
    reload: () => true
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNotFound = ref(false)
    const user = ref(emptyUser)
    const userId = ref('')

    const pairs: Ref<ReviewWithParams[]> = ref([] as ReviewWithParams[])
    const tiers: Ref<Tier[]> = ref([] as Tier[])

    const isLoadingUser = ref(true)
    const isLoadingReviews = ref(true)
    const isLoadingTiers = ref(true)

    const isSelf = ref(false)

    const tab = ref(0)

    const reloadReviews = () => {
      RestApi.getReviewPairs(userId.value, '', 'updatedAtDesc', 1).then((res) => {
        pairs.value.splice(0)
        res.data.forEach((p) => {
          pairs.value.push(Parser.parseReviewWithParams(p))
        })
        reloadUser()
      }).catch((e) => {
        toastError(e, toast)
      }).finally(() => { isLoadingReviews.value = false })
    }

    const reloadTiers = () => {
      RestApi.getTierList(userId.value, '', 'updatedAtDesc', 1).then((res) => {
        const tierDataList = res.data
        tiers.value.splice(0)
        tierDataList.forEach((v) => {
          tiers.value.push(Parser.parseTier(v))
        })
        reloadUser()
      }).catch((e) => toastError(e, toast)).finally(() => { isLoadingTiers.value = false })

      // レビューもリロードする
      reloadReviews()
    }

    const reloadUser = () => {
      if (route.params.id && typeof route.params.id === 'string') {
        // URIにIDが含まれている場合、ユーザーの情報をダウンロード
        RestApi.getUserData(route.params.id).then((res) => {
          user.value = res.data
          isSelf.value = res.data.isSelf
        }).catch(() => {
          isNotFound.value = true
        }).finally(() => { isLoadingUser.value = false })
      }
    }

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        userId.value = route.params.id

        reloadUser()

        // 並行してTierもダウンロードする
        reloadTiers()

        // 並行してレビューもダウンロードする
        reloadReviews()
      } else if (store.getters.isRegistered) {
        // 自分のホームへリダイレクト
        router.replace(`/home/${store.state.userId}`)
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        router.push('/')
      }

      if (route.query.tab && typeof route.query.tab === 'string') {
        if (route.query.tab === 'tier' as TierContentType) {
          tab.value = 0
        } else if (route.query.tab === 'review') {
          tab.value = 1
        }
      }
    })

    const goTierSettings = () => {
      router.push('/tier-settings-new')
    }

    const goSettings = () => {
      router.push('/settings')
    }

    const goHome = (tab: TierContentType) => {
      router.push(`/home?tab=${tab}`)
    }

    return {
      isNotFound,
      user,
      userId,
      pairs,
      isLoadingUser,
      isLoadingReviews,
      isLoadingTiers,
      tiers,
      isSelf,
      tab,
      goTierSettings,
      goSettings,
      reloadTiers,
      reloadReviews,
      goHome
    }
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
</style>
