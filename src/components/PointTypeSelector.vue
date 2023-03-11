<!-- ポイント表示方法を切り替えるコンポーネント -->

<template>
  <v-list v-if="always && !isSelect">
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      :style="listColor"
      @click="updatePointTypeProxy(item)"
      class="cursor-pointer"
    >
      <v-list-item-title v-if="item === modelValue" class="font-weight-bold text-h6" v-text="item"></v-list-item-title>
      <v-list-item-title v-else v-text="item"></v-list-item-title>
    </v-list-item>
  </v-list>
  <v-select
    v-else-if="always"
    label="表示形式"
    @update:model-value="$emit('update', $event)"
    :model-value="modelValue"
    :items="items"
  />
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
          v-for="(item, i) in items"
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
import { computed, defineComponent, PropType, ref } from 'vue'
import vuetify from '@/plugins/vuetify'

export default defineComponent({
  name: 'PointTypeSelector',
  props: {
    /** ポイント表示方法 */
    modelValue: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    },
    /** メニュー表示ではなく常に表示する */
    always: {
      type: Boolean,
      default: false as boolean
    },
    /** alwaysとこのプロパティを両方trueを指定すると、v-selectで表示する */
    isSelect: {
      type: Boolean,
      default: false as boolean
    },
    /** unlimitedを表示しない */
    excludeUnlimited: {
      type: Boolean,
      default: false as boolean
    }
  },
  emits: {
    /**
     * ポイント表示タイプの更新の際のイベント
     * @param value ポイント表示タイプ
     */
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

    const items = computed(() => {
      if (props.excludeUnlimited) {
        return reviewPointTypeArray.filter((v) => v !== 'unlimited')
      }
      return reviewPointTypeArray
    })

    return {
      menu,
      items,
      updatePointTypeProxy,
      listColor
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
