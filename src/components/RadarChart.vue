<template>
  <RadarChart :chartData="getData()" :options="getOptions()" reactive style="width: 100%" />
</template>

<script lang="ts">
import vuetify from '@/plugins/vuetify'
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js'
import { defineComponent, PropType } from 'vue'
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
    labels: {
      type: Array as PropType<string[]>,
      required: true
    },
    dataList: {
      type: Array as PropType<RadarChartData[]>,
      required: true
    },
    title: {
      type: String
    },
    step: {
      type: Number
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    showLegend: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const chartColor = `${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary}50`
    const pointColor = `${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary}`

    const getData = () => {
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
    }

    const getOptions: () => ChartOptions<'radar'> = () => {
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
      }
    }

    return {
      chartColor,
      pointColor,
      getData,
      getOptions
    }
  }
})

Chart.register(...registerables)
</script>
