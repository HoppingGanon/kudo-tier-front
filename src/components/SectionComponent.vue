<template>
  <v-card v-if="displayType === 'all'" flat>
    <span v-if="section.title" class="break-word text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br v-if="section.title" />
    <span class="break-word" v-for="factor,index in section.parags" :key="index">
      <span v-if="factor.type === 'text'" v-text="factor.body"></span>
      <span v-if="factor.type === 'twitterLink'">
        <twitter-component :link="factor.body" />
      </span>
      <br v-if="index !== (section.parags.length - 1)" />
    </span>
  </v-card>
  <v-card v-else-if="displayType === 'summary'" class="no-break" flat>
    <span v-if="section.title" class="text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br v-if="section.title" />
    <span v-if="section.parags.length > 0">
      <span v-if="section.parags[0].type === 'text'" v-text="section.parags[0].body"></span>
      <span v-if="section.parags[0].type === 'twitterLink'">
        <twitter-component :link="section.parags[0].body" />
      </span>
    </span>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ReviewDisplayType, ReviewSection } from '@/common/review'
import TwitterComponent from '@/components/TwitterComponent.vue'

export default defineComponent({
  name: 'SectionComponent',
  components: {
    TwitterComponent
  },
  props: {
    section: {
      type: Object as PropType<ReviewSection>,
      required: true
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    }
  },
  emits: {}
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
