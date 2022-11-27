<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row v-for="param,i in params" :key="i">
      <v-col cols="0.5" class="mt-3">
        <v-card flat>{{ i+1 }}:</v-card>
      </v-col>
      <v-col cols="3">
        <span v-if="readonly" v-text="param.name"></span>
        <v-text-field
          v-else
          label="項目名"
          :model-value="param.name"
          hint="短い名前を入力してください。"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          label="項目の種類"
          :model-value="param.isPoint ? 'ポイント' : '情報'"
          :items="isPointSelection"
        >
        </v-select>
      </v-col>
      <v-col v-if="param.isPoint" cols="3">
        <v-slider
          class="mt-3"
          color="primary"
          :model-value="param.weight"
          @update:model-value="updateWeightProxy($event, i)"
          :min="5"
          :max="100"
        />
      </v-col>
      <v-col v-if="param.isPoint" cols="2" class="mt-3">
        <v-card flat>
          <span v-text="discriptions[Math.floor(Math.min(param.weight / (100 / discriptions.length),discriptions.length - 1))]" />
          [{{ param.weight }}]
        </v-card>
      </v-col>
      <v-col v-else cols="5">
      </v-col>
      <v-col cols="1">
        <v-btn icon flat @click="$emit('removeItem', i)">
          <v-icon>
            mdi-window-close
          </v-icon>
        </v-btn>
      </v-col>
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
import { defineComponent, PropType } from 'vue'

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
      discriptions
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
