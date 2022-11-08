<template>
  <blockquote v-if="isTw" class="twitter-tweet">
    <a  :href="link">ツイートを読み込み中...</a>
  </blockquote>
  <span v-else>ツイートが表示できません</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TwitterComponent',
  props: {
    link: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const linkReg = /^https:\/\/twitter\.com\/.*/

    const isTw = (linkReg.test(props.link))

    return {
      isTw
    }
  }
})
</script>
