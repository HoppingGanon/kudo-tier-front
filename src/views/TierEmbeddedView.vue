
<!-- 外部のサイトから埋め込みタグでTierを表示するためのページ -->

<template>

  <!-- ユーザーロード中の時のみ表示されるコンポーネント -->
  <loading-component v-if="isLoading" :is-loading="isLoading" :is-floating="true" title="Tierを取得中..." />

  <!-- サイズ調整のためfluidは入れない -->
  <v-container v-else-if="isNotFound" class="pa-0">
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

  <tier-ranking
    v-else
    :tier="tier"
    :point-type="tier.pointType"
    :reviews="tier.reviews"
    :params="tier.reviewFactorParams"
    :no-menu-icon="true"
    :hide-bar="true"
    :direct-link="true"
    :theme="theme"
    :icon-size="iconSize"
    :text-size="textSize"
  />

</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from 'vue'
import { IconSize, IconSizeArray, PointDisplaySize, PointDisplaySizeArray, RankingTheme, RankingThemeArray, ReviewFunc } from '@/common/review'
import ErrorComponent from '@/components/ErrorComponent.vue'
import TierRanking from '@/components/TierRanking.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { emptyTier } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser } from '@/common/restapi'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { iconSizeList } from '@/common/page'

export default defineComponent({
  name: 'TierEmbeddedView',
  components: {
    ErrorComponent,
    LoadingComponent,
    TierRanking
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const route = useRoute()
    const display = useDisplay()
    const isNotFound = ref(true)
    const isLoading = ref(true)
    const tier = ref(ReviewFunc.cloneTier(emptyTier))

    const iconSizeQuery: Ref<IconSize | undefined> = ref(undefined)
    const iconSize = computed(() => {
      if (iconSizeQuery.value === undefined) {
        if (display.xl.value) {
          return iconSizeList[1].value
        } else if (display.lg.value) {
          return iconSizeList[1].value
        } else if (display.md.value) {
          return iconSizeList[1].value
        } else if (display.sm.value) {
          return iconSizeList[2].value
        } else if (display.xs.value) {
          return iconSizeList[2].value
        } else {
          return iconSizeList[0].value
        }
      } else {
        return iconSizeQuery.value
      }
    })
    const theme = ref('light' as RankingTheme)
    const textSize = ref('large2' as PointDisplaySize)

    // tierの初期値を設定
    onMounted(() => {
      if (route.params.tid && typeof route.params.tid === 'string') {
        // URIにIDが含まれている場合
        RestApi.getTier(route.params.tid).then((res) => {
          tier.value = Parser.parseTier(res.data)
          isNotFound.value = false
          // 重みを考慮した合計点を算出する
          tier.value.reviews.sort((review1, review2) => {
            return ReviewFunc.calcSum(review2, tier.value.reviewFactorParams) - ReviewFunc.calcSum(review1, tier.value.reviewFactorParams)
          })
        }).catch(() => {
          isNotFound.value = true
          isLoading.value = false
        }).finally(() => { isLoading.value = false })
      }

      if (route.query.iconsize && typeof route.query.iconsize === 'string' && (IconSizeArray as string[]).includes(route.query.iconsize)) {
        iconSizeQuery.value = route.query.iconsize
      }

      if (route.query.textsize && typeof route.query.textsize === 'string' && route.query.textsize && (PointDisplaySizeArray as string[]).includes(route.query.textsize)) {
        textSize.value = route.query.textsize
      }

      if (route.query.theme && typeof route.query.theme === 'string' && route.query.theme && (RankingThemeArray as string[]).includes(route.query.theme)) {
        theme.value = route.query.theme
      }
    })

    return {
      isNotFound,
      isLoading,
      tier,
      textSize,
      iconSize,
      theme
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
