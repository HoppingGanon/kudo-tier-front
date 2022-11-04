<template>
  <v-card flat>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <v-avatar>
            <v-img :src="iconUrl" />
          </v-avatar>
        </v-col>
        <v-col>
          <p class="no-break">
            <span v-text="dispName"></span><br />
            <span v-text="lastWriteTime"></span>に更新
          </p>
        </v-col>
        <v-col cols="1">
          <v-menu>
            <template v-slot:activator="{ isActive, props }">
              <v-icon
                v-bind="props"
                v-on="isActive"
                class="cursor-pointer"
                >
                mdi-dots-vertical
              </v-icon>
            </template>
              <v-list>
                <v-list-item-group
                  v-model="displayTypes"
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in displayTypes"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import { reviewPointTypeArray, ReviewPointType } from '@/common/review'

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
    },
    modelValue: {
      type: Object as PropType<ReviewPointType>,
      required: true
    }
  },
  emit: [
    'update:modelValue'
  ],
  setup () {
    const displayTypes = ref(reviewPointTypeArray)
    return {
      displayTypes
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
