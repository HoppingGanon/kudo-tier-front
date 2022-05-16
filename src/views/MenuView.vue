<template>
  <div class="home">
    <ReviewTable msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReviewTable from '@/components/ReviewTable.vue' // @ is an alias to /src

export default defineComponent({
  name: 'MenuView',
  components: {
    ReviewTable
  }
})
</script>
