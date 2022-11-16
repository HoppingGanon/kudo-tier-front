<template>
  <v-card flat>
    <EasyDataTable
      :headers="headers"
      :items="reviewValues"
      :items-per-page="50"
    >
    <template v-slot:body="pageItems">
      <tr v-for="row,i in pageItems" :key="i" class="text-caption">
        <td v-for="col,j in row" :key="j">
          <v-card v-if="'' + j == 'name'" v-text="col" flat></v-card>
          <review-value-display
            v-else-if="'' + j == 'ave'"
            style="text-align: center;"
            :compact="true"
            :point-type="'rank7'"
            :value="col"
          />
          <v-card v-else-if="propsDic['' + j]" style="text-align: center;" flat>
            <v-card v-if="propsDic['' + j].isPoint" flat>
              <review-value-display
                :compact="true"
                :point-type="'point'"
                :value="col"
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
import { Review, Dictionary, ReviewFactorParam, DataTableHeader, ReviewFunc } from '@/common/review'
import { computed } from '@vue/reactivity'
import { defineComponent, PropType } from 'vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

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
    }
  },
  emits: {},
  setup (props) {
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
            ave: ReviewFunc.calcAaverage(review)
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

    return {
      headers,
      reviewValues,
      propsDic
    }
  }
})
</script>
