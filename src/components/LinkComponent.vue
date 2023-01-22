<template>
  <div>
    <Tweet
      v-if="isTw"
      :tweet-url="link"
      @tweet-load-error="errorTw"
    />
    <div
      v-else-if="isYt"
      style="width: 100%; height: 360px;"
    >
      <Youtube
        :src="link"
        height="360px"
        width="100%"
        @error="errorYt"
      >
      </Youtube>
    </div>
    <a v-else-if="isInLink" :href="link" style="text-decoration: none;">
      <v-card height="96px" class="pa-3 ma-1">
        <span>TierReviews</span>
        <div class="no-break-box-2">
          <span v-text="link" class="text-caption" />
        </div>
      </v-card>
    </a>
    <v-card v-else-if="isExLink" @click="dialog = true" height="96px" class="pa-3 ma-1 cursor-pointer">
      <span>外部リンク</span>
      <div class="no-break-box-2">
        <span v-text="link" class="text-caption" />
      </div>
    </v-card>
    <v-card v-else class="dotted-border d-flex justify-center align-center" min-height="50px" flat>
      <div>
        <v-icon>
          mdi-cancel
        </v-icon>
        リンクが表示できません
      </div>
    </v-card>
  </div>

  <simple-dialog v-model="dialog"
    title="外部リンクへのアクセス"
    prepend-text="TierReviewsのサイト外へ移動しようとしています。"
    text="以下のリンクが安全でないと判断した場合は「閉じる」を押して前の画面に戻ってください"
    submit-button-text="移動"
    :append-text="link"
  >
    <template v-slot:submit-button>
      <a :href="link" style="text-decoration: none;">
        <v-btn style="text-decoration: none;color: black;">
          移動
        </v-btn>
      </a>
    </template>
  </simple-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue'
import Tweet from 'vue-tweet'
import Youtube from 'vue3-youtube'
import SimpleDialog from '@/components/SimpleDialog.vue'

export const linkReg = /^((http)|(https)):\/\/.*/
export const twitterReg = /^https:\/\/twitter\.com\/.*/
export const youtubeReg = /^https:\/\/www\.youtube\.com\/watch\?v=.*/
export const internalLink = new RegExp(`^${process.env.VUE_APP_BASE_URI}.*`)

export default defineComponent({
  name: 'LinkComponent',
  components: {
    Tweet,
    Youtube,
    SimpleDialog
  },
  props: {
    link: {
      type: String,
      required: true
    },
    preLink: {
      type: String
    }
  },
  setup (props) {
    const isErrorYt = ref(false)
    const isErrorTw = ref(false)

    const dialog = ref(false)

    const { preLink } = toRefs(props)
    watch(preLink, () => {
      isErrorYt.value = false
      isErrorTw.value = false
    })

    const isInLink = computed(() => {
      return internalLink.test(props.link)
    })

    const isExLink = computed(() => {
      return linkReg.test(props.link)
    })

    const isTw = computed(() => {
      return !isErrorTw.value && twitterReg.test(props.link)
    })

    const isYt = computed(() => {
      return !isErrorYt.value && youtubeReg.test(props.link)
    })

    const errorYt = () => {
      isErrorYt.value = true
    }

    const errorTw = () => {
      isErrorTw.value = true
    }

    const goOther = () => {
      window.open(props.link, '_blank')
    }

    return {
      isInLink,
      isExLink,
      dialog,
      isErrorTw,
      isTw,
      isYt,
      errorYt,
      errorTw,
      goOther
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
