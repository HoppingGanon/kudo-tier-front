<template>
  <div v-if="type === 'tier'" class="empty text-center">
    Tierはまだ作成されていません。<br />
    <v-btn class="text-no-transform" color="primary" @click="goTierSettings">はじめてのTierを作成</v-btn>
  </div>
  <div v-else-if="type === 'review'" class="empty text-center">
    レビューはまだ作成されていません。<br />
    <v-btn class="text-no-transform" color="primary" @click="reviewDialog = true">はじめてのレビューを作成</v-btn>
  </div>
  <div v-else-if="type === 'reviewAndTier'" class="empty text-center">
    Tierはまだ作成されていません。<br />
    レビューを作成するにはまずTierを作成しましょう。<br />
    <v-btn class="text-no-transform" color="primary" @click="goTierSettings">はじめてのTierを作成</v-btn>
  </div>

  <simple-dialog
    v-model="reviewDialog"
    title="レビューの追加"
    text="レビューを追加したいTierを選んでください"
    :show-submit-button="false"
  >
    <quick-review @close="reviewDialog = false" />
  </simple-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import QuickReview from '@/components/QuickReview.vue'
import router from '@/router'

/**
 * このコンポーネントはtypeフラグ以外独立しているため、自分自身が表示している前提の挙動をする
 */
export default defineComponent({
  name: 'EmptyComponent',
  components: {
    SimpleDialog,
    QuickReview
  },
  props: {
    type: {
      /**
        Tierが空の場合にTierに表示する
        Reviewが空の場合にReviewに表示する
        Tierが空の場合にReviewに表示する
      */
      type: String as PropType<'tier' | 'review' | 'reviewAndTier'>,
      default: 'tier'
    }
  },
  setup () {
    const reviewDialog = ref(false)

    const goTierSettings = () => {
      router.push('/tier-settings-new')
    }
    return {
      reviewDialog,
      goTierSettings
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.empty {
  width: 100%;
}
</style>
