<template>
  <div v-if="pointType == 'stars'" :class="iconsize">
    <!-- starsの評価表示 -->
    <span v-if="compact">
      <v-icon color="orange" dark  :small="displaySize === 'smaller'"> mdi-star </v-icon>
      <span v-text="point"></span>
    </span>
    <span v-else>
      <v-icon v-for="n of point" :key="n" color="orange" dark :small="displaySize === 'smaller'"> mdi-star </v-icon>
      <v-icon v-for="n of (5 - point)" :key="n" color="black" dark :small="displaySize === 'smaller'" > mdi-star </v-icon>
    </span>
  </div>
    <!-- rank7, rank14の評価表示 -->
  <div v-else-if="pointType == 'rank14' || pointType == 'rank7'" class="rank" :class="reverse ? `reverse ${textsize}` : `${calcRankClass(pointType, point)} ${textsize}`" v-text="calcRankText(pointType, point)"></div>
  <div v-else-if="compact">
    <!-- score, point, unlimitedのコンパクト評価表示 -->
    <span class="ml-1" v-text="point"></span>
  </div>
  <v-card v-else-if="pointType == 'score'" :width="barWidth" height="100%" :class="iconsize">
    <!-- scoreの評価表示 -->
    <v-card flat :class="compact ? '' : 'bar'" :style="calcBarStyle(point, 10)" height="100%">
      <span class="ml-1" v-text="point"></span>
    </v-card>
  </v-card>
  <v-card v-else-if="pointType == 'point'" :width="barWidth" height="100%"  :class="iconsize">
    <!-- pointの評価表示 -->
    <v-card flat :class="compact ? '' : 'bar'" :style="calcBarStyle(point, 100)" height="100%" >
      <span class="ml-1" v-text="point"></span>
    </v-card>
  </v-card>
  <div v-else-if="pointType == 'unlimited'" :width="barWidth" :class="iconsize">
    <!-- unlimitedの評価表示 -->
    <b><span class="ml-1" v-text="point"></span></b>
  </div>
</template>

<script lang="ts">
import { ReviewPointType, ReviewFunc, PointDisplaySize } from '@/common/review'
import { defineComponent, PropType, computed } from 'vue'

/** pointType scoreやpointの際に使用
 */
export const calcBarStyle = (p: number, max: number) => {
  const percent = 100 * p / max
  const r = percent < 50 ? percent < 10 ? 255 : 175 * (50 - percent) / 40 + 80 : 80
  const g = percent < 25 ? percent < 10 ? 0 : 255 * percent / 25 : 255
  const b = percent < 50 ? 0 : 255 * (percent - 50) / 50
  return `background: linear-gradient(90deg, rgb(${r}, ${g}, ${b}, 0.5) 0% ${percent}%, rgb(127, 127, 127, 0.5) ${percent}% 100%);`
}

export const calcRankClass = (pointType: ReviewPointType, point: number) => {
  let style = ''

  if (pointType === 'rank14') {
    switch (point) {
      case 0:
        style += 'e'
        break
      case 1:
        style += 'e'
        break
      case 2:
        style += 'd'
        break
      case 3:
        style += 'd'
        break
      case 4:
        style += 'c'
        break
      case 5:
        style += 'c'
        break
      case 6:
        style += 'b'
        break
      case 7:
        style += 'b'
        break
      case 8:
        style += 'a'
        break
      case 9:
        style += 'a'
        break
      case 10:
        style += 's'
        break
      case 11:
        style += 's'
        break
      case 12:
        style += 'ss'
        break
      case 13:
        style += 'ss'
        break
    }
  } else if (pointType === 'rank7') {
    switch (point) {
      case 0:
        style += 'e'
        break
      case 1:
        style += 'd'
        break
      case 2:
        style += 'c'
        break
      case 3:
        style += 'b'
        break
      case 4:
        style += 'a'
        break
      case 5:
        style += 's'
        break
      case 6:
        style += 'ss'
        break
    }
  }

  return style
}
export const calcRankText = (pointType: ReviewPointType, point: number) => {
  let style = ''

  if (pointType === 'rank14') {
    switch (point) {
      case 0:
        style += 'E'
        break
      case 1:
        style += 'E+'
        break
      case 2:
        style += 'D'
        break
      case 3:
        style += 'D+'
        break
      case 4:
        style += 'C'
        break
      case 5:
        style += 'C+'
        break
      case 6:
        style += 'B'
        break
      case 7:
        style += 'B+'
        break
      case 8:
        style += 'A'
        break
      case 9:
        style += 'A+'
        break
      case 10:
        style += 'S'
        break
      case 11:
        style += 'S+'
        break
      case 12:
        style += 'SS'
        break
      case 13:
        style += 'SS+'
        break
    }
  } else if (pointType === 'rank7') {
    switch (point) {
      case 0:
        style += 'E'
        break
      case 1:
        style += 'D'
        break
      case 2:
        style += 'C'
        break
      case 3:
        style += 'B'
        break
      case 4:
        style += 'A'
        break
      case 5:
        style += 'S'
        break
      case 6:
        style += 'SS'
        break
    }
  }

  return style
}

export default defineComponent({
  name: 'ReviewValueDisplay',
  components: {},
  props: {
    /** 評価ポイントを指定する(元の数値) */
    value: {
      type: Number,
      required: true
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    displaySize: {
      /// ランク表示の際の表示サイズを変更
      type: String as PropType<PointDisplaySize>,
      default: 'normal' as PointDisplaySize
    },
    compact: {
      /// ランク表示をコンパクトに表示する
      type: Boolean,
      default: false as boolean
    },
    barWidth: {
      type: String as PropType<number | string | undefined>,
      default: undefined
    },
    reverse: {
      /// ランクの表示色を反転する
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const point = computed(() => {
      return ReviewFunc.getReviewDisp(props.value, props.pointType)
    })

    const sizeArray = [
      'text-caption',
      'text-subtitle-1',
      'text-h6',
      'text-h5',
      'text-h4',
      'text-h3',
      'text-h2',
      'text-h1'
    ]

    const textsize = computed(() => {
      switch (props.displaySize) {
        case 'smaller':
          return sizeArray[0]
        case 'normal':
          return sizeArray[1]
        case 'large':
          return sizeArray[2]
        case 'large2':
          return sizeArray[3]
        case 'large3':
          return sizeArray[4]
        case 'large4':
          return sizeArray[5]
        case 'large5':
          return sizeArray[6]
        case 'large6':
          return sizeArray[7]
      }
      return ''
    })

    const iconsize = computed(() => {
      switch (props.displaySize) {
        case 'smaller':
          return sizeArray[0]
        case 'normal':
          return sizeArray[0]
        case 'large':
          return sizeArray[1]
        case 'large2':
          return sizeArray[1]
        case 'large3':
          return sizeArray[2]
        case 'large4':
          return sizeArray[2]
        case 'large5':
          return sizeArray[3]
        case 'large6':
          return sizeArray[3]
      }
      return ''
    })

    return {
      point,
      calcBarStyle,
      textsize,
      iconsize,
      calcRankClass,
      calcRankText
    }
  }
})
</script>

<style scoped>
@import url("@/style/rank.css");

</style>
