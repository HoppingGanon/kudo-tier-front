<template>
  <v-card :width="width" :min-height="minHeight" >
    <v-container>
      <v-row class="align-center">
        <v-col>
          <review-header
            v-if="!noHeader"
            :icon-url="review.userIconUrl"
            :disp-name="review.userName"
            :user-link="baseLink + review.userId"
            :last-write-time="lastWriteTime"
            :pointType="review.pointType"
            @updatePointType="updatePointTypeEm"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-subtitle-1"><span v-text="review.name"></span></p>
            <p class="text-h6"><b><span v-text="review.title"></span></b></p>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <v-card flat>
            <p class="mt-2">
              <span v-if="review.pointType == 'stars'">総合：</span>
              <span v-else-if="review.pointType == 'rank7'">総合ランク：</span>
              <span v-else-if="review.pointType == 'rank14'">総合ランク：</span>
              <span v-else-if="review.pointType == 'score'">総合スコア：</span>
              <span v-else-if="review.pointType == 'point'">総合点：</span>
              <span v-else-if="review.pointType == 'unlimited'">合計：</span>
            </p>
          </v-card>
        </v-col>
        <v-col cols="2" v-if="!noChangePoint">
          <v-menu v-model="menu">
            <template v-slot:activator="{ isActive, props}">
              <v-icon
                @click="menu = true"
                class="cursor-pointer"
                v-on="isActive"
                v-bind="props"
                >
                mdi-cached
              </v-icon>
            </template>
              <v-list>
                <v-list-item-group
                  v-model="displayTypes"
                  color="primary"
                >
                  <v-list-item>
                    <v-list-item-title>
                      表示形式
                    </v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item
                    v-for="(item, i) in displayTypes"
                    :key="i"
                  >
                    <v-list-item-content @click="updatePointTypeEm(item)" class="cursor-pointer">
                      <v-list-item-title v-if="item===review.pointType" class="strong" v-text="item"></v-list-item-title>
                      <v-list-item-title v-else v-text="item"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
          </v-menu>

        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <review-value-display
              :point-type="review.pointType"
              :value="average"
              display-size="larger"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <v-divider/>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <review-values
            :factors="review.reviewFactors"
            :display-type="displayType"
            :point-display-type="pointDisplayType"
            :point-type="review.pointType"
            :review-factor-params="review.reviewFactorParams"
            @update-point-type="updatePointTypeEm"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'summary'">
        <v-col>
          <v-card class="ma-3" flat v-if="review.sections.length > 0">
            <section-component :section="review.sections[0]" :display-type="displayType" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <v-card class="ma-3" flat v-for="section,index in review.sections" :key="index">
            <section-component :section="section" :display-type="displayType" />
            <v-divider v-if="index !== (review.sections.length - 1)" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { Review, ReviewDisplayType, ReviewPointDisplayType, ReviewPointType, reviewPointTypeArray, ReviewFunc } from '@/common/review'
import CommonApi from '@/common/commonapi'
import SectionComponent from '@/components/SectionComponent.vue'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewValues from '@/components/ReviewValues.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewCard',
  components: {
    SectionComponent,
    ReviewHeader,
    ReviewValues,
    ReviewValueDisplay
  },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    pointDisplayType: {
      type: Object as PropType<ReviewPointDisplayType>,
      default: false as boolean
    },
    noHeader: {
      type: Object as PropType<boolean>,
      default: false as boolean
    },
    noChangePoint: {
      type: Object as PropType<boolean>,
      default: false as boolean
    },
    width: {
      type: String,
      default: '100%'
    },
    minHeight: {
      type: String,
      default: '100%'
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props, { emit }) {
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.review.updateAt, true)
    })

    const average = computed(() => {
      return ReviewFunc.calcAaverage(props.review)
    })
    const displayTypes = ref(reviewPointTypeArray)
    const menu = ref(false)
    const updatePointTypeEm = (pointType: ReviewPointType) => {
      emit('updatePointType', pointType)
      menu.value = false
    }

    const baseLink = (process.env.VUE_APP_BASE_URI as string) + '/home/'

    const expansion = ref(false)

    return {
      lastWriteTime,
      average,
      baseLink,
      expansion,
      displayTypes,
      menu,
      updatePointTypeEm
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
