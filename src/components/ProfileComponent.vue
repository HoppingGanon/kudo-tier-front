<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" sm="2" md="2" lg="2" xl="2">
        <div class="avatar-space">
          <v-avatar size="100%">
            <v-img :src="iconUrl" />
          </v-avatar>
        </div>
      </v-col>
      <v-col>
        <v-container class="pa-0 ma-0" fluid>
          <v-row>
            <v-col>
              <span class="text-h5" v-text="dispName"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="text-subtitle-1">
                Tier数: <span v-text="0" />
                レビュー数: <span v-text="0" />
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-text v-text="profile" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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

<style scoped>
.avatar-space {
  aspect-ratio: 1;
  width: 100%;
}
</style>
