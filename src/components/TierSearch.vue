<template>
  <v-container class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
    <v-row>
      <v-col>
        <search-component
          :model-value="text"
          :sort-item="sortItem"
          :target-item="targetItem"
          :sort-items="tierSortTypeList"
          :target-items="tierContentTypeList"
          @update="text = $event"
          @update-sort-item="updateSortItem"
          @update-target-item="updateTargetItem"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <tier-list :tiers="tiers" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Tier } from '@/common/review'
import { tierSortTypeList, tierContentTypeList, TierSortType, TierContentType, SelectObject } from '@/common/page'
import TierList from '@/components/TierList.vue'
import SearchComponent from '@/components/SearchComponent.vue'

export default defineComponent({
  name: 'TierSearch',
  components: {
    SearchComponent,
    TierList
  },
  props: {
    tiers: {
      type: Object as PropType<Tier[]>,
      required: true
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const text = ref('')
    const sortItem = ref(tierSortTypeList[0])
    const targetItem = ref(tierContentTypeList[0])

    const updateSortItem = (v: SelectObject<TierSortType>) => {
      sortItem.value = v
    }

    const updateTargetItem = (v: SelectObject<TierContentType>) => {
      targetItem.value = v
    }

    return {
      text,
      tierSortTypeList,
      tierContentTypeList,
      sortItem,
      targetItem,
      updateSortItem,
      updateTargetItem
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
