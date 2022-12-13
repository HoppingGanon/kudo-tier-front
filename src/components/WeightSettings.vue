<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row v-for="param,i in params" :key="i" dense>
      <v-col cols="2" sm="1" md="1" lg="1" xl="1" class="mt-3">
        <!-- 番号 -->
        <span v-text="(i+1)" />
      </v-col>
      <v-col cols="9" sm="10" md="10" lg="10" xl="10">
        <v-container fluid class="ma-0 pa-0">
          <v-row dense>
            <v-col cols="12" sm="6" md="4" lg="5" xl="6">
              <!-- ポイントの説明欄 -->
              <span v-if="readonly" v-text="param.name"></span>
              <v-text-field
                v-else
                label="項目名"
                :model-value="param.name"
                @update:model-value="$emit('updateName', $event, i)"
                hint="項目名には短い名前を入力してください"
                dense
                :rules="rules"
              />
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="2">
              <!-- ポイントの説明欄 -->
              <v-select
                label="項目の種類"
                :model-value="param.isPoint ? 'ポイント' : '情報'"
                @update:model-value="updateIsPointProxy($event, i)"
                :items="isPointSelection"
                dense
              >
              </v-select>
            </v-col>
            <v-col v-if="param.isPoint" cols="12" sm="6" md="3" lg="3" xl="3">
              <!-- ポイントのスライダー -->
              <v-slider
                class="mt-3"
                color="primary"
                :model-value="param.weight"
                @update:model-value="updateWeightProxy($event, i)"
                :min="5"
                :max="100"
                :step="5"
                label="重要度"
                dense
                persistent-hint
                thumb-label="always"
              />
            </v-col>
            <v-col v-else cols="12" sm="10" md="5" lg="4" xl="4">
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="1" sm="1" md="1" lg="1" xl="1">
        <v-btn icon flat @click="$emit('removeItem', i)">
          <v-icon>
            mdi-window-close
          </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
        <v-divider />
      </v-col>
    </v-row>
    <v-row class="justify-end">
      <v-card flat>
        <v-card-text>
          <v-span class="error-transition" :class="requiredPoint && !hasPoint ? 'error-transition-1' : 'error-transition-0'">
            少なくとも一つの評価項目(種類: ポイント)が必要です。
          </v-span>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-if="!readonly" class="justify-end pb-3">
      <v-card flat class="pa-3">
        <v-btn color="primary" dark @click="$emit('addItem')">
          <v-icon>
            mdi-plus
          </v-icon> アイテム追加
        </v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewFactorParam } from '@/common/review'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'WeightSettings',
  components: {},
  props: {
    params: {
      type: Object as PropType<ReviewFactorParam[]>,
      required: true,
      default: () => [] as PropType<ReviewFactorParam[]>
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object as PropType<((v: string) => string | boolean)[]>,
      default: undefined
    },
    requiredPoint: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    updateName: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string, index: number) => true,
    updateIsPoint: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: boolean, index: number) => true,
    updateWeight: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: number, index: number) => true,
    addItem: () => true,
    removeItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const updateIsPointProxy = (v: string, i: number) => {
      emit('updateIsPoint', v === 'ポイント', i)
    }
    const updateWeightProxy = (v: number, i: number) => {
      emit('updateWeight', Math.floor(v / 5) * 5, i)
    }

    const isPointSelection = [
      'ポイント',
      '情報'
    ]

    const hasPoint = computed(() => props.params.filter((value) => value.isPoint).length !== 0)

    const discriptions = [
      'かなり控えめ',
      '控えめ',
      'やや控えめ',
      '普通',
      'やや重視',
      '重視',
      'かなり重視'
    ]

    return {
      updateWeightProxy,
      updateIsPointProxy,
      isPointSelection,
      hasPoint,
      discriptions
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.error-style {
  color: red;
}
.error-transition {
  color: red;
  transition: all 0.5s 0s ease;
}
.error-transition-0 {
  opacity: 0;
}
.error-transition-1 {
  opacity: 1;
}
</style>
