<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container v-if="isNotFound" class="pa-0">
    <v-row>
      <v-col>
        <v-card>
          <error-component
            comment="Tierが見つかりません"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <padding-component v-else :target-user-id="userId">
    <v-container class="pa-0">
      <v-card class="block-center" max-width="1080px">
        <v-toolbar color="secondary" dark>
          <v-card-title>
            レビュー
          </v-card-title>
          <v-spacer />
          <v-card-actions v-if="isSelf">
            <v-btn class="mt-3 mr-3" @click="goTier">
              <v-icon>
                mdi-book-plus-outline
              </v-icon>
              レビューを追加する
            </v-btn>
            <v-btn class="mt-3 mr-3" @click="edit">
              <v-icon>
                mdi-pencil-box-outline
              </v-icon>
              Tierを編集する
            </v-btn>
          </v-card-actions>
        </v-toolbar>

        <review-component
          class="pa-1"
          :review="review"
          :review-factor-params="params"
          :point-type="pointType"
          @update-point-type="updatePointType"
          display-type="all"
          point-display-type="normal"
        />
      </v-card>
    </v-container>
  </padding-component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { ReviewFactorParam, ReviewFunc, ReviewPointType } from '@/common/review'
import ReviewComponent from '@/components/ReviewComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import { emptyReviwew, emptyTier } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import store from '@/store'
import router from '@/router'

export default defineComponent({
  name: 'ReviewView',
  components: {
    ReviewComponent,
    ErrorComponent,
    SessionChecker,
    PaddingComponent
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(false)
    const isSelf = ref(false)
    const userId = ref('')

    const review = ref(ReviewFunc.cloneReview(emptyReviwew))
    const params = ref([] as ReviewFactorParam[])
    const pointType = ref('stars' as ReviewPointType)
    const updatePointType = (v: ReviewPointType) => {
      pointType.value = v
    }

    // レビューの初期値を設定
    onMounted(() => {
      if (route.params.rid && typeof route.params.rid === 'string') {
        // URIにIDが含まれている場合
        RestApi.getReview(route.params.rid).then((res) => {
          review.value = Parser.parseReview(res.data.review)
          params.value = res.data.params
          pointType.value = review.value.pointType || 'point'
          userId.value = review.value.userId
          isNotFound.value = false
        }).catch((e) => {
          const v = e.response.data
          toast.warning(`${v.message} (${v.code})`)
          isNotFound.value = true
        })
        // 自身のレビューを表示している場合
        isSelf.value = route.params.uid === store.state.userId
      }
    })

    const edit = () => {
      if (!isNotFound.value && isSelf.value) {
        router.push(`/review-settings/${route.params.rid}`)
      }
    }

    const goTier = () => {
      router.push(`/review/${review.value.tierId}`)
    }

    return {
      review,
      params,
      pointType,
      userId,
      isNotFound,
      isSelf,
      updatePointType,
      edit,
      goTier
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
