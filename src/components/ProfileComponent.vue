<template>
  <v-card width="100%" height="360px" >
    <v-card-title>
      <v-card-avatar>
        <v-avatar size="80px">
          <v-img :src="iconUrl" />
        </v-avatar>
      </v-card-avatar>
      {{ dispName }}
    </v-card-title>
    <v-card-text>
      {{ profile }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileComponent',
  components: { },
  props: {
    dispName: {
      type: String,
      default: ''
    },
    iconUrl: {
      type: String,
      default: ''
    },
    profile: {
      type: String,
      default: ''
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
  }
})
</script>
