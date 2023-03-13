<!-- Twitter,Youtube,内部リンク,外部リンクを編集するコンポーネント -->

<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="7" md="6" lg="5" xl="5">
        <link-component
          :link="link"
          :pre-link="modelValue"
        />
      </v-col>
      <v-col col="12" sm="5" md="6" lg="7" xl="7">
        <v-text-field
          label="リンク"
          hint="埋め込みたいリンクを指定してください。"
          :model-value="modelValue"
          @update:model-value="updateProxy"
          :rules="customRules"
        >
          <template v-slot:append-inner>
            <v-btn size="xsmall" icon color="error" flat @click="$emit('clear')">
              <v-icon size="small">mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import LinkComponent, { twitterReg, youtubeReg, linkReg } from '@/components/LinkComponent.vue'

export default defineComponent({
  name: 'LinkEditor',
  components: {
    LinkComponent
  },
  props: {
    /** リンク文字列 */
    modelValue: {
      type: String,
      default: ''
    },
    /** 入力規則 */
    rules: {
      type: Array as PropType<((v: string) => string | boolean)[]>,
      default: undefined
    }
  },
  emits: {
    /** リンクの文字列が更新される際のイベント */
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    /** リンクをクリアする際のイベント */
    clear: () => true
  },
  setup (props, { emit }) {
    const link = ref(props.modelValue)

    /*
     * リンクを更新した際、2秒間入力がなかった場合にのみ、Getを行うように調整
     */
    const updateProxy = (value: string) => {
      const preLink = value
      setTimeout(() => {
        if (preLink === props.modelValue) {
          link.value = props.modelValue
        }
      }, 2000)
      emit('update', value)
    }

    const linkrule = [(v: string) => {
      return twitterReg.test(v) || youtubeReg.test(v) || linkReg.test(v) || '不正なリンクです'
    }]

    const customRules = computed(() => props.rules ? props.rules.concat(linkrule) : linkrule)

    return {
      link,
      updateProxy,
      linkrule,
      customRules
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
