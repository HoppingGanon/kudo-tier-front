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
              <span class="font-weight-bold" :class="isSummary ? 'no-break' : 'text-h5'" v-text="dispName"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span v-if="isSummary" class="text-subtitle-1">
                Tier数: <span v-text="tierCount" /><br/>
                レビュー数: <span v-text="reviewCount" />
              </span>
              <span v-else class="text-subtitle-1">
                Tier数: <span v-text="tierCount" />
                レビュー数: <span v-text="reviewCount" />
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mt-3">
              <div :class="isSummary ? 'no-break-box-2' : ''">
                <span v-text="profile" />
              </div>
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
    },
    tierCount: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isSummary: {
      type: Boolean,
      default: false
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
