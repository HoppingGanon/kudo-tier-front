<template>
  <v-card flat>
    <v-toolbar
      color="secondary"
      dark
    >
      <!-- 表示形式を変更したりするためのメニューバー -->
      <v-toolbar-title v-if="!noMenuIcon">
        <point-type-selector
          :model-value="pointType"
          @update="updatePointTypeProxy"
        />

        <v-dialog v-model="weightMenu" class="ml-1 mr-1" :fullscreen="$vuetify.display.mobile">
          <template v-slot:activator="{ props}">
            <v-btn icon flat @click="weightMenu = true" v-bind="props">
              <v-icon>
                mdi-weight
              </v-icon>
            </v-btn>
          </template>
          <v-container class="ma-0 pa-0">
            <v-card class="block-center card-h">
              <v-toolbar
                color="secondary"
                dark
              >
                <v-toolbar-title class="font-weight-bold">
                  評価の重み
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="weightMenu = false">
                  <v-icon>mdi-close-thick</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card class="pa-3 scroll" flat height="80vh">
                <weight-settings :params="params" :readonly="true" />
              </v-card>
            </v-card>
          </v-container>
        </v-dialog>
        <v-menu>
          <template v-slot:activator="{ props}">
            <v-btn icon flat @click="iconSizeMenu = true" v-bind="props">
              <v-icon>
                mdi-image-size-select-small
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                アイコンサイズ
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              v-for="(item, i) in iconSizeList"
              :key="i"
              @click="iconSize = item.value"
              :items="reviewPointTypeArray"
              class="cursor-pointer"
            >
              <v-list-item-title v-if="iconSize === item.value" class="font-weight-bold" v-text="item.text"></v-list-item-title>
              <v-list-item-title v-else v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          grow
        >
          <v-tab v-if="pointType !== 'unlimited'">
            ピボットTier
          </v-tab>
          <v-tab>
            評点一覧
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <!-- ピボットしたTier -->
    <!-- スコアやランク表示 -->
    <div v-if="tabDisp() === 0">
      <table
        width="100%"
        border="1"
      >
        <tr v-for="items, i in tierPivotList" :key="i">
          <td :style="pivotColor" style="width: 0;white-space: nowrap;">
            <span v-if="pointType === 'point'" :style="pivotColor">
              {{ (9 - i)*10 }}点～{{ (10 - i)*10 }}点
            </span>
            <v-card v-else flat>
              <review-value-display
                :point-type="pointType"
                :value="(tierPivotList.length - i - 1) * (100 / (tierPivotList.length - 1))"
                display-size="larger"
                bar-width="100px"
              />
            </v-card>
          </td>
          <td :style="pivotColor" style="min-width: 80%;">
            <div v-for="item,j in items" :key="j" style="display: inline-block;">
              <pivot-icon
                class="ma-1"
                :infomation="item"
                :size="iconSize"
                :point-type="pointType"
                :review-factor-params="params"
                />
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Tierランキングテーブル -->
    <EasyDataTable
      v-if="tabDisp() === 1"
      header-text-direction="center"
      border-cell
      :headers="headers"
      :items="reviewValues"
      :items-per-page="25"
    >
      <template v-slot:body="pageItems">
        <tr v-for="row,i in pageItems" :key="i" class="text-caption" :style="i % 2 === 0 ? rowColor : ''">
          <td v-for="col,j,k in row" :key="j" :class="k === (Object.keys(row).length - 1) ? '': 'b-right'">
            <v-card v-if="'' + j == 'name'" v-text="col" flat :style="i % 2 === 0 ? rowColor : ''"></v-card>
            <v-card v-else-if="'' + j == 'ave'" flat :style="i % 2 === 0 ? rowColor : ''">
              <review-value-display
                style="text-align: center;"
                :style="i % 2 === 0 ? rowColor : ''"
                :compact="true"
                :point-type="pointType"
                :value="col"
                display-size="larger"
              />
            </v-card>
            <v-card v-else-if="propsDic['' + j]" style="text-align: center;" flat :style="i % 2 === 0 ? rowColor : ''">
              <v-card v-if="propsDic['' + j].isPoint" flat>
                <review-value-display
                  :style="i % 2 === 0 ? rowColor : ''"
                  :compact="true"
                  :point-type="pointType"
                  :value="col"
                  display-size="larger"
                />
              </v-card>
              <span v-else v-text="col"></span>
            </v-card>
          </td>
        </tr>
      </template>
    </EasyDataTable>
  </v-card>
</template>

