<template>
  <v-card flat>
    <v-toolbar
      color="secondary"
      dark
    >
      <v-toolbar-title>
        <v-menu v-model="menu">
          <template v-slot:activator="{ isActive, props}">
            <v-icon
              @click="menu = true"
              class="cursor-pointer"
              v-on="isActive"
              v-bind="props"
              >
              mdi-cached
            </v-icon>
          </template>
          <v-list>
            <v-list-item-group
              v-model="reviewPointTypeArray"
              color="primary"
            >
              <v-list-item>
                <v-list-item-title>
                  表示形式
                </v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item
                v-for="(item, i) in reviewPointTypeArray"
                :key="i"
              >
                <v-list-item-content @click="updatePointTypeProxy(item)" :items="reviewPointTypeArray" class="cursor-pointer">
                  <v-list-item-title v-if="item === pointType" class="strong" v-text="item"></v-list-item-title>
                  <v-list-item-title v-else v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
        >
          <v-tab>
            ランキング
          </v-tab>
          <v-tab>
            ピボットTier
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <EasyDataTable
      v-if="tab === 0"
      :headers="headers"
      :items="reviewValues"
      :items-per-page="50"
    >
      <template v-slot:body="pageItems">
        <tr v-for="row,i in pageItems" :key="i" class="text-caption" :style="i % 2 === 0 ? rowColor : ''">
          <td v-for="col,j in row" :key="j">
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
    <v-card
      v-if="tab === 1"
      fluid
    >
      <v-row>
        <v-col cols="">
          a
        </v-col>
        <v-col>
          a
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Review, Dictionary, ReviewFactorParam, DataTableHeader, ReviewFunc, reviewPointTypeArray, ReviewPointType, TierTableType } from '@/common/review'
import { defineComponent, PropType, computed, ref } from 'vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import vuetify from '@/plugins/vuetify'

export default defineComponent({
  name: 'TierRanking',
  components: {
    ReviewValueDisplay
  },
  props: {
    reviews: {
      type: Object as PropType<Review[]>,
      required: true,
      default: () => [] as PropType<Review[]>
    },
    params: {
      type: Object as PropType<ReviewFactorParam[]>,
      required: true,
      default: () => [] as PropType<ReviewFactorParam[]>
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true,
      default: 'point' as ReviewPointType
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props, { emit }) {
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
            ave: props.pointType === 'unlimited' ? ReviewFunc.calcSum(review) : ReviewFunc.calcAaverage(review)
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

    const tab = ref(0)
    const menu = ref(false)

    const updatePointTypeProxy = (pointType: ReviewPointType) => {
      emit('updatePointType', pointType)
      menu.value = false
    }

    return {
      headers,
      reviewValues,
      propsDic,
      reviewPointTypeArray,
      rowColor,
      tab,
      menu,
      updatePointTypeProxy
    }
  }
})
</script>
