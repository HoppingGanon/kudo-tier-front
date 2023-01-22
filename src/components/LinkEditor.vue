<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="7" md="6" lg="5" xl="5">
        <link-component
          :link="twitterLink"
          :pre-link="modelValue"
        />
      </v-col>
      <v-col
        :col="removable ? 10 : 12"
        :sm="removable ? 4 : 5"
        :md="removable ? 5 : 6"
        :lg="removable ? 6 : 7"
        :xl="removable ? 6 : 7"
      >
        <v-text-field
          label="リンク"
          hint="埋め込みたいリンクを指定してください。"
          :model-value="modelValue"
          @update:model-value="updateProxy"
          :rules="rules ? rules.concat(linkrule) : linkrule"
        />
      </v-col>
      <v-col v-if="removable" cols="2" sm="1" md="1" lg="1" xl="1">
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
    },
    removable: {
      type: Boolean,
      default: false
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

    const linkrule = [(v: string) => {
      return twitterReg.test(v) || youtubeReg.test(v) || linkReg.test(v) || '不正なリンクです'
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
