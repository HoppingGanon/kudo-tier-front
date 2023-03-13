<!-- 検索ヘッダのコンポーネント -->

<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="7" md="7" lg="8" xl="9">
        <v-text-field
          :model-value="modelValue"
          @update:model-value="$emit('update', $event)"
          label="検索"
          prepend-inner-icon="mdi-magnify"
          hint="検索ワードを指定してください"
        />
      </v-col>
      <v-col cols="8" sm="5" md="5" lg="4" xl="3">
        <v-select
          :model-value="sortItem"
          @update:model-value="$emit('updateSortItem', $event)"
          label="ソート順"
          :items="sortItems"
          item-title="text"
          item-value="value"
          return-object
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SelectObject, PostSortType } from '@/common/page'

export default defineComponent({
  name: 'SearchComponent',
  props: {
    /** 検索文字列 */
    modelValue: {
      type: String,
      required: true
    },
    /** ソート順の選択肢 */
    sortItems: {
      type: Array as PropType<SelectObject[]>,
      required: true
    },
    /** 指定したソート順 */
    sortItem: {
      type: Object as PropType<SelectObject>,
      required: true
    }
  },
  emits: {
    /** 検索文字列の更新イベント */
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    /** ソート順の更新イベント */
    updateSortItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: SelectObject<PostSortType>) => true
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
