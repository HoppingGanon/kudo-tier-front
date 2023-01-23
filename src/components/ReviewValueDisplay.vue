<template>
  <div v-if="pointType == 'stars'">
    <!-- starsの評価表示 -->
    <span v-if="compact">
      <v-icon color="orange" dark  :small="displaySize === 'smaller'" :large="displaySize === 'larger'"> mdi-star </v-icon>
      <span v-text="point"></span>
    </span>
    <span v-else>
      <v-icon v-for="n of point" :key="n" color="orange" dark :small="displaySize === 'smaller'" :large="displaySize === 'larger'"> mdi-star </v-icon>
      <v-icon v-for="n of (5 - point)" :key="n" color="black" dark :small="displaySize === 'smaller'" :large="displaySize === 'larger'"> mdi-star </v-icon>
    </span>
  </div>
  <div v-else-if="pointType == 'rank7'" :class="displaySize === 'normal' ? '' : ('size-' + displaySize)" >
    <!--rank7の評価表示 -->
    <div v-if="point <= 0" class="rank" :class="reverse ? 'reverse r-e' : 'e'">E</div>
    <div v-else-if="point == 1" class="rank" :class="reverse ? 'reverse r-d' : 'd'">D</div>
    <div v-else-if="point == 2" class="rank" :class="reverse ? 'reverse r-c' : 'c'">C</div>
    <div v-else-if="point == 3" class="rank" :class="reverse ? 'reverse r-b' : 'b'">B</div>
    <div v-else-if="point == 4" class="rank" :class="reverse ? 'reverse r-a' : 'a'">A</div>
    <div v-else-if="point == 5" class="rank" :class="reverse ? 'reverse r-s' : 's'">S</div>
    <div v-else-if="point > 5" class="rank" :class="reverse ? 'reverse r-ss' : 'ss'">SS</div>
  </div>
  <div v-else-if="pointType == 'rank14'" :class="displaySize === 'normal' ? '' : ('size-' + displaySize)" >
    <!-- rank14の評価表示 -->
    <div v-if="point <= 0" class="rank" :class="reverse ? 'reverse r-e' : 'e'">E</div>
    <div v-else-if="point == 1" class="rank" :class="reverse ? 'reverse r-e' : 'e'">E+</div>
    <div v-else-if="point == 2" class="rank" :class="reverse ? 'reverse r-d' : 'd'">D</div>
    <div v-else-if="point == 3" class="rank" :class="reverse ? 'reverse r-d' : 'd'">D+</div>
    <div v-else-if="point == 4" class="rank" :class="reverse ? 'reverse r-c' : 'c'">C</div>
    <div v-else-if="point == 5" class="rank" :class="reverse ? 'reverse r-c' : 'c'">C+</div>
    <div v-else-if="point == 6" class="rank" :class="reverse ? 'reverse r-b' : 'b'">B</div>
    <div v-else-if="point == 7" class="rank" :class="reverse ? 'reverse r-b' : 'b'">B+</div>
    <div v-else-if="point == 8" class="rank" :class="reverse ? 'reverse r-a' : 'a'">A</div>
    <div v-else-if="point == 9" class="rank" :class="reverse ? 'reverse r-a' : 'a'">A+</div>
    <div v-else-if="point == 10" class="rank" :class="reverse ? 'reverse r-s' : 's'">S</div>
    <div v-else-if="point == 11" class="rank" :class="reverse ? 'reverse r-s' : 's'">S+</div>
    <div v-else-if="point == 12" class="rank" :class="reverse ? 'reverse r-ss' : 'ss'">SS</div>
    <div v-else-if="point > 12" class="rank" :class="reverse ? 'reverse r-ss' : 'ss'">SS+</div>
  </div>
  <div v-else-if="compact">
    <!-- score, point, unlimitedのコンパクト評価表示 -->
    <span class="ml-1" v-text="point"></span>
  </div>
  <v-card v-else-if="pointType == 'score'" :width="barWidth" height="100%" >
    <!-- scoreの評価表示 -->
    <v-card flat :class="compact ? '' : 'bar'" :style="calcBarStyle(point, 10)" height="100%">
      <span class="ml-1" v-text="point"></span>
    </v-card>
  </v-card>
  <v-card v-else-if="pointType == 'point'" :width="barWidth" height="100%"  >
    <!-- pointの評価表示 -->
    <v-card flat :class="compact ? '' : 'bar'" :style="calcBarStyle(point, 100)" height="100%" >
      <span class="ml-1" v-text="point"></span>
    </v-card>
  </v-card>
  <div v-else-if="pointType == 'unlimited'" :width="barWidth" >
    <!-- unlimitedの評価表示 -->
    <b><span class="ml-1" v-text="point"></span></b>
  </div>
</template>

<script lang="ts">
import { ReviewPointType, ReviewFunc, PointDisplaySize } from '@/common/review'
import { defineComponent, PropType, computed } from 'vue'

export default defineComponent({
  name: 'ReviewValueStars',
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

.reverse {
  color: black;
  -webkit-text-stroke: 1px white;
  text-stroke: 1px white;
}

.r-ss{
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
}

.r-s{
  background: repeating-linear-gradient(
    -45deg,
    rgb(255,150,0) 0% 25%,
    rgb(255,240,80) 50% 50%,
    rgb(255,150,0) 75% 100%
  );
}

.r-a{
  background: repeating-linear-gradient(
    -45deg,
    rgb(80,180,255) 0% 25%,
    rgb(200,240,255) 50% 50%,
    rgb(80,180,255) 75% 100%
  );
}

.r-b{
  background: rgb(60,160,60);
}

.r-c{
  background: rgb(200,0,220);
}

.r-d{
  background: rgb(160,80,0);
}

.r-e{
  background: rgb(255,0,0);
}

.bar{
  background: linear-gradient(90deg, rgb(0, 255, 255, 0.5) 0% 0%, rgb(127, 127, 127, 0.5) 0% 100%);
  transition: all 1s both;
}

.size-larger {
  font-size: larger;
}
.size-smaller {
  font-size: smaller;
}

</style>
