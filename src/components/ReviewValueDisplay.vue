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
  <div
    v-else-if="pointType == 'rank14' || pointType == 'rank7'"
    class="rank"
    :class="reverse ? `reverse ${textsize}` : `no-reverse ${calcRankClass(pointType, point)} ${textsize}`" v-text="calcPointPlainText(pointType, point)"
  ></div>
  <div v-else-if="compact">
    <!-- score, point, unlimitedのコンパクト評価表示 -->
    <span class="ml-1" v-text="point"></span>
  </div>
  <div v-else-if="pointType == 'score' && noFill" :style="barWidth !== undefined ? `width: ${barWidth}` : ''" :class="iconsize" class="bar">
    <!-- scoreの評価表示 -->
    <span class="ml-1" v-text="point"></span>
  </div>
  <v-card v-else-if="pointType == 'score'" :width="barWidth" height="100%" :class="iconsize">
    <!-- scoreの評価表示 -->
    <v-card flat class="bar" :style="calcBarStyle(point, 10)" height="100%">
      <span class="ml-1" v-text="point"></span>
    </v-card>
  </v-card>
  <div v-else-if="pointType == 'point' && noFill" :style="barWidth !== undefined ? `width: ${barWidth}` : ''" class="bar">
    <!-- pointの評価表示 -->
    <span class="ml-1" v-text="point"></span>
  </div>
  <v-card v-else-if="pointType == 'point'" :width="barWidth" height="100%"  :class="iconsize">
    <!-- pointの評価表示 -->
    <v-card flat class="bar" :style="calcBarStyle(point, 100)" height="100%" >
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

/**
 * pointType scoreやpointの際に使用
 */
export const calcBarStyle = (p: number, max: number, isFluid?: boolean, dark?: boolean) => {
  const percent = 100 * p / max
  const r = percent < 50 ? percent < 10 ? 255 : 175 * (50 - percent) / 40 + 80 : 80
  const g = percent < 25 ? percent < 10 ? 0 : 255 * percent / 25 : 255
  const b = percent < 50 ? 0 : 255 * (percent - 50) / 50
  if (isFluid) {
    return `background: rgb(${r}, ${g}, ${b});`
  } else {
    if (dark) {
      return `background: linear-gradient(90deg, rgb(${r}, ${g}, ${b}, 1) 0% ${percent}%, rgb(64, 64, 64, 1) ${percent}% 100%);`
    } else {
      return `background: linear-gradient(90deg, rgb(${r}, ${g}, ${b}, 1) 0% ${percent}%, rgb(192, 192, 192, 1) ${percent}% 100%);`
    }
  }
}

export const calcRankClass = (pointType: ReviewPointType, point: number) => {
  let classStr = ''

  if (pointType === 'rank14') {
    switch (point) {
      case 0:
        classStr += 'e'
        break
      case 1:
        classStr += 'e'
        break
      case 2:
        classStr += 'd'
        break
      case 3:
        classStr += 'd'
        break
      case 4:
        classStr += 'c'
        break
      case 5:
        classStr += 'c'
        break
      case 6:
        classStr += 'b'
        break
      case 7:
        classStr += 'b'
        break
      case 8:
        classStr += 'a'
        break
      case 9:
        classStr += 'a'
        break
      case 10:
        classStr += 's'
        break
      case 11:
        classStr += 's'
        break
      case 12:
        classStr += 'ss'
        break
      case 13:
        classStr += 'ss'
        break
    }
  } else if (pointType === 'rank7') {
    switch (point) {
      case 0:
        classStr += 'e'
        break
      case 1:
        classStr += 'd'
        break
      case 2:
        classStr += 'c'
        break
      case 3:
        classStr += 'b'
        break
      case 4:
        classStr += 'a'
        break
      case 5:
        classStr += 's'
        break
      case 6:
        classStr += 'ss'
        break
    }
  }

  return classStr
}
export const calcPointPlainText = (pointType: ReviewPointType, point: number, multiByte?: boolean) => {
  if (pointType === 'rank14') {
    switch (point) {
      case 0:
        return 'E'
      case 1:
        return 'E+'
      case 2:
        return 'D'
      case 3:
        return 'D+'
      case 4:
        return 'C'
      case 5:
        return 'C+'
      case 6:
        return 'B'
      case 7:
        return 'B+'
      case 8:
        return 'A'
      case 9:
        return 'A+'
      case 10:
        return 'S'
      case 11:
        return 'S+'
      case 12:
        return 'SS'
      case 13:
        return 'SS+'
      default:
        return 'SS+'
    }
  } else if (pointType === 'rank7') {
    switch (point) {
      case 0:
        return 'E'
      case 1:
        return 'D'
      case 2:
        return 'C'
      case 3:
        return 'B'
      case 4:
        return 'A'
      case 5:
        return 'S'
      case 6:
        return 'SS'
      default:
        return 'SS'
    }
  } else if (pointType === 'stars') {
    if (multiByte) {
      switch (point) {
        case 0:
          return '★★★★★ (0 / 5)'
        case 1:
          return '☆★★★★ (1 / 5)'
        case 2:
          return '☆☆★★★ (2 / 5)'
        case 3:
          return '☆☆☆★★ (3 / 5)'
        case 4:
          return '☆☆☆☆★ (4 / 5)'
        case 5:
          return '☆☆☆☆☆ (5 / 5)'
        default:
          return '☆☆☆☆☆ (5 / 5)'
      }
    } else {
      switch (point) {
        case 0:
          return '0'
        case 1:
          return '1'
        case 2:
          return '2'
        case 3:
          return '3'
        case 4:
          return '4'
        case 5:
          return '5'
        default:
          return '5'
      }
    }
  } else {
    return point.toString()
  }
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
    },
    noFill: {
      /// スコア表示時に塗りつぶさない
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
      calcPointPlainText
    }
  }
})
</script>

<style scoped>
@import url("@/style/rank.css");

</style>
