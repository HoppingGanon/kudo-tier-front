<template>
  <v-container class="ma-0 pa-1" fluid>
    <v-row>
      <v-col v-if="!$vuetify.display.xs && !$vuetify.display.sm && !$vuetify.display.md" cols="0" sm="0" md="0" lg="2" xl="3">
        <v-container v-if="userId" fluid class="ma-0 pa-0">
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar class="pl-2">
                  ユーザーの情報
                </v-toolbar>
                <v-list>
                  <v-list-item>
                    投稿
                    <v-list-item>
                      a
                    </v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="9" lg="8" xl="6">
        <slot>
          コンポーネントがありません
        </slot>
      </v-col>
      <v-col v-if="!$vuetify.display.xs && !$vuetify.display.sm" cols="0" sm="0" md="3" lg="2" xl="2">
        <v-container v-if="targetUserId" fluid class="ma-0 pa-0">
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar class="pl-2" color="thirdry">
                  <b v-text="title">
                  </b>
                </v-toolbar>
                <profile-component
                  :disp-name="targetUser.name"
                  :profile="targetUser.profile"
                  :icon-url="targetUser.iconUrl"
                  :tier-count="targetUser.tierCount"
                  :review-count="targetUser.reviewCount"
                  :is-summary="true"
                  :user-id="targetUserId || ''"
                  :is-vertical="true"
                />
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar class="pl-2" color="thirdry">
                  <span class="font-weight-bold no-break-box" v-text="`最新のTier(${targetUser.name})`"></span>
                </v-toolbar>
                <v-list>
                  <v-list-item v-for="tier, i of tiers" :key="i" class="mb-1">
                    <template v-slot:prepend>
                      <b v-text="'・'"></b>
                    </template>
                    <div class="no-break-box-2 cursor-pointer" @click="goTier(tier.id)">
                      <span v-text="tier.name"></span>
                    </div>
                  </v-list-item>
                  <v-list-item>
                    <v-btn flat @click="goTierSearch('tier')">もっと見る</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar class="pl-2" color="thirdry">
                  <span class="font-weight-bold no-break-box" v-text="`最新のレビュー(${targetUser.name})`"></span>
                </v-toolbar>
                <v-list>
                  <v-list-item v-for="review, i of reviews" :key="i" class="mb-1">
                    <template v-slot:prepend>
                      <b v-text="'・'"></b>
                    </template>
                    <div class="no-break-box-2 cursor-pointer" @click="goReview(review.id)">
                      <span v-text="review.name"></span>
                    </div>
                  </v-list-item>
                  <v-list-item>
                    <v-btn flat @click="goTierSearch('review')">もっと見る</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import RestApi, { toastError, PostListItem } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { emptyUser } from '@/common/dummy'
import router from '@/router'
import { TierContentType } from '@/common/page'

export default defineComponent({
  name: 'PaddingComponent',
  components: {
    ProfileComponent
  },
  props: {
    title: {
      type: String,
      default: 'ユーザーの情報'
    },
    userId: {
      type: String
    },
    targetUserId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const toast = useToast()
    const tiers = ref([] as PostListItem[])
    const reviews = ref([] as PostListItem[])
    const isNotFound = ref(true)
    const targetUser = ref(emptyUser)

    const { targetUserId } = toRefs(props)
    watch(targetUserId, () => {
      if (targetUserId.value !== '') {
        RestApi.getUserData(targetUserId.value).then((res) => {
          targetUser.value = {
            name: res.data.name,
            profile: res.data.profile,
            iconUrl: res.data.iconUrl,
            twitterName: res.data.twitterName,
            tierCount: res.data.tierCount,
            reviewCount: res.data.reviewCount
          }
          isNotFound.value = false
        }).catch(() => {
          isNotFound.value = true
        })
        // 投稿リストを取得
        RestApi.getLatestPostLists(targetUserId.value, 5).then((res) => {
          tiers.value = res.data.tiers
          reviews.value = res.data.reviews
        }).catch((e) => toastError(e, toast))
      }
    })

    const goTierSearch = (tab: TierContentType) => {
      router.push(`/tier-search/${targetUserId.value}?tab=${tab}`)
    }

    const goTier = (id: string) => {
      router.push(`/tier/${id}`)
    }

    const goReview = (id: string) => {
      router.push(`/review/${id}`)
    }

    return {
      tiers,
      reviews,
      targetUser,
      isNotFound,
      goTierSearch,
      goTier,
      goReview
    }
  }
})
</script>

<style scoped>
</style>
