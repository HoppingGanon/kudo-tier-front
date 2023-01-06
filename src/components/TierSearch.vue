<template>
  <v-container class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
    <v-row>
      <v-col>
        <search-component
          :model-value="text"
          :sort-item="sortItem"
          :target-item="targetItem"
          :sort-items="tierSortTypeList"
          :target-items="tierContentTypeList"
          @update="updateText"
          @update-sort-item="updateSortItem"
          @update-target-item="updateTargetItem"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row v-if="tiers.length == 0">
      <v-col>
        <v-card flat>
          <span>
            Tierが存在しません
          </span>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <tier-list :tiers="tiers" :is-link="true" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { Tier } from '@/common/review'
import { tierSortTypeList, tierContentTypeList, TierSortType, TierContentType, SelectObject } from '@/common/page'
import TierList from '@/components/TierList.vue'
import SearchComponent from '@/components/SearchComponent.vue'
import RestApi, { Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  name: 'TierSearch',
  components: {
    SearchComponent,
    TierList
  },
  props: {
    tiers: {
      type: Array as PropType<Tier[]>,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  emits: {
    clearTiers: () => true,
    addTiers: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tiers: Tier[]) => true,
    updateTiers: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tiers: Tier[]) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const text = ref('')
    const sortItem = ref(tierSortTypeList[0])
    const targetItem = ref(tierContentTypeList[0])
    const toast = useToast()

    /** 現在表示中のページ */
    const page = ref(1)
    /** 入力反映待機フラグ */
    const isInputing = ref(false)
    /** データ取得待ちフラグ */
    const isWaiting = ref(false)
    /** データ追加終了フラグ */
    const isStop = ref(false)

    /** データ更新 */
    const update = (isInputed: boolean) => {
      RestApi.getTierList(props.userId, text.value, sortItem.value.value, 1).then((res) => {
        if (res.data.length !== 0) {
          // 取得件数1件以上
          const tiers: Tier[] = []
          res.data.forEach((v) => {
            tiers.push(Parser.parseTier(v))
          })
          emit('updateTiers', tiers)
          // データ追加を可能に
          isStop.value = false
          page.value = 1
        } else {
          // 取得件数が0ならデータ追加を不能に
          isStop.value = true
          emit('clearTiers')
        }
        if (isInputed) {
          isInputing.value = false
        }
      }).catch((e) => {
        const v = e.response.data
        toast.error(`${v.message} (${v.code})`)
        // データ追加を不能に
        isStop.value = true
        if (isInputed) {
          isInputing.value = false
        }
      })
    }

    /** データ追加 */
    const add = () => {
      if (!isWaiting.value && !isStop.value && !isInputing.value) {
        // データ追加待ち状態にする
        isWaiting.value = true
        RestApi.getTierList(props.userId, text.value, sortItem.value.value, page.value + 1).then((res) => {
          if (res.data.length !== 0) {
            // 取得件数1件以上
            const tiers: Tier[] = []
            res.data.forEach((v) => {
              tiers.push(Parser.parseTier(v))
            })
            emit('addTiers', tiers)
            page.value++
          } else {
            // 取得件数が0ならデータ追加を不能に
            isStop.value = true
          }
          // データ更新待ち状態を解除
          isWaiting.value = false
        }).catch((e) => {
          const v = e.response.data
          toast.error(`${v.message} (${v.code})`)
          // データ追加を不能に
          isStop.value = true
        })
      }
    }

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

    const updateTargetItem = (v: SelectObject<TierContentType>) => {
      targetItem.value = v
      update(false)
    }

    onMounted(() => {
      window.addEventListener('scroll', () => {
        if (window.scrollY > (document.documentElement.scrollHeight - document.documentElement.clientHeight - 100)) {
          add()
        }
      })
    })

    // これがないとイベントが設定できない
    history.replaceState(null, '')

    // ページを離れた時にイベントを削除するように予定する
    onBeforeRouteLeave(() => {
      window.addEventListener('scroll', () => true)
    })

    return {
      text,
      tierSortTypeList,
      tierContentTypeList,
      updateText,
      sortItem,
      targetItem,
      updateSortItem,
      updateTargetItem
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
