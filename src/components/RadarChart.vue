<!-- レーダーチャートを表示するためのコンポーネント -->

<template>
  <RadarChart :chartData="chartData" :options="chartOptions" reactive style="width: 100%" />
</template>

<script lang="ts">
import vuetify from '@/plugins/vuetify'
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js'
import { computed, defineComponent, PropType } from 'vue'
import { RadarChart } from 'vue-chart-3'

export interface RadarChartData {
  name: string
  values: number[]
}

export default defineComponent({
  components: {
    RadarChart
  },
  props: {
    /** レーダーチャートに表示するラベルリスト */
    labels: {
      type: Array as PropType<string[]>,
      required: true
    },
    /** レーダーチャートのデータリスト */
    dataList: {
      type: Array as PropType<RadarChartData[]>,
      required: true
    },
    /** レーダーチャートのタイトル */
    title: {
      type: String
    },
    /** レーダーチャートのメモリ刻み */
    step: {
      type: Number
    },
    /** レーダーチャートの最小値 */
    min: {
      type: Number
    },
    /** レーダーチャートの最大値 */
    max: {
      type: Number
    },
    /** チャートの上に凡例を表示 */
    showLegend: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const chartColor = `${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary}50`
    const pointColor = `${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary}`

    const chartData = computed(() => {
      const data: ChartData<'radar'> = {
        labels: props.labels,
        datasets: []
      } as ChartData<'radar'>
      props.dataList.forEach((v) => {
        data.datasets.push(
          {
            label: v.name,
            data: v.values,
            backgroundColor: [
              chartColor
            ],
            pointBackgroundColor: [
              pointColor
            ]
          })
      })
      return data
    })

    const chartOptions = computed(() => {
      let min = props.min
      if (props.min === undefined) {
        props.dataList.forEach((data) => {
          min = data.values.reduce((previous, current) => Math.min(previous, current), 0)
        })
      }
      let max = props.max
      if (props.max === undefined) {
        props.dataList.forEach((data) => {
          max = data.values.reduce((previous, current) => Math.max(previous, current), 0)
        })
      }
      return {
        responsive: true,
        plugins: {
          title: {
            display: props.title !== undefined,
            text: props.title
          },
          legend: {
            display: props.showLegend
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          r: {
            min: min,
            max: max,
            angleLines: {
              display: true
            },
            grid: {
              display: true
            },
            pointLabels: {
              display: true
            },
            ticks: {
              display: false,
              stepSize: props.step
            }
          }
        }
      } as ChartOptions<'radar'>
    })

    return {
      chartColor,
      pointColor,
      chartData,
      chartOptions
    }
  }
})

Chart.register(...registerables)
</script>
