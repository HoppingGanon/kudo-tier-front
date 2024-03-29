<!-- ユーザーのプロフィールを表示する -->

<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="isVertical" cols="12" sm="12" md="12" lg="12" xl="12">
        <div class="avatar-space">
          <v-avatar size="100%" @click="() => goHome()" class="cursor-pointer">
            <v-img v-if="imgSource" :src="imgSource" />
            <v-img v-else src="@/assets/common/nouserimage256.png" />
          </v-avatar>
        </div>
      </v-col>
      <v-col v-else cols="3" sm="2" md="2" lg="2" xl="2">
        <div>
          <v-avatar size="100%" @click="() => goHome()" class="cursor-pointer">
            <v-img v-if="imgSource" :src="imgSource" />
            <v-img v-else src="@/assets/common/nouserimage256.png" />
          </v-avatar>
        </div>
      </v-col>
      <v-col>
        <v-container class="pa-0 ma-0" fluid>
          <v-row>
            <v-col>
              <div :class="isSummary ? 'no-break-box' : 'text-h5'">
                <span class="font-weight-bold cursor-pointer" @click="() => goHome()" v-text="dispName"/>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span v-if="isSummary" class="text-subtitle-1 cursor-pointer">
                <span @click="goHome('tier')">Tier数: <span v-text="tiersCount" /></span><br/>
                <span @click="goHome('review')">レビュー数: <span v-text="reviewsCount" /></span>
              </span>
              <span v-else class="text-subtitle-1 cursor-pointer">
                <span @click="goHome('tier')">Tier数: <span v-text="tiersCount" /></span>
                <span @click="goHome('review')">レビュー数: <span v-text="reviewsCount" /></span>
              </span>
            </v-col>
          </v-row>
          <v-row v-if="allowTwitterLink && twitterId">
            <v-col>
              <v-btn @click="goTwitter" flat color="#00acee" class="text-no-transform pa-2">
                <v-icon class="mr-1" color="white">
                  mdi-twitter
                </v-icon>
                <span class="text-caption" style="color: white">
                  Twitter
                </span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="profile">
            <v-col class="mt-3">
              <div :class="isSummary ? 'no-break-box-2' : ''">
                <span v-text="profile" />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { PostContentType } from '@/common/page'
import router from '@/router'
import { getImgSource } from '@/common/restapi'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileComponent',
  props: {
    /** 表示名 */
    dispName: {
      type: String,
      default: ''
    },
    /** アイコンのURL */
    iconUrl: {
      type: String,
      default: ''
    },
    /** プロフィール文 */
    profile: {
      type: String,
      default: ''
    },
    /** 投稿したTierの数 */
    tiersCount: {
      type: Number,
      default: 0
    },
    /** 投稿したレビューの数 */
    reviewsCount: {
      type: Number,
      default: 0
    },
    /** 略式表示 */
    isSummary: {
      type: Boolean,
      default: false
    },
    /** 幅を減らして縦長の表示をする */
    isVertical: {
      type: Boolean,
      default: false
    },
    /** ユーザーID */
    userId: {
      type: String,
      required: true
    },
    /** Twitterボタンを表示する（TwitterIdが未指定の場合はボタンは表示されない） */
    allowTwitterLink: {
      type: Boolean,
      default: false
    },
    /** TwitterのID */
    twitterId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    return {
      imgSource: computed(() => getImgSource(props.iconUrl)),
      goHome: (tab?: PostContentType) => {
        if (tab) {
          router.push(`/home/${props.userId}?tab=${tab}`)
        } else {
          router.push(`/home/${props.userId}`)
        }
      },
      goTwitter: () => {
        window.open(`https://twitter.com/intent/user?user_id=${props.twitterId}`)
      }
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.avatar-space {
  aspect-ratio: 1;
  width: 64px;
}
</style>
