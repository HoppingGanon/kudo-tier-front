<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <v-col v-if="loading">
        <loading-component :is-loading="loading" title="レビューを取得しています..."></loading-component>
      </v-col>
      <v-col v-else-if="posts.tiers.length !== 0">
        <div>
          直近20件までのTierを表示しています。<br>
          ここに表示されていないTierについては
          <v-btn @click="goHome" flat class="pl-1 pr-1">
            <v-icon>mdi-home-account</v-icon>
            ホーム
          </v-btn>
          からお探しください
        </div>
        <div style="width: 100%;">
          <v-list width="100%" height="320px" >
            <v-list-item v-for="tier, i of posts.tiers" :key="i" @click="() => goReviewSettings(tier.id)">
              <v-icon class="mr-4">mdi-table</v-icon>
              <span v-text="tier.name"></span>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
      <v-col v-else class="text-center ">
        Tierはまだ作成されていません。<br />
        レビューを作成するにはまずTierを作成しましょう。<br />
        <v-btn class="text-no-transform" color="primary" @click="goTierSettings">はじめてのTierを作成</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import RestApi, { PostListsData, toastError } from '@/common/restapi'
import LoadingComponent from '@/components/LoadingComponent.vue'
import store from '@/store'
import { defineComponent, onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import router from '@/router'

/**
 * このコンポーネントはcloseイベント以外独立しているため、自分自身が表示している前提の挙動をする
 */
export default defineComponent({
  name: 'QuickReview',
  components: {
    LoadingComponent
  },
  emits: {
    close: () => true
  },
  setup (_, { emit }) {
    const posts = ref<PostListsData>({
      reviews: [],
      tiers: []
    })
    const toast = useToast()
    const loading = ref(true)

    const goHome = () => {
      router.push('/home')
      emit('close')
    }

    const goReviewSettings = (tid: string) => {
      router.push(`/review-settings-new/${tid}`)
      emit('close')
    }

    const goTierSettings = () => {
      router.push('/tier-settings-new')
      emit('close')
    }

    onMounted(() => {
      RestApi.getLatestPostLists(store.state.userId, 10).then((res) => {
        posts.value = res.data
      }).catch((err) => toastError(err, toast)).finally(() => {
        loading.value = false
      })
    })

    return {
      loading,
      posts,
      goHome,
      goReviewSettings,
      goTierSettings
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
