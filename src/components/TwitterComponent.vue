<template>
  <v-container class="ma-0 pa-0" fluid>
    <Tweet
      v-if="isTw(link)"
      :tweet-url="link"
    />
    <v-card v-else class="dotted-border" min-height="50px" flat>
      <div style="text-align: center;">
        <v-icon>
          mdi-cancel
        </v-icon>
        <br />
        ツイートが表示できません
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tweet from 'vue-tweet'

export default defineComponent({
  name: 'TwitterComponent',
  components: {
    Tweet
  },
  props: {
    link: {
      type: String,
      required: true
    }
  },
  setup () {
    const linkReg = /^https:\/\/twitter\.com\/.*/

    const isTw = (link: string) => {
      console.log(link)
      return linkReg.test(link)
    }

    return {
      isTw
    }
  }
})
</script>

<style scoped>

.dotted-border {
  border: 3px lightgray dashed;
  height: 100%;
  border-radius: 10px;
}
</style>
