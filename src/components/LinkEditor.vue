<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="7" md="6" lg="5" xl="5">
        <link-component
          :link="twitterLink"
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
          :clearable="true"
          @click:clear="$emit('clear')"
        />
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
    modelValue: {
      type: String,
      default: ''
    },
    rules: {
      type: Array as PropType<((v: string) => string | boolean)[]>,
      default: undefined
    }
  },
  emits: {
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    clear: () => true
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

    const linkrule = [(v: string) => {
      return twitterReg.test(v) || youtubeReg.test(v) || linkReg.test(v) || '不正なリンクです'
    }]

    const customRules = computed(() => props.rules ? props.rules.concat(linkrule) : linkrule)

    return {
      twitterLink,
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