<script lang="ts">
import { Review, Dictionary, ReviewFactorParam, DataTableHeader, ReviewFunc, reviewPointTypeArray, ReviewPointType } from '@/common/review'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import WeightSettings from '@/components/WeightSettings.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import PivotIcon from '@/components/PivotIcon.vue'
import vuetify from '@/plugins/vuetify'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export default defineComponent({
  name: 'TierRanking',
  components: {
    ReviewValueDisplay,
    WeightSettings,
    PointTypeSelector,
    PivotIcon
  },
  props: {
    tierId: {
      type: String,
      required: true,
      default: ''
    },
    reviews: {
      type: Array as PropType<Review[]>,
      required: true,
      default: () => [] as PropType<Review[]>
    },
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true,
      default: () => [] as PropType<ReviewFactorParam[]>
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true,
      default: 'point' as ReviewPointType
    },
    noMenuIcon: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props, { emit }) {
    const display = useDisplay()

    // プロパティからテーブルヘッダを作成
    const headers = computed(() => {
      let i = 0
      const headersObj: DataTableHeader[] = [
        {
          text: '名称',
          value: 'name',
          sortable: true
        },
        {
          text: '総合',
          value: 'ave',
          sortable: true
        }
      ]
      props.params.forEach((header) => {
        headersObj.push({
          text: header.name,
          value: 'h' + i,
          sortable: true
        })
        i++
      })
      return headersObj
    })

    // プロパティからテーブルの表示内容を作成
    const reviewValues = computed(() => {
      const rankingTable: Dictionary<string | number>[] = []
      if (props.reviews) {
        const reviews = props.reviews as Review[]

        // ループで内容を作成
        reviews.forEach((review) => {
          let i = 0
          const rankingRow: Dictionary<string | number> = {
            name: review.name,
            ave: props.pointType === 'unlimited' ? ReviewFunc.calcSum(review, props.params) : ReviewFunc.calcAaverage(review, props.params)
          }
          review.reviewFactors.forEach((factor) => {
            // ヘッダの行列数と突合
            if (i < props.params.length) {
              // ポイントか情報かによって分岐
              if (props.params[i].isPoint) {
                rankingRow['h' + i] = factor.point ? factor.point : 0
              } else {
                rankingRow['h' + i] = factor.info ? factor.info : ''
              }
            }
            i++
          })
          rankingTable.push(rankingRow)
        })
      }
      return rankingTable
    })

    const propsDic = computed(() => {
      const list: Dictionary<ReviewFactorParam> = {}
      let i = 0
      props.params.forEach((param) => {
        list['h' + i] = param
        i++
      })
      return list
    })

    const rowColor = 'background: ' + vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry + ';'
    const pivotColor = ''

    const tab = ref(0)
    const weightMenu = ref(false)
    const iconSizeMenu = ref(false)

    const tabDisp = () => {
      return props.pointType !== 'unlimited' ? tab.value : 1
    }

    const updatePointTypeProxy = (pointType: ReviewPointType) => {
      emit('updatePointType', pointType)
      if (pointType === 'unlimited') {
        tab.value = 1
      }
    }

    const tierPivotList = computed(() => {
      const val = ReviewFunc.makeTierPivot(props.reviews, props.params, props.tierId, props.pointType)
      return val
    })

    const iconSize = ref('48px' as string)
    const iconSizeList = [
      {
        text: '特大',
        value: '96px'
      },
      {
        text: '大',
        value: '64px'
      },
      {
        text: '普通',
        value: '48px'
      },
      {
        text: '小',
        value: '32px'
      },
      {
        text: '最小',
        value: '24px'
      }
    ]

    onMounted(() => {
      if (display.xl.value) {
        iconSize.value = iconSizeList[1].value
      } else if (display.lg.value) {
        iconSize.value = iconSizeList[1].value
      } else if (display.md.value) {
        iconSize.value = iconSizeList[1].value
      } else if (display.sm.value) {
        iconSize.value = iconSizeList[2].value
      } else if (display.xs.value) {
        iconSize.value = iconSizeList[2].value
      }
    })

    return {
      /** ヘッダー情報を加工して列挙した配列 */
      headers,
      /** 評価情報をヘッダーの項目名をキーに辞書としたものの配列 */
      reviewValues,
      /** ヘッダー項目をヘッダー項目名をキーに辞書としたもの */
      propsDic,
      /** レビュー評点表示方法を並べた配列 */
      reviewPointTypeArray,
      /** 行の色を含んだスタイル */
      rowColor,
      /** ピボットテーブルのスタイル */
      pivotColor,
      /** tabの表示情報(0...ピボットTier, 1...評点一覧) */
      tab,
      /** unlimited状態を加味したtabの表示情報(0...ピボットTier, 1...評点一蘭) */
      tabDisp,
      /** 重み情報のダイアログ表示フラグ */
      weightMenu,
      /** アイコンサイズ変更メニューの表示フラグ */
      iconSizeMenu,
      /** ポイント表示方法のイベント */
      updatePointTypeProxy,
      /** tierの情報からピボットテーブルを作成する関数(ポイント表示方法が変わる度に再計算する) */
      tierPivotList,
      /** tierピボットの表示サイズ */
      iconSize,
      /** tierピボットの表示サイズリスト */
      iconSizeList
    }
  }
})
</script>

<style scoped>
.b-right {
  border-right: 1px solid #D3D3D3;
}
.card-h {
  height: -webkit-calc(100vh - 100px);
}
</style>
