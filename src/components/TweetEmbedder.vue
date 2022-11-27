<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="5" md="4" lg="3" xl="3">
        <twitter-component
          :link="modelValue"
        />
      </v-col>
      <v-col col="10" sm="6" md="7" lg="6" xl="5">
        <v-text-field
          label="ツイートリンク"
          hint="埋め込みたいツイートのリンクを指定してください。"
          :model-value="modelValue"
          @update:model-value="$emit('update', $event)"
        />
      </v-col>
      <v-col cols="2" sm="1" md="1" lg="1" xl="1">
        <v-btn icon flat>
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TwitterComponent from '@/components/TwitterComponent.vue'

export default defineComponent({
  name: 'TweetEmbedder',
  components: {
    TwitterComponent
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: {
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
