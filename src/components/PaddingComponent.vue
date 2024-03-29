<!-- 余白をユーザー情報やその他の情報で埋めるコンポーネント -->
<!-- 左側にはv-slot:leftの内容、右側にはユーザー情報を表示 -->
<!-- 画面サイズが足りない場合は、左右のコンポーネントは下部へフローティングする -->
<template>
  <v-container class="ma-0 pa-1" fluid>
    <v-row>
      <v-col v-if="$vuetify.display.lg || $vuetify.display.xl" cols="0" sm="0" md="0" lg="3" xl="3">
        <slot name="left">
        </slot>
      </v-col>
      <v-col cols="12" sm="12" md="9" lg="6" xl="6">
        <slot>
          コンポーネントがありません
        </slot>
      </v-col>
      <v-col v-if="$vuetify.display.xs || $vuetify.display.sm" cols="12" sm="12" md="0" lg="0" xl="0">
        <slot name="left">
        </slot>
      </v-col>
      <v-col cols="12" sm="12" md="3" lg="3" xl="3">

        <!-- ユーザー情報 -->
        <v-container v-if="targetUserId" fluid class="ma-0 pa-0">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <v-card>
                <v-toolbar class="pl-2" color="thirdry">
                  <b v-text="title">
                  </b>
                </v-toolbar>
                <profile-component
                  :disp-name="targetUser.name"
                  :profile="targetUser.profile"
                  :icon-url="targetUser.iconUrl"
                  :tiers-count="targetUser.tiersCount"
                  :reviews-count="targetUser.reviewsCount"
                  :is-summary="true"
                  :user-id="targetUserId || ''"
                  :is-vertical="$vuetify.display.md || $vuetify.display.lg || $vuetify.display.xl"
                  :allow-twitter-link="targetUser.allowTwitterLink"
                  :twitter-id="targetUser.twitterId"
                />
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="12" lg="12" xl="12">
              <v-card height="100%">
                <v-toolbar class="pl-2" color="thirdry">
                  <span class="font-weight-bold no-break-box" v-text="'最近投稿したTier'"></span>
                </v-toolbar>
                <v-list>
                  <v-list-item v-for="tier, i of tiers" :key="i" class="mb-1" @click="goTier(tier.id)">
                    <template v-slot:prepend>
                      <b v-text="'・'"></b>
                    </template>
                    <div class="no-break-box-2">
                      <span v-text="tier.name"></span>
                    </div>
                  </v-list-item>
                  <v-list-item>
                    <v-btn flat @click="goHome('tier')">もっと見る</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="12" lg="12" xl="12">
              <v-card height="100%">
                <v-toolbar class="pl-2" color="thirdry">
                  <span class="font-weight-bold no-break-box" v-text="'最近投稿したレビュー'"></span>
                </v-toolbar>
                <v-list>
                  <v-list-item v-for="review, i of reviews" :key="i" class="mb-1" @click="goReview(review.id)">
                    <template v-slot:prepend>
                      <b v-text="'・'"></b>
                    </template>
                    <div class="no-break-box-2">
                      <span v-text="review.name"></span>
                    </div>
                  </v-list-item>
                  <v-list-item>
                    <v-btn flat @click="goHome('review')">もっと見る</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col v-if="$vuetify.display.md" cols="0" sm="0" md="12" lg="0" xl="0">
        <slot name="left">
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import RestApi, { toastError, PostListItem } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { emptyUser } from '@/common/dummy'
import router from '@/router'
import { PostContentType } from '@/common/page'

export default defineComponent({
  name: 'PaddingComponent',
  components: {
    ProfileComponent
  },
  props: {
    /** ユーザー情報欄に表示するタイトル */
    title: {
      type: String,
      default: 'この投稿を作成したユーザー'
    },
    /** ターゲットにするユーザーID */
    targetUserId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const toast = useToast()
    const tiers = ref([] as PostListItem[])
    const reviews = ref([] as PostListItem[])
    const isNotFound = ref(true)
    const targetUser = ref(emptyUser)

    const download = () => {
      if (targetUserId.value !== '') {
        RestApi.getUserData(targetUserId.value).then((res) => {
          targetUser.value = res.data
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
    }
    const { targetUserId } = toRefs(props)

    // 描画時とUserID変更時にユーザーデータをダウンロードする
    onMounted(() => {
      download()
    })
    watch(targetUserId, download)

    const goHome = (tab: PostContentType) => {
      router.push(`/home/${targetUserId.value}?tab=${tab}`)
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
      goHome,
      goTier,
      goReview
    }
  }
})
</script>

<style scoped>
</style>
