<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row dense :style="'background-color:' + bgColor">
      <v-col cols="2" sm="1" md="1" lg="1" xl="1">
        <v-icon dense>mdi-swap-vertical</v-icon><b>移動</b>
      </v-col>
      <v-col :cols="readonly ? 10 : 9" :sm="readonly ? 11 : 10" :md="readonly ? 11 : 10" :lg="readonly ? 11 : 10" :xl="readonly ? 11 : 10">
        <v-container fluid class="ma-0 pa-0">
          <v-row dense>
            <v-col cols="12" sm="6" md="4" lg="5" xl="6">
              <b>項目名</b>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="2">
              <b>種類</b>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
              <b>重要度</b>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col v-if="!readonly" cols="1" sm="1" md="1" lg="1" xl="1">
        <b>削除</b>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-container class="pa-0 ma-0" fluid>
          <draggable v-model="draggedParams" item-key="index" handle=".handle">
            <template #item="{ element, index }">
              <v-card class="mt-1 mb-1" flat>
                <v-container class="pa-0 ma-0" fluid>
                  <v-row dense>
                    <v-col cols="2" sm="1" md="1" lg="1" xl="1" class="mt-3">
                      <!-- 番号 -->
                      <v-container fluid class="cursor-grab fa fa-align-justify handle">
                        <v-icon>
                          mdi-drag-vertical-variant
                        </v-icon>
                      </v-container>
                    </v-col>
                    <v-col :cols="readonly ? 10 : 9" :sm="readonly ? 11 : 10" :md="readonly ? 11 : 10" :lg="readonly ? 11 : 10" :xl="readonly ? 11 : 10">
                      <v-container fluid class="ma-0 pa-0">
                        <v-row dense>
                          <v-col cols="12" sm="6" md="4" lg="5" xl="6">
                            <!-- ポイントの説明欄 -->
                            <span v-if="readonly" v-text="element.name"></span>
                            <v-text-field
                              v-else
                              label="項目名"
                              class="mt-1"
                              :model-value="element.name"
                              @update:model-value="$emit('updateName', $event, index)"
                              hint="項目名には短い名前を入力してください"
                              dense
                              :rules="rules"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" md="3" lg="2" xl="2">
                            <!-- ポイントの説明欄 -->
                            <span v-if="readonly" v-text="element.isPoint ? 'ポイント' : '情報'"></span>
                            <v-select
                              v-else
                              label="項目の種類"
                              class="mt-1"
                              :model-value="element.isPoint ? 'ポイント' : '情報'"
                              @update:model-value="updateIsPointProxy($event, index)"
                              :items="isPointSelection"
                              dense
                            />
                          </v-col>
                          <v-col v-if="element.isPoint" cols="12" sm="12" md="5" lg="5" xl="4">
                            <!-- ポイントのスライダー -->
                            <v-slider
                              class="mt-4 pt-4"
                              color="primary"
                              :model-value="element.weight"
                              @update:model-value="updateWeightProxy($event, index)"
                              :min="5"
                              :max="100"
                              :step="5"
                              label="重要度"
                              dense
                              persistent-hint
                              thumb-label="always"
                              :readonly="readonly"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                    <v-col v-if="!readonly" cols="1" sm="1" md="1" lg="1" xl="1">
                      <v-btn class="mt-2" icon flat @click="$emit('removeItem', index)">
                        <v-icon>
                          mdi-window-close
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </template>
          </draggable>
        </v-container>
      </v-col>
    </v-row>
    <v-row class="justify-end">
      <div>
        <v-card-text>
          <span class="error-transition" :class="requiredPoint && !hasPoint ? 'error-transition-1' : 'error-transition-0'">
            少なくとも一つの評価項目(種類: ポイント)が必要です。
          </span>
        </v-card-text>
      </div>
    </v-row>
    <v-row v-if="!readonly" class="justify-end pb-3">
      <v-card flat class="ma-3">
        <v-btn color="primary" @click="addItemProxy">
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
import vuetify from '@/plugins/vuetify'
import { computed, defineComponent, PropType, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'WeightSettings',
  components: {
    draggable
  },
  props: {
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true,
      default: () => [] as PropType<ReviewFactorParam[]>
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array as PropType<((v: string) => string | boolean)[]>,
      default: undefined
    },
    requiredPoint: {
      type: Boolean,
      default: false
    },
    maxLen: {
      type: Number,
      default: 16
    }
  },
  emits: {
    updateParams: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewFactorParam[]) => true,
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
  computed: {
    draggedParams: {
      get () : ReviewFactorParam[] {
        return this.params
      },
      set (v: ReviewFactorParam[]) {
        this.$emit('updateParams', v)
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const toast = useToast()
    const bgColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry

    const updateIsPointProxy = (v: string, i: number) => {
      emit('updateIsPoint', v === 'ポイント', i)
    }
    const updateWeightProxy = (v: number, i: number) => {
      emit('updateWeight', Math.floor(v / 5) * 5, i)
    }
    const addItemProxy = () => {
      if (props.params.length < props.maxLen) {
        emit('addItem')
      } else {
        toast.warning(`追加できる項目は${props.maxLen}個までです`)
      }
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

    const sortDialog = ref(false)
    const openSortDialog = () => {
      sortDialog.value = true
    }

    return {
      updateWeightProxy,
      updateIsPointProxy,
      addItemProxy,
      isPointSelection,
      hasPoint,
      discriptions,
      sortDialog,
      openSortDialog,
      bgColor
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
