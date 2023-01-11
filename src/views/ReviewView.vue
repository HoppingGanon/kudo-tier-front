<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container v-if="isNotFound" class="pa-0">
    <v-row>
      <v-col>
        <v-card>
          <error-component
            comment="レビューが見つかりません"
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
          <menu-button :items="menuItems" @select="goThere" :return-object="true">
            <template v-slot:button="{ open, props }">
              <v-btn @click="open" v-bind="props" icon flat>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </menu-button>
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
    <simple-dialog
      v-model="delDialog"
      title="レビューの削除"
      text="本当にレビューを削除しますか？"
      submit-button-text="削除"
      @submit="deleteReview"
    />
  </padding-component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { ReviewFactorParam, ReviewFunc, ReviewPointType } from '@/common/review'
import ReviewComponent from '@/components/ReviewComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import { emptyReviwew } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import store from '@/store'
import router from '@/router'
import { SelectObject } from '@/common/page'

export default defineComponent({
  name: 'ReviewView',
  components: {
    ReviewComponent,
    ErrorComponent,
    SessionChecker,
    PaddingComponent,
    MenuButton,
    SimpleDialog
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

    const menuItems: SelectObject[] = [
      {
        value: 'original',
        text: '元のTierを開く',
        icon: 'mdi-book-plus-outline'
      },
      {
        value: 'edit',
        text: 'レビューを編集',
        icon: 'mdi-pencil-box-outline'
      },
      {
        value: 'delete',
        text: 'レビューを削除',
        icon: 'mdi-trash-can'
      }
    ]

    const goThere = (page: SelectObject) => {
      switch (page.value) {
        case 'original':
          router.push(`/tier/${review.value.tierId}`)
          break
        case 'edit':
          router.push(`/review-settings-new/${review.value.reviewId}`)
          break
        case 'delete':
          delDialog.value = true
          break
      }
    }

    const deleteReview = () => {
      RestApi.deleteReview(review.value.reviewId).then(() => {
        toast.success('レビューを削除しました')
        router.push(`/tier/${review.value.tierId}`)
      }).catch((e) => {
        toastError(e, toast)
      })
    }

    const delDialog = ref(false)

    return {
      review,
      params,
      pointType,
      userId,
      isNotFound,
      isSelf,
      updatePointType,
      menuItems,
      goThere,
      delDialog,
      deleteReview
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
