<template>
  <div>
    <EasyDataTable
      :headers='headers'
      :items='items'
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestView',
  setup () {
    const headers = [
      {
        text: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' }
    ]

    const items = [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0
      }
    ]
    return { headers, items }
  }
})
</script>
