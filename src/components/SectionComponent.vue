<template>
  <v-card v-if="displayType === 'list' || displayType === 'all'" flat>
    <span v-if="section.title" class="break-word text-subtitle-1 font-weight-bold" v-text="section.title">
    </span>
    <br v-if="section.title" />
    <div class="mt-1" v-for="parag,index in section.parags" :key="index">
      <span v-if="parag.type === 'text'">
        <span v-for="str, index2 of parag.body.split('\n')" :key="index2">
          <span class="break-word" v-text="str"></span>
          <br />
        </span>
      </span>
      <span v-if="parag.type === 'serviceLink'">
        <link-component :link="parag.body" />
      </span>
      <v-img
        v-if="parag.type === 'imageLink' && parag.body != ''"
        :src="getImgSource(parag.body)"
        :max-height="imgHeight"
      ></v-img>
    </div>
  </v-card>
  <v-card v-else-if="displayType === 'summary'" class="no-break" flat>
    <span v-if="section.title" class="text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br v-if="section.title" />
    <span v-if="section.parags.length > 0">
      <span v-if="section.parags[0].type === 'text'" v-text="section.parags[0].body"></span>
      <span v-if="section.parags[0].type === 'serviceLink'">
        <link-component :link="section.parags[0].body" />
      </span>
    </span>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ReviewDisplayType, ReviewSection } from '@/common/review'
import LinkComponent from '@/components/LinkComponent.vue'
import rules from '@/common/rules'
import { getImgSource } from '@/common/restapi'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export default defineComponent({
  name: 'SectionComponent',
  components: {
    LinkComponent
  },
  props: {
    section: {
      type: Object as PropType<ReviewSection>,
      required: true
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      default: 'all'
    },
    hideSectionTitle: {
      type: Boolean,
      dafault: false
    }
  },
  setup (props) {
    const display = useDisplay()
    return {
      title: computed(() => props.section.title),
      rulesFunc: rules,
      getImgSource,
      imgHeight: computed(() => {
        if (display.xs.value) {
          return Math.max(360, display.height.value / 2)
        } else if (display.sm.value) {
          return Math.max(360, display.height.value / 2)
        } else if (display.md.value) {
          return Math.max(360, display.height.value / 2)
        } else if (display.lg.value) {
          return Math.max(360, display.height.value / 2)
        } else if (display.xl.value) {
          return Math.max(360, display.height.value / 2)
        }
        return Math.max(360, display.height.value / 2)
      })
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
