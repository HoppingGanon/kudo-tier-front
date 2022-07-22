<template>
  <v-card flat>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <v-avatar>
            <v-img :src="iconUrl" />
          </v-avatar>
        </v-col>
        <v-col cols="10">
          <p class="no-break">
            <span v-text="dispName"></span><br />
            <span v-text="lastWriteTime"></span>に更新
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ReviewHeader',
  components: {},
  props: {
    dispName: {
      type: String,
      required: true
    },
    lastWriteTime: {
      type: String,
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>
