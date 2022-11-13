<template>
  <v-card flat>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <a :href="userLink">
            <v-avatar>
              <v-img :src="iconUrl" />
            </v-avatar>
          </a>
        </v-col>
        <v-col cols="10">
          <a :href="userLink">
            <p class="no-break">
              <span v-text="dispName"></span><br />
              <span v-text="lastWriteTime"></span>に更新
            </p>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { reviewPointTypeArray, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'ReviewHeader',
  components: {},
  props: {
    dispName: {
      type: String,
      required: true
    },
    userLink: {
      type: String,
      required: true
    },
    lastWriteTime: {
      type: String,
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>
    }
  },
  emits: { },
  setup () {
    return { }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
a{
  color:inherit;
  text-decoration: none;
}
</style>
