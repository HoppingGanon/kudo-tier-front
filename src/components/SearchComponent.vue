<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="5" md="7" lg="6" xl="5">
        <v-text-field
          :model-value="modelValue"
          @update:model-value="$emit('update', $event)"
          label="検索"
          prepend-inner-icon="mdi-magnify"
          hint="検索ワードを指定してください"
        />
      </v-col>
      <v-col cols="4" sm="3" md="2" lg="2" xl="1">
        <v-select
          :model-value="targetItem"
          @update:model-value="$emit('updateTargetItem', $event)"
          label="検索対象"
          :items="targetItems"
          item-title="text"
          item-value="value"
          return-object
        />
      </v-col>
      <v-col cols="8" sm="4" md="3" lg="3" xl="2">
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
import { SelectObject, TierContentType, TierSortType } from '@/common/page'

export default defineComponent({
  name: 'SearchComponent',
  components: {},
  props: {
    modelValue: {
      type: String,
      required: true
    },
    sortItems: {
      type: Object as PropType<SelectObject[]>,
      required: true
    },
    targetItems: {
      type: Object as PropType<SelectObject[]>,
      required: true
    },
    sortItem: {
      type: Object as PropType<SelectObject>,
      required: true
    },
    targetItem: {
      type: Object as PropType<SelectObject>,
      required: true
    }
  },
  emits: {
    update: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    updateSortItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: SelectObject<TierSortType>) => true,
    updateTargetItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: SelectObject<TierContentType>) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
