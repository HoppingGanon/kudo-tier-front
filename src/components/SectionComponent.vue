<template>
  <v-card flat fluid>
    <p>
      <span class="text-subtitle-1">
        <span v-text="section.title"></span>
      </span>
      <br/>
      <span class="break-word" v-for="factor,index in section.factors" :key="index">
        <span v-text="factor.body"></span>
        <br v-if="index !== (section.factors.length - 1)" />
      </span>
    </p>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ReviewSection } from '@/common/review'

export default defineComponent({
  name: 'SectionComponent',
  components: {},
  props: {
    section: {
      type: Object as PropType<ReviewSection>,
      required: true
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
