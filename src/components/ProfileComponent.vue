<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="isVertical" cols="12" sm="12" md="12" lg="12" xl="12">
        <div class="avatar-space">
          <v-avatar size="100%" @click="goHome" class="cursor-pointer">
            <v-img :src="getImgSource(iconUrl)" />
          </v-avatar>
        </div>
      </v-col>
      <v-col v-else cols="3" sm="2" md="2" lg="2" xl="2">
        <div>
          <v-avatar size="100%" @click="goHome" class="cursor-pointer">
            <v-img :src="getImgSource(iconUrl)" />
          </v-avatar>
        </div>
      </v-col>
      <v-col>
        <v-container class="pa-0 ma-0" fluid>
          <v-row>
            <v-col>
              <div :class="isSummary ? 'no-break-box' : 'text-h5'">
                <span class="font-weight-bold cursor-pointer" @click="goHome" v-text="dispName"/>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span v-if="isSummary" class="text-subtitle-1 cursor-pointer">
                <span @click="goTierSearch('tier')">Tier数: <span v-text="tierCount" /></span><br/>
                <span @click="goTierSearch('review')">レビュー数: <span v-text="reviewCount" /></span>
              </span>
              <span v-else class="text-subtitle-1 cursor-pointer">
                <span @click="goTierSearch('tier')">Tier数: <span v-text="tierCount" /></span>
                <span @click="goTierSearch('review')">レビュー数: <span v-text="reviewCount" /></span>
              </span>
            </v-col>
          </v-row>
          <v-row v-if="allowTwitterLink">
            <v-col>
              <v-btn @click="goTwitter" flat color="#00acee" style="text-transform: none">
                <v-icon class="mr-1" color="white">
                  mdi-twitter
                </v-icon>
                <span class="text-caption" style="color: white">
                  Twitter
                </span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
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
import { TierContentType } from '@/common/page'
import router from '@/router'
import { getImgSource } from '@/common/restapi'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileComponent',
  components: { },
  props: {
    dispName: {
      type: String,
      default: ''
    },
    iconUrl: {
      type: String,
      default: ''
    },
    profile: {
      type: String,
      default: ''
    },
    tierCount: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isSummary: {
      type: Boolean,
      default: false
    },
    isVertical: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: true
    },
    allowTwitterLink: {
      type: Boolean,
      default: false
    },
    twitterName: {
      type: String,
      default: ''
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props) {
    return {
      getImgSource,
      goHome: () => {
        router.push(`/home/${props.userId}`)
      },
      goTierSearch: (tab: TierContentType) => {
        router.push(`/tier-search/${props.userId}?tab=${tab}`)
      },
      goTwitter: () => {
        window.open(`https://twitter.com/intent/user?user_id=${props.twitterName}`)
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
