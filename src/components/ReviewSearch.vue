<template>
  <v-container class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
    <v-row>
      <v-col>
        <search-component
          :model-value="text"
          :sort-item="sortItem"
          :sort-items="tierSortTypeList"
          @update="updateText"
          @update-sort-item="updateSortItem"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row v-if="pairs.length == 0 && !isLoading && !isWaiting">
      <v-col>
        <v-card flat>
          <span>
            レビューが存在しません
          </span>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <review-list
          :pairs="pairs"
          :is-link="true"
          display-type="summary"
          :review-factor-params="paramsList"
          :is-loading="isWaiting || isLoading"
          @reload="update(false)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, toRefs, watch } from 'vue'
import { ReviewWithParams } from '@/common/review'
import { tierSortTypeList, tierContentTypeList, TierSortType, SelectObject } from '@/common/page'
import SearchComponent from '@/components/SearchComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import RestApi, { Parser, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  name: 'TierSearch',
  components: {
    SearchComponent,
    ReviewList
  },
  props: {
    pairs: {
      type: Array as PropType<ReviewWithParams[]>,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    clearReviewsPair: () => true,
    addReviewsPair: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      pairs :ReviewWithParams[]) => true,
    updateReviewsPair: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      pairs :ReviewWithParams[]) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const text = ref('')
    const sortItem = ref(tierSortTypeList[0])
    const toast = useToast()

    /** 現在表示中のページ */
    const page = ref(1)
    /** 入力反映待機フラグ */
    const isInputing = ref(false)
    /** データ取得待ちフラグ */
    const isWaiting = ref(false)
    /** データ追加終了フラグ */
    const isStop = ref(false)

    /** 最後に読み込んだTierのID */
    const lastItemId = ref('')
    /** 最後に読み込んだTierの要素 */
    const lastItemElement = computed(() => document.getElementById(`rev${lastItemId.value}`))

    /** データ更新 */
    const update = (isInputed: boolean) => {
      if (props.userId === '') {
        // ユーザーID取得前に読み込まれた場合は処理終了
        return
      }
      isWaiting.value = true
      RestApi.getReviewPairs(props.userId, text.value, sortItem.value.value, 1).then((res) => {
        if (res.data.length !== 0) {
          // 取得件数1件以上
          emit('updateReviewsPair', res.data.map((pairs) => Parser.parseReviewWithParams(pairs)))
          lastItemId.value = res.data[res.data.length - 1].review.reviewId
          // データ追加を可能に
          isStop.value = false
          page.value = 1
        } else {
          // 取得件数が0ならデータ追加を不能に
          isStop.value = true
          emit('clearReviewsPair')
        }
        if (isInputed) {
          isInputing.value = false
        }
        // データ更新待ち状態を解除
        isWaiting.value = false
      }).catch((e) => {
        toastError(e, toast)
        // データ追加を不能に
        isStop.value = true
        if (isInputed) {
          isInputing.value = false
        }
        // データ更新待ち状態を解除
        isWaiting.value = false
      })
    }

    /** データ追加 */
    const add = () => {
      if (props.userId === '') {
        // ユーザーID取得前に読み込まれた場合は処理終了
        return
      }
      if (!isWaiting.value && !isStop.value && !isInputing.value) {
        // データ追加待ち状態にする
        isWaiting.value = true
        RestApi.getReviewPairs(props.userId, text.value, sortItem.value.value, page.value + 1).then((res) => {
          if (res.data.length !== 0) {
          // 取得件数1件以上
            emit('addReviewsPair', res.data.map((pairs) => Parser.parseReviewWithParams(pairs)))
            lastItemId.value = res.data[res.data.length - 1].review.reviewId
            page.value++
          } else {
            // 取得件数が0ならデータ追加を不能に
            isStop.value = true
          }
          // データ更新待ち状態を解除
          isWaiting.value = false
        }).catch((e) => {
          toastError(e, toast)
          // データ追加を不能に
          isStop.value = true
          // データ更新待ち状態を解除
          isWaiting.value = false
        })
      }
    }

    /** 検索ワードが変更されたか2秒まって検知する */
    const updateText = (v: string) => {
      isInputing.value = true
      text.value = v

      const preText = v
      setTimeout(() => {
        if (preText === text.value) {
          update(true)
        }
      }, 2000)
    }

    const updateSortItem = (v: SelectObject<TierSortType>) => {
      sortItem.value = v
      update(false)
    }

    const { userId } = toRefs(props)
    watch(userId, () => {
      update(false)
    })

    const onScroll = () => {
      if (lastItemElement.value) {
        if (lastItemElement.value.getBoundingClientRect().top - document.documentElement.clientHeight < 0) {
          add()
        }
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll)
    })

    // これがないとイベントが設定できない
    history.replaceState(null, '')

    // ページを離れた時にイベントを削除するように予定する
    onBeforeRouteLeave(() => {
      window.removeEventListener('scroll', onScroll)
    })

    return {
      text,
      tierSortTypeList,
      tierContentTypeList,
      updateText,
      sortItem,
      updateSortItem,
      isWaiting,
      update,
      reviews: computed(() => props.pairs.map((v) => v.review)),
      paramsList: computed(() => props.pairs.map((v) => v.params))
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
