<template>
  <v-list v-if="always">
    <v-list-item
      v-for="(item, i) in reviewPointTypeArray"
      :key="i"
      :style="listColor"
      @click="updatePointTypeProxy(item)"
      class="cursor-pointer"
    >
      <v-list-item-title v-if="item === modelValue" class="font-weight-bold" v-text="item"></v-list-item-title>
      <v-list-item-title v-else v-text="item"></v-list-item-title>
    </v-list-item>
  </v-list>
  <v-menu v-else v-model="menu">
    <template v-slot:activator="{ props}">
      <v-btn flat icon @click="menu = true" v-bind="props">
        <v-icon>
          mdi-cached
        </v-icon>
      </v-btn>
    </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            表示形式
          </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="(item, i) in reviewPointTypeArray"
          :key="i"
          @click="updatePointTypeProxy(item)"
          class="cursor-pointer"
        >
          <v-list-item-title v-if="item === modelValue" class="font-weight-bold" v-text="item"></v-list-item-title>
          <v-list-item-title v-else v-text="item"></v-list-item-title>
        </v-list-item>
      </v-list>
  </v-menu>
</template>

<script lang="ts">
import { ReviewPointType, reviewPointTypeArray } from '@/common/review'
import { defineComponent, PropType, ref } from 'vue'
import vuetify from '@/plugins/vuetify'

export default defineComponent({
  name: 'PointTypeSelector',
  components: {},
  props: {
    modelValue: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    },
    /** trueを指定すると、メニュー表示ではなく常に表示する */
    always: {
      type: Boolean,
      default: false as boolean
    }
  },
  emits: {
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const menu = ref(false)

    const updatePointTypeProxy = (pointType: ReviewPointType) => {
      emit('update', pointType)
      menu.value = false
    }

    const listColor = 'background: ' + vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry + ';'

    return {
      menu,
      reviewPointTypeArray,
      updatePointTypeProxy,
      listColor
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
