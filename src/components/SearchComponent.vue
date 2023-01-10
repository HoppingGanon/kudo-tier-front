<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-col cols="12" sm="8" md="9" lg="9" xl="10">
        <v-text-field
          :model-value="modelValue"
          @update:model-value="$emit('update', $event)"
          label="検索"
          prepend-inner-icon="mdi-magnify"
          hint="検索ワードを指定してください"
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
import { SelectObject, TierSortType } from '@/common/page'

export default defineComponent({
  name: 'SearchComponent',
  components: {},
  props: {
    modelValue: {
      type: String,
      required: true
    },
    sortItems: {
      type: Array as PropType<SelectObject[]>,
      required: true
    },
    sortItem: {
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
      v: SelectObject<TierSortType>) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
