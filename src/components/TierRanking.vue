<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="[]"
      :items-per-page="50"
      class="elevation-1"
    ></v-data-table>
    {{ headers }}<br /><br />
    {{ reviewValues }}
  </v-card>
</template>

<script lang="ts">
import { Review, Dictionary, ReviewFactorParam, DataTableHeader } from '@/common/review'
import { computed } from '@vue/reactivity'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TierRanking',
  components: {},
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
          value: 'name'
        }
      ]
      props.params.forEach((header) => {
        headersObj.push({
          text: header.name,
          value: 'h' + i
        })
        i++
      })
      console.log(headersObj)
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
            name: review.name
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
          console.log(rankingTable)
        })
      }
      return rankingTable
    })
    return {
      headers,
      reviewValues
    }
  }
})
</script>
