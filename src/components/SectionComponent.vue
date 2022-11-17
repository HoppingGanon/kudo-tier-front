<template>
  <v-card v-if="displayType === 'all'" flat fluid>
    <span class="break-word text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br/>
    <span class="break-word" v-for="factor,index in section.factors" :key="index">
      <span v-if="factor.type === 'text'" v-text="factor.body"></span>
      <span v-if="factor.type === 'twitterLink'">
        <twitter-component :link="factor.body" />
      </span>
      <br v-if="index !== (section.factors.length - 1)" />
    </span>
  </v-card>
  <v-card v-else-if="displayType === 'summary'" class="no-break" flat fluid >
    <span class="text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br />
    <span v-if="section.factors.length > 0">
      <span v-if="section.factors[0].type === 'text'" v-text="section.factors[0].body"></span>
      <span v-if="section.factors[0].type === 'twitterLink'">
        <twitter-component :link="section.factors[0].body" />
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
      type: Object as PropType<ReviewDisplayType>,
      required: true
    }
  },
  emits: {}
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>