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
          <v-card>
            <v-toolbar color="secondary">
              <v-card-title>
                投稿
              </v-card-title>
              <div class="d-flex flex-row-reverse" style="width: 100%">
                <v-btn @click="goSearch(tab === 0 ? 'tier' : 'review')">
                  <v-icon>mdi-magnify</v-icon>検索
                </v-btn>
                <v-btn v-if="isSelf" @click="goTierSettings" class="text-no-transform">
                  <v-icon>mdi-plus</v-icon>Tierを追加
                </v-btn>
              </div>
              <template v-slot:extension>
                <v-tabs v-model="tab" centered slider-color="primary" grow>
                  <v-tab class="text-no-transform">
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
                <v-card v-if="tiers.length === 0 && !isLoadingTiers" height="40vh" class="flex-center pa-1" flat>
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
                  :is-loading="isLoadingTiers"
                  @reload="reloadTiers"
                />
                <v-card v-if="tiers.length !== 0" flat class="pa-3 mb-3 d-flex flex-row-reverse cursor-pointer" @click="goSearch('tier')">
                  もっと投稿を見る
                </v-card>
              </v-card>
            </v-card>

            <v-card v-show="tab === 1">
              <v-card
                flat
              >
                <v-card v-if="tiers.length === 0 && pairs.length === 0 && !isLoadingReviews" height="40vh" class="flex-center pa-1" flat>
                  <div style="text-align: center;">
                    レビューがありません<br />
                    レビューを作成するにはまずはTierを作成しましょう<br />
                    <v-btn color="primary" @click="goTierSettings">Tierを作成する</v-btn>
                  </div>
                </v-card>
                <v-card v-else-if="tiers.length !== 0 && pairs.length === 0 && !isLoadingReviews" height="40vh" class="flex-center pa-1">
                  <div style="text-align: center;">
                    レビューがありません<br />
                    Tierからレビューを追加しましょう<br />
                    <v-btn color="primary" @click="goSearch('tier')">Tierを表示する</v-btn>
                  </div>
                </v-card>
                <review-list
                  v-else
                  class="pa-1"
                  :pairs="pairs"
                  :is-link="true"
                  display-type="summary"
                  :is-loading="isLoadingReviews"
                  @reload="reloadReviews"
                />
                <v-card v-if="pairs.length !== 0" flat class="pa-3 mb-3 d-flex flex-row-reverse cursor-pointer" @click="goSearch('review')">
                  もっと投稿を見る
                </v-card>
              </v-card>
            </v-card>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </padding-component>

  <!-- ユーザーロード中の時のみ表示されるコンポーネント -->
  <loading-component v-if="isLoadingUser" :is-loading="true" :is-floating="true" title="情報の取得中..." />
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import RestApi, { Parser, toastError } from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierList from '@/components/TierList.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
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
    ReviewList,
    TierList,
    PaddingComponent,
    LoadingComponent
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
        router.push(`/home/${store.state.userId}`)
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        router.push('/')
      }
    })

    const goSearch = (tab: TierContentType) => {
      router.push(`/tier-search/${userId.value}?tab=${tab}`)
    }

    const goTierSettings = () => {
      router.push('/tier-settings-new')
    }

    const goSettings = () => {
      router.push('/settings')
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
      goSearch,
      goTierSettings,
      goSettings,
      reloadTiers,
      reloadReviews
    }
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
</style>
