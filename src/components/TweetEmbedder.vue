<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="5" md="4" lg="3" xl="3">
        <twitter-component
          :link="twitterLink"
        />
      </v-col>
      <v-col col="10" sm="6" md="7" lg="8" xl="8">
        <v-text-field
          label="ツイートリンク"
          hint="埋め込みたいツイートのリンクを指定してください。"
          :model-value="modelValue"
          @update:model-value="updateProxy"
          :rules="rules ? rules.concat(linkrule) : linkrule"
        />
      </v-col>
      <v-col cols="2" sm="1" md="1" lg="1" xl="1">
        <v-btn icon flat @click="$emit('remove')">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
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
    },
    rules: {
      type: Object as PropType<((v: string) => string | boolean)[]>,
      default: undefined
    }
  },
  emits: {
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    remove: () => true
  },
  setup (props, { emit }) {
    const twitterLink = ref(props.modelValue)

    /*
     * リンクを更新した際、2秒間入力がなかった場合にのみ、Twitterに対してGetを行うように調整
     */
    const updateProxy = (value: string) => {
      const preLink = value
      setTimeout(() => {
        if (preLink === props.modelValue) {
          twitterLink.value = props.modelValue
        }
      }, 2000)
      emit('update', value)
    }

    const linkReg = /^https:\/\/twitter\.com\/.*/
    const linkrule = [(v: string) => {
      return linkReg.test(v) || '不正なリンクです'
    }]
    return {
      twitterLink,
      updateProxy,
      linkrule
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
