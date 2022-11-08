<template>
  <v-card v-if="pointType == 'stars'" fluid flat>
    <v-icon v-for="n of point" :key="n" color="orange" dark> mdi-star </v-icon>
    <v-icon v-for="n of (5 - point)" :key="n" color="black" dark> mdi-star </v-icon>
  </v-card>
  <v-card v-else-if="pointType == 'rank7'" :style="larger ? 'font-size: larger;' : ''" fluid flat>
    <span v-if="point <= 0" class="rank e">E</span>
    <span v-else-if="point == 1" class="rank d">D</span>
    <span v-else-if="point == 2" class="rank c">C</span>
    <span v-else-if="point == 3" class="rank b">B</span>
    <span v-else-if="point == 4" class="rank a">A</span>
    <span v-else-if="point == 5" class="rank s">S</span>
    <span v-else-if="point > 5" class="rank ss">SS</span>
  </v-card>
  <v-card v-else-if="pointType == 'rank14'" :style="larger ? 'font-size: larger;' : ''" fluid flat>
    <span v-if="point <= 0" class="rank e">E</span>
    <span v-else-if="point == 1" class="rank e">E+</span>
    <span v-else-if="point == 2" class="rank d">D</span>
    <span v-else-if="point == 3" class="rank d">D+</span>
    <span v-else-if="point == 4" class="rank c">C</span>
    <span v-else-if="point == 5" class="rank c">C+</span>
    <span v-else-if="point == 6" class="rank b">B</span>
    <span v-else-if="point == 7" class="rank b">B+</span>
    <span v-else-if="point == 8" class="rank a">A</span>
    <span v-else-if="point == 9" class="rank a">A+</span>
    <span v-else-if="point == 10" class="rank s">S</span>
    <span v-else-if="point == 11" class="rank s">S+</span>
    <span v-else-if="point == 12" class="rank ss">SS</span>
    <span v-else-if="point > 12" class="rank ss">SS+</span>
  </v-card>
  <v-card v-else-if="pointType == 'score'" class="bar" :style="calcBarStyle(point, 10)" fluid flat>
    <span class="ml-1" v-text="point"></span>
  </v-card>
  <v-card v-else-if="pointType == 'point'" class="bar" :style="calcBarStyle(point, 100)" fluid flat>
    <span class="ml-1" v-text="point"></span>
  </v-card>
  <v-card v-else-if="pointType == 'unlimited'" fluid flat>
    <span class="ml-1" v-text="point"></span>
  </v-card>
</template>

<script lang="ts">
import { ReviewFactor, ReviewPointType, ReviewPointDisplayType, ReviewDisplayType, ReviewFactorParam, ReviewFunc } from '@/common/review'
import { defineComponent, PropType, computed } from 'vue'

export default defineComponent({
  name: 'ReviewValueStars',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    },
    /// ランク表示の際に大きな文字で表示する
    larger: {
      type: Object as PropType<boolean>,
      default: false as boolean
    }
  },
  setup (props) {
    const point = computed(() => {
      return ReviewFunc.getReviewDisp(props.value, props.pointType)
    })

    // スコアバーの表示色を決定する
    const calcBarStyle = (p: number, max: number) => {
      const percent = 100 * p / max
      const r = percent < 50 ? percent < 10 ? 255 : 175 * (50 - percent) / 40 + 80 : 80
      const g = percent < 25 ? percent < 10 ? 0 : 255 * percent / 25 : 255
      const b = percent < 50 ? 0 : 255 * (percent - 50) / 50
      return `background: linear-gradient(90deg, rgb(${r}, ${g}, ${b}, 0.5) 0% ${percent}%, rgb(127, 127, 127, 0.5) ${percent}% 100%);`
      // background-color: rgba(0, 255, 255, 0.5);
    }
    return {
      point,
      calcBarStyle
    }
  }
})
</script>

<style scoped>
.rank {
  font-weight: bold;
  font-size: larger;
}

.ss{
  color: transparent;
  background: repeating-linear-gradient(
    -45deg,
    rgb(255,0,0) 0% 14.29%,
    rgb(255,160,0) 28.57% 28.57%,
    rgb(0,160,0) 42.86% 42.86%,
    rgb(0,160,255) 57.14% 57.14%,
    rgb(0,0,255) 71.43% 71.43%,
    rgb(255,0,255) 85.71% 85.71%,
    rgb(255,0,0) 100% 100%
  );
  background-clip: text;
}

.s{
  color: transparent;
  background: repeating-linear-gradient(
    -45deg,
    rgb(255,150,0) 0% 25%,
    rgb(255,240,80) 50% 50%,
    rgb(255,150,0) 75% 100%
  );
  background-clip: text;
}

.a{
  color: transparent;
  background: repeating-linear-gradient(
    -45deg,
    rgb(80,180,255) 0% 25%,
    rgb(200,240,255) 50% 50%,
    rgb(80,180,255) 75% 100%
  );
  background-clip: text;
}

.b{
  color: rgb(60,160,60);
}

.c{
  color: rgb(200,0,220);
}

.d{
  color: rgb(160,80,0);
}

.e{
  color: rgb(255,0,0);
}

.bar{
  background: linear-gradient(90deg, rgb(0, 255, 255, 0.5) 0% 0%, rgb(127, 127, 127, 0.5) 0% 100%);
  transition: all 1s both;
}

</style>
