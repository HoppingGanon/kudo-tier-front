<template>
  <v-card width="100%" min-height="160px" >
    <v-container>
      <v-row class="align-center">
        <v-col cols="2">
          <v-card flat>
            <v-avatar>
              <v-img :src="iconUrl" />
            </v-avatar>
          </v-card>
        </v-col>
        <v-col cols="10">
          <v-card flat>
            <p class="textBox">{{ createdTime }}<br />
            {{ dispName }}</p>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="ma-3" flat>
            {{ review.title }}
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Review, ReviewPointType, ReviewDisplayType } from '@/common/review'
import CommonApi from '@/common/commonapi'

export default defineComponent({
  name: 'ReviewCard',
  components: { },
  props: {
    dispName: {
      type: String,
      default: ''
    },
    iconUrl: {
      type: String,
      default: ''
    },
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      default: () => 'summary' as ReviewDisplayType
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props) {
    const createdTime = computed(() => {
      return CommonApi.dateToString(props.review.createAt, true)
    })

    return {
      createdTime
    }
  }
})
</script>

<style scoped>
.textBox {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
