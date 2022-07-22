<template>
  <v-card v-if="pointType == 'stars'" fluid flat>
    <v-icon v-for="n of point" :key="n" color="orange" dark> mdi-star </v-icon>
    <v-icon v-for="n of (5 - point)" :key="n" color="black" dark> mdi-star </v-icon>
  </v-card>
  <v-card v-else-if="pointType == 'rank7'" fluid flat>
    <span v-if="point <= 0" class="rank e">E</span>
    <span v-else-if="point == 1" class="rank d">D</span>
    <span v-else-if="point == 2" class="rank c">C</span>
    <span v-else-if="point == 3" class="rank b">B</span>
    <span v-else-if="point == 4" class="rank a">A</span>
    <span v-else-if="point == 5" class="rank s">S</span>
    <span v-else-if="point >= 6" class="rank ss">SS</span>
  </v-card>
  <v-card v-else-if="pointType == 'rank14'" fluid flat>
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
    <span v-else-if="point >= 13" class="rank ss">SS+</span>
  </v-card>
  <v-card v-else-if="pointType == 'point'" fluid flat>
    point
  </v-card>
  <v-card v-else-if="pointType == 'detail'" fluid flat>
    detail
  </v-card>
  <v-card v-else-if="pointType == 'unlimited'" fluid flat>
    unlimited
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
    }
  },
  setup (props) {
    const point = computed(() => {
      return ReviewFunc.getReviewDisp(props.value, props.pointType)
    })
    return {
      point
    }
  }
})
</script>

<style scoped>
.rank {
  font-weight: bold;
}

.ss{
  color: transparent;
  background: repeating-linear-gradient(
    45deg,
    rgb(255,0,0) 0px 0px,
    rgb(255,160,0) 3px 3px,
    rgb(0,160,0) 6px 6px,
    rgb(0,160,255) 9px 9px,
    rgb(0,0,255) 12px 12px,
    rgb(255,0,255) 15px 15px,
    rgb(255,0,0) 18px 18px
  );
  background-clip: text;
}

.s{
  color: transparent;
  background: repeating-linear-gradient(
    -45deg,
    rgb(255,150,0) 0px 6px,
    rgb(255,240,80) 9px 9px,
    rgb(255,150,0) 12px 18px
  );
  background-clip: text;
}

.a{
  color: transparent;
  background: repeating-linear-gradient(
    -45deg,
    rgb(80,180,255) 0px 6px,
    rgb(200,240,255) 9px 9px,
    rgb(80,180,255) 12px 18px
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

</style>
