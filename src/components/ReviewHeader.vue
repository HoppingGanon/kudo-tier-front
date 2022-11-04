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
                mdi-message-alert-outline
              </v-icon>
            </template>
              <v-list>
                <v-list-item-group
                  v-model="displayTypes"
                  color="primary"
                >
                  <v-list-item>
                    <v-list-item-title>
                      表示形式
                    </v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item
                    v-for="(item, i) in displayTypes"
                    :key="i"
                  >
                    <v-list-item-content @click="updatePointTypeEm(item)">
                      <v-list-item-title v-if="item===pointType" class="strong" v-text="item"></v-list-item-title>
                      <v-list-item-title v-else v-text="item"></v-list-item-title>
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
import { defineComponent, ref, PropType } from 'vue'
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
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {
    updatePointType: (value: ReviewPointType) => true
  },
  setup (props, { emit }) {
    const displayTypes = ref(reviewPointTypeArray)
    const updatePointTypeEm = (pointType: ReviewPointType) => {
      emit('updatePointType', pointType)
    }
    return {
      displayTypes,
      updatePointTypeEm
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
