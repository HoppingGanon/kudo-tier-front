<!-- シェアボタンのコンポーネント -->

<template>
  <a :href="twitterUrl" rel="nofollow" class="no-link ml-1" target="_blank">
    <v-btn class="text-no-transform text-caption pa-2" color="#00acee" style="color: white;">
      <v-icon>mdi-twitter</v-icon>
      ツイートする
    </v-btn>
  </a>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ShareButtons',
  components: {},
  props: {
    /** シェアするリンク */
    link: {
      type: String,
      required: true
    },
    /** シェアする本文 */
    body: {
      type: String
    },
    /** 追加するハッシュタグの配列 */
    hashTags: {
      type: Array as PropType<string[]>
    }
  },
  emits: {},
  setup (props) {
    const twitterUrl = computed(() => {
      const url = 'http://twitter.com/share'
      const list: string[] = []
      if (props.body) {
        list.push(`text=${encodeURIComponent(props.body)}`)
      }
      if (props.hashTags) {
        list.push(`hashtags=${props.hashTags.join(',')}`)
      }
      if (props.link) {
        list.push(`url=${props.link}`)
      }
      if (list.length > 0) {
        return `${url}?${list.join('&')}`
      }
      return url
    })
    return {
      twitterUrl
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
