<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <!-- サイズ調整のためfluidは入れない -->
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

  <padding-component v-else :target-user-id="tier.userId">
    <v-container fluid class="pa-0 ma-0">
      <v-card class="block-center">
        <v-toolbar color="secondary" dark>
          <v-card-title>
            Tier
          </v-card-title>
          <v-spacer />
          <v-card-actions v-if="isSelf">
            <menu-button :items="menuItems" @select="goThere" :return-object="true">
              <template v-slot:button="{ open, props }">
                <v-btn @click="open" v-bind="props" icon flat>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
            </menu-button>
          </v-card-actions>
        </v-toolbar>

        <tier-component
          class="pa-1"
          :tier="tier"
          :point-type="pointType"
          @update-point-type="updatePointType"
          display-type="all"
        />
      </v-card>
    </v-container>
  </padding-component>
  <simple-dialog
    v-model="delDialog"
    title="Tierの削除"
    text="本当にTierを削除しますか？"
    submit-button-text="削除"
    @submit="deleteTier"
  />

  <!-- ユーザーロード中の時のみ表示されるコンポーネント -->
  <loading-component v-if="isLoading" :is-loading="true" :is-floating="true"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { ReviewFunc, ReviewPointType } from '@/common/review'
import TierComponent from '@/components/TierComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { emptyTier } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import store from '@/store'
import router from '@/router'
import { SelectObject } from '@/common/page'

export default defineComponent({
  name: 'TierView',
  components: {
    TierComponent,
    ErrorComponent,
    SessionChecker,
    PaddingComponent,
    MenuButton,
    SimpleDialog,
    LoadingComponent
  },
  props: {},
  emits: {},
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(false)
    const isSelf = ref(false)
    const isLoading = ref(true)

    const tier = ref(ReviewFunc.cloneTier(emptyTier))
    const pointType = ref('stars' as ReviewPointType)
    const updatePointType = (v: ReviewPointType) => {
      pointType.value = v
    }

    // tierの初期値を設定
    onMounted(() => {
      if (route.params.tid && typeof route.params.tid === 'string') {
        // URIにIDが含まれている場合
        RestApi.getTier(route.params.tid).then((res) => {
          tier.value = Parser.parseTier(res.data)
          pointType.value = tier.value.pointType
          isNotFound.value = false
          // 自身のTierを表示している場合
          isSelf.value = tier.value.userId === store.state.userId
          // 重みを考慮した合計点を算出する
          tier.value.reviews.sort((review1, review2) => {
            return ReviewFunc.calcSum(review2, tier.value.reviewFactorParams) - ReviewFunc.calcSum(review1, tier.value.reviewFactorParams)
          })
        }).catch((e) => {
          isNotFound.value = true
          isLoading.value = false
          toastError(e, toast)
        }).finally(() => { isLoading.value = false })
      }
    })

    const edit = () => {
      if (!isNotFound.value && isSelf.value) {
        router.push(`/tier-settings/${route.params.tid}`)
      }
    }

    const goReviewSettings = () => {
      router.push(`/review-settings-new/${route.params.tid}`)
    }

    const menuItems: SelectObject[] = [
      {
        value: 'add',
        text: 'レビューを追加',
        icon: 'mdi-book-plus-outline'
      },
      {
        value: 'edit',
        text: 'Tierを編集',
        icon: 'mdi-pencil-box-outline'
      },
      {
        value: 'delete',
        text: 'Tierを削除',
        icon: 'mdi-trash-can'
      }
    ]

    const deleteTier = () => {
      RestApi.deleteTier(tier.value.tierId).then(() => {
        toast.success('レビューを削除しました')
        router.push(`/home/${tier.value.userId}`)
      }).catch((e) => {
        toastError(e, toast)
      })
    }

    const delDialog = ref(false)

    const goThere = (page: SelectObject) => {
      switch (page.value) {
        case 'add':
          router.push(`/review-settings-new/${route.params.tid}`)
          break
        case 'edit':
          router.push(`/tier-settings/${route.params.tid}`)
          break
        case 'delete':
          delDialog.value = true
          break
      }
    }

    return {
      tier,
      pointType,
      isNotFound,
      isSelf,
      isLoading,
      updatePointType,
      edit,
      goReviewSettings,
      menuItems,
      deleteTier,
      delDialog,
      goThere
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
