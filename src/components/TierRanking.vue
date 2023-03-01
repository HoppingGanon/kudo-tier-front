<template>
  <v-card flat>
    <v-toolbar
      v-if="!hideBar"
      color="secondary"
      dark
    >
      <!-- 表示形式を変更したりするためのメニューバー -->
      <div v-if="!noMenuIcon" style="width: 100%" class="d-flex">
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
          <v-container :class="$vuetify.display.mobile ? 'ma-0 pa-0' : ''">
            <v-card class="block-center card-h">
              <v-toolbar
                color="secondary"
                dark
              >
                <v-toolbar-title class="font-weight-bold">
                  項目情報
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="weightMenu = false">
                  <v-icon>mdi-close-thick</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card class="pa-3 scroll" flat height="80vh">
                <weight-settings :params="params" :readonly="true" :show-details="true" />
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
              @click="$emit('update:iconSize', $event)"
              :items="reviewPointTypeArray"
              class="cursor-pointer"
            >
              <v-list-item-title v-if="iconSize === item.value" class="font-weight-bold" v-text="item.text"></v-list-item-title>
              <v-list-item-title v-else v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <div style="width: 100%" class="d-flex flex-row-reverse">
          <menu-button :items="menuItems" @select="selectMenu">
            <template v-slot:button="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
            </template>
          </menu-button>
        </div>
      </div>
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          grow
          slider-color="primary"
        >
          <v-tab v-if="pointType !== 'unlimited'" class="text-no-transform">
            Tier
          </v-tab>
          <v-tab>
            早見表
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <!-- ピボットしたTier -->
    <a v-if="directLink" :href="tierlink" target="_top" class="no-link">
      <tier-ranking-pivot
        v-show="tabDisp === 0"
        :tier-pivot-list="tierPivotList"
        :params="params"
        :icon-size="iconSize"
        :point-type="pointType"
        :theme="theme"
        :direct-link="true"
        :text-size="textSize"
        :pulling-up="tier.pullingUp"
        :pulling-down="tier.pullingDown"
      />
    </a>
    <tier-ranking-pivot
      v-else
      v-show="tabDisp === 0"
      :tier-pivot-list="tierPivotList"
      :params="params"
      :icon-size="iconSize"
      :point-type="pointType"
      :theme="theme"
      :direct-link="false"
      :text-size="textSize"
      :pulling-up="tier.pullingUp"
      :pulling-down="tier.pullingDown"
    />

    <!-- Tierランキングテーブル -->
    <EasyDataTable
      v-show="tabDisp === 1"
      header-text-direction="center"
      border-cell
      :headers="headers"
      :items="reviewValues"
      :items-per-page="25"
    >
      <template v-slot:body="pageItems">
        <tr v-for="row,i in pageItems" :key="i" class="text-caption cursor-pointer">
          <td v-for="col,j,k in row.dictionary" :key="j" :class="k === (Object.keys(row).length - 1) ? '': 'b-right'" @click="goTierHash(row.reviewId)">
            <v-card v-if="'' + j == 'name'" v-text="col" flat></v-card>
            <v-card v-else-if="'' + j == 'ave'" flat style="text-align: center;">
              <review-value-display
                :compact="true"
                :point-type="pointType"
                :value="col"
                display-size="normal"
              />
            </v-card>
            <v-card v-else-if="propsDic['' + j]" style="text-align: center;" flat>
              <v-card v-if="propsDic['' + j].isPoint" flat>
                <review-value-display
                  :compact="true"
                  :point-type="pointType"
                  :value="col"
                  display-size="normal"
                />
              </v-card>
              <span v-else v-text="col"></span>
            </v-card>
          </td>
        </tr>
      </template>
    </EasyDataTable>
  </v-card>

  <simple-dialog v-model="toJsonDialog" title="Tierのダウンロード" @submit="backup" :persistent="true">
    <v-container>
      <v-row>
        <v-col>
          TierをJSON形式に変換し、画像とともにzip形式でダウンロードします
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ml-5">
          ※この処理には数分間かかる可能性があります
        </v-col>
      </v-row>
      <v-row v-show="isProcessing">
        <v-col>
          <loading-component title="Tier表を取得中..." />
        </v-col>
      </v-row>
      <v-row v-show="isProcessing && processingMessage">
        <v-col>
          <span v-text="processingMessage" />
        </v-col>
      </v-row>
      <v-row v-show="isProcessing && processingMax">
        <v-col>
          <span>
            {{ processingIndex }}/{{ processingMax }}ファイル
          </span>
        </v-col>
      </v-row>
    </v-container>
  </simple-dialog>

  <v-dialog
    v-model="toPictureDialog"
    :fullscreen="true"
  >
  <v-card>
    <v-toolbar color="secondary">
      <v-card-title class="font-weight-bold">
        Tier表を画像で保存
      </v-card-title>
      <div style="width: 100%" class="d-flex justify-end">
        <v-btn @click="toPictureDialog = false" flat icon><v-icon> mdi-close </v-icon></v-btn>
      </div>
    </v-toolbar>
    <tier-to-picture
      v-model:theme="picTheme"
      v-model:point-type="picPointType"
      v-model:icon-size="picIconSize"
      v-model:text-size="picTextSize"
      :params="params"
      :tier-pivot-list="picPivotList"
      :pulling-up="tier.pullingUp"
      :pulling-down="tier.pullingDown"
      />
      <v-card-actions>
        <div class="d-flex justify-end" style="width: 100%;" >
          <v-btn flat @click="toPictureDialog = false">
            閉じる
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="toEmbeddedDialog"
    :fullscreen="true"
  >
  <v-card>
    <v-toolbar color="secondary">
      <v-card-title class="font-weight-bold">
        他サイトのHTMLへの埋め込み
      </v-card-title>
      <div style="width: 100%" class="d-flex justify-end">
        <v-btn @click="toEmbeddedDialog = false" flat icon><v-icon> mdi-close </v-icon></v-btn>
      </div>
    </v-toolbar>
    <tier-to-embedded
      :tier-id="tier.tierId"
      />
      <v-card-actions>
        <div class="d-flex justify-end" style="width: 100%;" >
          <v-btn flat @click="toEmbeddedDialog = false">
            閉じる
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Review, Dictionary, ReviewFactorParam, DataTableHeader, ReviewFunc, reviewPointTypeArray, ReviewPointType, Tier, PointDisplaySize, IconSize, RankingTheme } from '@/common/review'
import { defineComponent, PropType, computed, ref, Ref } from 'vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import WeightSettings from '@/components/WeightSettings.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import MenuButton from '@/components/MenuButton.vue'
import TierRankingPivot from '@/components/TierRankingPivot.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import TierToPicture from '@/components/TierToPicture.vue'
import TierToEmbedded from '@/components/TierToEmbedded.vue'
import { iconSizeList, SelectObject, textSizeList } from '@/common/page'
import { useToast } from 'vue-toast-notification'
import { onBeforeRouteLeave } from 'vue-router'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default defineComponent({
  name: 'TierRanking',
  components: {
    ReviewValueDisplay,
    WeightSettings,
    PointTypeSelector,
    MenuButton,
    TierRankingPivot,
    SimpleDialog,
    LoadingComponent,
    TierToPicture,
    TierToEmbedded
  },
  props: {
    tier: {
      type: Object as PropType<Tier>,
      required: true
    },
    reviews: {
      type: Array as PropType<Review[]>,
      required: true,
      default: () => [] as PropType<Review[]>
    },
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true,
      default: () => [] as ReviewFactorParam[]
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    },
    noMenuIcon: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String as PropType<RankingTheme>,
      default: 'light'
    },
    hideBar: {
      type: Boolean,
      default: false
    },
    directLink: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: String as PropType<IconSize>,
      default: '48px' as IconSize
    },
    textSize: {
      type: String as PropType<PointDisplaySize>,
      default: 'large2' as PointDisplaySize
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true,
    'update:theme': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: RankingTheme) => true,
    'update:iconSize': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: IconSize) => true,
    'update:textSize': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: PointDisplaySize) => true
  },
  setup (props, { emit }) {
    const toast = useToast()

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
      const rankingTable: { reviewId: string, dictionary:Dictionary<string | number> }[] = []
      if (props.reviews) {
        const reviews = props.reviews as Review[]

        // ループで内容を作成
        reviews.forEach((review) => {
          let i = 0
          const rankingRow: Dictionary<string | number> = {
            name: review.name,
            ave: props.pointType === 'unlimited' ? ReviewFunc.calcSum(review, props.params) : ReviewFunc.calcAaverage(review, props.params, props.tier.pullingUp, props.tier.pullingDown, 0, 100)
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
          rankingTable.push({
            dictionary: rankingRow,
            reviewId: review.reviewId
          })
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

    const tab = ref(0)
    const weightMenu = ref(false)
    const iconSizeMenu = ref(false)

    const tabDisp = computed(() => {
      return props.pointType !== 'unlimited' ? tab.value : 1
    })

    const updatePointTypeProxy = (pointType: ReviewPointType) => {
      emit('updatePointType', pointType)
      if (pointType === 'unlimited') {
        tab.value = 1
      }
    }

    const pivotInfoList = computed(() => ReviewFunc.makePivotInfoList(props.reviews, props.params, props.tier.pullingUp, props.tier.pullingDown, 0, 100))

    const tierPivotList = computed(() => {
      const val = ReviewFunc.makeTierPivot(pivotInfoList.value, props.pointType)
      return val
    })

    const menuItems: SelectObject[] = [
      {
        text: 'Tier表を画像で保存(beta)',
        value: 'to-picture'
      },
      {
        text: '他サイトのHTMLへの埋め込み(beta)',
        value: 'to-embedded'
      },
      {
        text: 'Tierのダウンロード(beta)',
        value: 'to-json'
      }
    ]

    const picTheme = ref(props.theme)
    const picPointType = ref(props.pointType)
    const picIconSize = ref(iconSizeList[1].value)
    const picTextSize = ref(textSizeList[3].value)

    const picPivotInfoList = computed(() => ReviewFunc.makePivotInfoList(props.reviews, props.params, props.tier.pullingUp, props.tier.pullingDown, 0, 100))
    const picPivotList = computed(() => ReviewFunc.makeTierPivot(picPivotInfoList.value, picPointType.value))

    const selectMenu = (v: string) => {
      switch (v) {
        case 'to-picture':
          picTheme.value = props.theme
          picPointType.value = props.tier.pointType
          picIconSize.value = iconSizeList[1].value
          picTextSize.value = textSizeList[3].value
          toPictureDialog.value = true
          break
        case 'to-embedded':
          toEmbeddedDialog.value = true
          break
        case 'to-json':
          toJsonDialog.value = true
          break
      }
    }

    const toPictureDialog = ref(false)
    const toEmbeddedDialog = ref(false)
    const toJsonDialog = ref(false)

    const goTierHash = (reviewId: string) => {
      window.location.href = `#rev${reviewId}`
    }

    // これがないとイベントが設定できない
    history.replaceState(null, '')

    onBeforeRouteLeave(() => {
      if (isProcessing.value) {
        toast.warning('Tierデータのダウンロードを中断しました')
      }
      stopFlug.value = true
      return true
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toJsonProcess: Ref<Promise<void> | undefined> = ref(undefined)
    const isProcessing = ref(false)
    const stopFlug = ref(false)
    const processingMessage = ref('')
    const processingIndex = ref(0)
    const processingMax = ref(0)

    const toJson = async () => {
      processingMessage.value = 'レビュー情報をダウンロードしています...'
      processingIndex.value = 0
      processingMax.value = 0
      stopFlug.value = false
      const data = await ReviewFunc.getTierBackup(
        props.tier,
        (index, max) => {
          // 1つめの処理中
          processingIndex.value = index
          processingMax.value = max
          setTimeout(() => true, 250)
          return !stopFlug.value
        },
        (max) => {
          // 1つめの処理終了
          processingIndex.value = max
          processingMax.value = max
          processingMessage.value = 'レビュー情報をダウンロードしました'
          return !stopFlug.value
        },
        (max) => {
          // 2つめの処理開始
          processingMessage.value = '画像をダウンロードしています...'
          processingIndex.value = 0
          processingMax.value = max
          return !stopFlug.value
        },
        (index, max) => {
          // 2つめの処理中
          processingIndex.value = index
          processingMax.value = max
          return !stopFlug.value
        },
        (max) => {
          // 2つめの処理終了
          processingIndex.value = max
          processingMax.value = max
          processingMessage.value = '画像をダウンロードしました'
          return !stopFlug.value
        }
      )

      if (stopFlug.value) {
        toast.warning('Tierデータのダウンロードを中断しました')
        stopFlug.value = false
        isProcessing.value = false
        return
      } else if (!data) {
        toast.warning('Tierデータのダウンロードを中断しました')
        stopFlug.value = false
        isProcessing.value = false
        return
      }

      processingMessage.value = 'ZIPファイルを作成しています...'
      processingIndex.value = 0
      processingMax.value = 0
      const zip = new JSZip()

      zip.file(`tier/${props.tier.tierId}.json`, JSON.stringify(data.tier))

      const keys = Object.keys(data.images)
      keys.forEach((key) => {
        zip.file(key, data.images[key])
      })
      const zipfile = await zip.generateAsync({ type: 'blob' })
      saveAs(zipfile, `tier_${props.tier.tierId}.zip`)

      processingMessage.value = ''
      processingIndex.value = 0
      processingMax.value = 0
      isProcessing.value = false

      toast.success('Tierデータのダウンロードが完了しました')
      toJsonDialog.value = false
    }

    const backup = async () => {
      toJsonDialog.value = true
      isProcessing.value = true
      toJsonProcess.value = toJson()
    }

    const tierlink = computed(() => `/tier/${props.tier.tierId}`)

    return {
      /** ヘッダー情報を加工して列挙した配列 */
      headers,
      /** 評価情報をヘッダーの項目名をキーに辞書としたものの配列 */
      reviewValues,
      /** ヘッダー項目をヘッダー項目名をキーに辞書としたもの */
      propsDic,
      /** レビュー評点表示方法を並べた配列 */
      reviewPointTypeArray,
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
      /** tierピボットの表示サイズリスト */
      iconSizeList,
      /** 三点リーダのメニュー */
      menuItems,
      /** 画像化の際に使用するポイント表示方法 */
      picPointType,
      /** 画像化の際に使用するテーマカラー */
      picTheme,
      /** 画像化の際に使用するアイコンサイズ */
      picIconSize,
      /** 画像化の際に使用するテキストサイズ */
      picTextSize,
      /** 画像化の際に使用するピボット済Tierデータ */
      picPivotList,
      /** 三点リーダのメニュー選択イベント */
      selectMenu,
      /** 画像保存ダイアログ */
      toPictureDialog,
      /** 埋め込みリンク生成ダイアログ */
      toEmbeddedDialog,
      /** バックアップ前の選択ダイアログ */
      toJsonDialog,
      /** Tierの指定したページへ移動する */
      goTierHash,
      /** バックアップ処理 */
      backup,
      /** ダウンロード処理中のフラグ */
      isProcessing,
      /** ダウンロード中断フラグ */
      stopFlug,
      /** 処理時のメッセージ */
      processingMessage,
      /** 処理数 */
      processingIndex,
      /** 処理全数 */
      processingMax,
      /** Tierへのリンク */
      tierlink
    }
  }
})
</script>
