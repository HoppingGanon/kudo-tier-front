<template>

  <!-- starsの評価表示 -->
  <div v-if="pointType == 'stars'" :class="iconsize">
    <span v-if="compact">
      <v-icon color="orange" dark  :small="displaySize === 'smaller'"> mdi-star </v-icon>
      <span v-text="point"></span>
    </span>
    <span v-else>
      <v-icon v-for="n of point" :key="n" color="orange" dark :small="displaySize === 'smaller'"> mdi-star </v-icon>
      <v-icon v-for="n of (5 - point)" :key="n" color="black" dark :small="displaySize === 'smaller'" > mdi-star </v-icon>
    </span>
  </div>

  <!-- コンパクト評価表示 -->
  <div v-else-if="compact">
    <span class="ml-1" v-text="calcPointPlainText(pointType, point)" :class="calcClass(pointType, point, reverse) + ' ' + textsize"></span>
  </div>

  <!-- コンパクト評価表示以外 -->
  <div v-else-if="pointType === 'rank7' || pointType === 'rank14'">
    <span class="ml-1 mr-4" v-text="calcPointPlainText(pointType, point)" :class="calcClass(pointType, point, reverse) + ' ' + ranksize" ></span>
  </div>
  <div v-else>
    <span class="ml-1 mr-4" v-text="calcPointPlainText(pointType, point)" :class="calcClass(pointType, point, reverse) + ' ' + textsize" ></span>
  </div>
</template>

<script lang="ts">
import { ReviewPointType, ReviewFunc, PointDisplaySize } from '@/common/review'
import { defineComponent, PropType, computed } from 'vue'

export const calcColor = (pointType: ReviewPointType, point: number) => {
  let classText = ''
  if (pointType === 'rank14') {
    switch (point) {
      case 0:
        classText += 'red'
        break
      case 1:
        classText += 'red'
        break
      case 2:
        classText += 'brown'
        break
      case 3:
        classText += 'brown'
        break
      case 4:
        classText += 'purple'
        break
      case 5:
        classText += 'purple'
        break
      case 6:
        classText += 'green'
        break
      case 7:
        classText += 'green'
        break
      case 8:
        classText += 'metal'
        break
      case 9:
        classText += 'metal'
        break
      case 10:
        classText += 'gold'
        break
      case 11:
        classText += 'gold'
        break
      case 12:
        classText += 'rainbow'
        break
      case 13:
        classText += 'rainbow'
        break
    }
  } else if (pointType === 'rank7') {
    switch (point) {
      case 0:
        classText += 'red'
        break
      case 1:
        classText += 'brown'
        break
      case 2:
        classText += 'purple'
        break
      case 3:
        classText += 'green'
        break
      case 4:
        classText += 'metal'
        break
      case 5:
        classText += 'gold'
        break
      case 6:
        classText += 'rainbow'
        break
    }
  } else if (pointType === 'score' || pointType === 'point') {
    const pointProxt = pointType === 'point' ? Math.floor(point / 10) : point
    switch (pointProxt) {
      case 0:
        classText += 'deep-red'
        break
      case 1:
        classText += 'red'
        break
      case 2:
        classText += 'brown'
        break
      case 3:
        classText += 'deep-purple'
        break
      case 4:
        classText += 'purple'
        break
      case 5:
        classText += 'green'
        break
      case 6:
        classText += 'blue-green'
        break
      case 7:
        classText += 'metal'
        break
      case 8:
        classText += 'gold'
        break
      case 9:
        classText += 'rainbow'
        break
      case 10:
        classText += 'rainbow'
        break
    }
  }
  return classText
}

export const calcClass = (pointType: ReviewPointType, point: number, reverse: boolean) => {
  if (reverse) {
    return 'font-weight-bold reverse'
  }
  return `font-weight-bold r-${calcColor(pointType, point)}`
}

/**
 * ポイントから平文を出力する
 * @param pointType ポイント表示方法
 * @param point 集計済みポイント
 * @param multiByte 'stars'表示の際にASCIIコード以外の文字を使用する
 */
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

    const ranksize = computed(() => {
      switch (props.displaySize) {
        case 'smaller':
          return sizeArray[1]
        case 'normal':
          return sizeArray[2]
        case 'large':
          return sizeArray[3]
        case 'large2':
          return sizeArray[4]
        case 'large3':
          return sizeArray[5]
        case 'large4':
          return sizeArray[6]
        case 'large5':
          return sizeArray[7]
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
      textsize,
      ranksize,
      iconsize,
      calcClass,
      calcPointPlainText
    }
  }
})
</script>

<style scoped>
@import url("@/style/rank.css");

</style>
