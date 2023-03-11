<!-- 評価項目の重みや情報を設定するコンポーネント -->

<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-row dense :style="'background-color:' + bgColor">
      <v-col cols="2" sm="1" md="1" lg="1" xl="1">
        <v-icon v-if="!readonly" dense>mdi-swap-vertical</v-icon>
          <br v-if="$vuetify.display.smAndDown" />
        <b v-if="!readonly">移動</b>
      </v-col>
      <v-col :cols="readonly ? 10 : 9" :sm="readonly ? 11 : 10" :md="readonly ? 11 : 10" :lg="readonly ? 11 : 10" :xl="readonly ? 11 : 10">
        <v-container fluid class="ma-0 pa-0">
          <v-row dense>
            <v-col v-if="showDetails" cols="12" sm="6" md="4" lg="5" xl="6">
              <b>項目名</b>
            </v-col>
            <v-col v-else cols="12" sm="12" md="7" lg="8" xl="9">
              <b>項目名</b>
            </v-col>
            <v-col v-if="showDetails" cols="12" sm="6" md="3" lg="2" xl="2">
              <b>種類</b>
            </v-col>
            <v-col v-if="showDetails" cols="12" sm="6" md="3" lg="3" xl="3">
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
          <draggable v-model="draggedParams" item-key="index" handle=".handle" :disabled="readonly">
            <template #item="{ element, index }">
              <v-card class="mt-1 mb-1" :style="index %2 === 0 ? 'background-color: light-gray' : ''" flat>
                <v-container class="pa-0 ma-0" fluid>
                  <v-row dense>
                    <v-col cols="2" sm="1" md="1" lg="1" xl="1" class="mt-3">
                      <!-- 番号 -->
                      <v-container fluid class="cursor-grab fa fa-align-justify handle">
                        <v-icon v-if="!readonly">
                          mdi-drag-vertical-variant
                        </v-icon>
                      </v-container>
                    </v-col>
                    <v-col :cols="readonly ? 10 : 9" :sm="readonly ? 11 : 10" :md="readonly ? 11 : 10" :lg="readonly ? 11 : 10" :xl="readonly ? 11 : 10">
                      <v-container fluid class="ma-0 pa-0">
                        <v-row dense>
                          <v-col v-if="showDetails" cols="12" sm="6" md="4" lg="5" xl="6">
                            <!-- ポイントの説明欄 -->
                            <div v-if="readonly" class="d-flex align-center" style="height: 100%">
                              <span v-text="element.name"></span>
                            </div>
                            <v-text-field
                              v-else
                              :label="element.isPoint ? '評価の項目名' : '情報の項目名'"
                              class="mt-1"
                              :model-value="element.name"
                              @update:model-value="$emit('updateName', $event, index)"
                              :hint="element.isPoint ? `項目名には短い名前を入力してください(最大${tierValidation.paramNameLenMax}文字)` : `項目名には短い名前を入力してください(最大${tierValidation.paramNameLenMax}文字)`"
                              dense
                              :rules="rules"
                            />
                          </v-col>
                          <v-col v-else cols="12" sm="12" :md="showDetails ? 7 : 10" :lg="showDetails ? 8 : 10" :xl="showDetails ? 8 : 10">
                            <!-- ポイントの説明欄 -->
                            <div v-if="readonly" class="d-flex align-center" style="height: 100%">
                              <span v-text="element.name"></span>
                            </div>
                            <v-text-field
                              v-else
                              :label="element.isPoint ? '評価の項目名' : '情報の項目名'"
                              class="mt-1"
                              :model-value="element.name"
                              @update:model-value="$emit('updateName', $event, index)"
                              :hint="element.isPoint ? `項目名には短い名前を入力してください(最大${tierValidation.paramNameLenMax}文字)` : `項目名には短い名前を入力してください(最大${tierValidation.paramNameLenMax}文字)`"
                              dense
                              :rules="rules"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" md="3" lg="2" xl="2" v-show="showDetails">
                            <!-- ポイントの説明欄 -->
                            <div v-if="readonly" class="d-flex align-center" style="height: 100%">
                              <span v-text="element.isPoint ? 'ポイント' : '情報'"></span>
                            </div>
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
                          <v-col v-if="element.isPoint && showDetails" cols="12" sm="12" md="5" lg="5" xl="4">
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
                  <v-row>
                    <v-col>
                      <v-divider />
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
          </v-icon>項目の追加
        </v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewFactorParam, tierValidation } from '@/common/review'
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
    /** 評価項目の配列 */
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true,
      default: () => [] as PropType<ReviewFactorParam[]>
    },
    /** 変更不可 */
    readonly: {
      type: Boolean,
      default: false
    },
    /** タイプが「情報」の場合に適用する入力規則 */
    rules: {
      type: Array as PropType<((v: string) => string | boolean)[]>,
      default: undefined
    },
    /** タイプが「ポイント」の項目を一つ以上の含めることを強制する */
    requiredPoint: {
      type: Boolean,
      default: false
    },
    /** 評価項目の合計数上限 */
    maxLen: {
      type: Number,
      default: 16
    },
    /** 詳細を表示 */
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    /**
     * 評価項目の配列を更新する際のイベント
     * @param value 評価項目の配列
     */
    updateParams: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewFactorParam[]) => true,
    /**
     * 評価項目の名前を更新する際のイベント
     * @param value 評価項目の名前
     * @param index 評価項目のインデックス
     */
    updateName: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string, index: number) => true,
    /**
     * 評価項目のタイプを更新する際のイベント
     * @param value タイプ「ポイント」かどうか
     * @param index 評価項目のインデックス
     */
    updateIsPoint: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: boolean, index: number) => true,
    /**
     * 評価項目の重みを更新する際のイベント
     * @param value 重み
     * @param index 評価項目のインデックス
     */
    updateWeight: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: number, index: number) => true,
    /** 評価項目を追加するイベント */
    addItem: () => true,
    /**
     * 評価項目を削除するイベント
     * @param index 評価項目のインデックス
     */
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
      tierValidation,
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
