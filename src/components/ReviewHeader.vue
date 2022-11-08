<template>
  <v-card flat>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <a :href="userLink">
            <v-avatar>
              <v-img :src="iconUrl" />
            </v-avatar>
          </a>
        </v-col>
        <v-col cols="9">
          <a :href="userLink">
            <p class="no-break">
              <span v-text="dispName"></span><br />
              <span v-text="lastWriteTime"></span>に更新
            </p>
          </a>
        </v-col>
        <!-- Tierのヘッダに使用する場合は、undefinedとなる -->
        <v-col v-if="pointType !== undefined" cols="1">
          <v-menu v-model="menu">
            <template v-slot:activator="{ isActive, props}">
              <v-icon
                @click="menu = true"
                class="cursor-pointer"
                v-on="isActive"
                v-bind="props"
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
                    <v-list-item-content @click="updatePointTypeEm(item)" class="cursor-pointer">
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
    userLink: {
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
      type: Object as PropType<ReviewPointType>
    }
  },
  emits: {
    updatePointType: (value: ReviewPointType) => true
  },
  setup (props, { emit }) {
    const displayTypes = ref(reviewPointTypeArray)
    const menu = ref(false)
    const updatePointTypeEm = (pointType: ReviewPointType) => {
      emit('updatePointType', pointType)
      menu.value = false
    }
    return {
      displayTypes,
      menu,
      updatePointTypeEm,
      scroll
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
a{
  color:inherit;
  text-decoration: none;
}
</style>
