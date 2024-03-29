<template>
  <v-card class="down">
    <v-toolbar color="secondary">
      <v-card-title v-if="isNew" class="font-weight-bold">
        Tier新規作成
      </v-card-title>
      <v-card-title v-else class="font-weight-bold">
        Tier編集
      </v-card-title>
      <div style="width: 100%;margin-right: 54px" class="d-flex justify-end">
        <v-btn icon @click="hint = true">
          <v-icon>
            mdi-help-circle
          </v-icon>
        </v-btn>
        <v-btn icon @click="submit">
          <v-icon>
            mdi-send
          </v-icon>
        </v-btn>
      </div>
      <template v-slot:extension>
        <v-tabs v-model="tab" centered slider-color="primary" grow>
          <v-tab class="text-no-transform">
            <span>Tier情報の入力</span>
          </v-tab>
          <v-tab>
            <span>プレビュー</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
  </v-card>

  <v-card flat class="pa-0">
    <v-form ref="form">
      <v-container v-if="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-row>
          <v-col class="d-flex flex-row-reverse">
            <div>
              <v-switch label="詳細設定を表示する" color="primary" v-model="displayDeatails" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Tier名"
              :hint="`このTierを表す分かりやすい名前を設定してください(最大${tierValidation.tierNameLenMax}文字)`"
              :model-value="modelValue.name"
              @update:model-value="$emit('updateTierName', $event)"
              :rules="[rulesFunc.required(), rulesFunc.maxLen(tierValidation.tierNameLenMax)]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="7" lg="7" xl="7">
            <image-selector
              label="Tierのトップに表示する画像を選択してください"
              :cropped-url="modelValue.imageUrl"
              :aspect-ratio="(10 / 3)"
              @update-cropped-url="$emit('updateImageUrl', $event)"
              img-max-height="320px"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row v-if="displayDeatails">
          <v-col>
            <v-container fluid class="ma-0 pa-0">
              <v-row>
                <v-col cols="12" sm="12" md="4" lg="3" xl="2">
                  <point-type-selector
                    :model-value="pointType"
                    @update="$emit('updatePointType', $event)"
                    :always="true"
                    :is-select="$vuetify.display.smAndDown"
                  />
                </v-col>
                <v-col style="vertical-align: top;">
                  <v-container class="ma-0 pa-0" fluid>
                    <v-row v-if="$vuetify.display.mdAndUp">
                      <v-col>
                        <v-card flat>
                          <span class="text-h5" v-text="modelValue.pointType" />
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-divider />
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-card class="mt-2" flat>
                          <span v-show="modelValue.pointType === 'stars'">
                            0～5つの星の数で6段階のレビューを行います。<br />
                            シンプルでわかりやすいレビューが可能なため、初心者向けのレビューや簡単なレビューを作成したい場合におすすめです。
                          </span>
                          <span v-show="modelValue.pointType === 'rank7'">
                            E～SSランクで7段階のレビューを行います。<br />
                            シンプルでわかりやすいレビューが可能なため、初心者向けのレビューや簡単なレビューを作成したい場合におすすめです。
                          </span>
                          <span v-show="modelValue.pointType === 'rank14'">
                            E～SS+のランクで14段階のレビューを行います。<br />
                            詳細なレビューを作成できるため、こだわりのある分野のレビューを行う場合におすすめです。
                          </span>
                          <span v-show="modelValue.pointType === 'score'">
                            0～10点で11段階のレビューを行います。<br />
                            評価の大小が分かりやすいため、明確に数値化できるものをレビューしたい場合におすすめです。
                          </span>
                          <span v-show="modelValue.pointType === 'point'">
                            0～100点で101段階のレビューを行います。<br />
                            評価の大小が分かりやすく、詳細なレビューが可能なため、明確な数値や百分率で表せるものをレビューしたい場合におすすめです。
                          </span>
                          <span v-show="modelValue.pointType === 'unlimited'">
                            0～10000点で10001段階のレビューを行います。<br />
                            最も詳細にレビューを作成できますが、使用できない機能や表示の制約が多いためレビューには向きません。レビューではなく単純な数値の比較を行う場合におすすめです。
                          </span>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <table>
                          <tr v-for="num of 5" :key="num">
                            <td>
                              <span v-text="`サンプル${num} : `"></span>
                            </td>
                            <td>
                              <review-value-display
                                :value="100 * (5 - num) / 4"
                                :point-type="modelValue.pointType"
                                display-size="large2"
                              />
                            </td>
                          </tr>
                        </table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row v-if="displayDeatails">
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row v-if="displayDeatails">
          <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <v-slider
              :modelValue="modelValue.pullingUp"
              @update:model-value="$emit('updatePullingUp', $event)"
              class="mt-4 ml-4 mr-4 mb-2"
              label="Tierを下位に寄せる"
              color="primary"
              :step="1"
              thumb-label="always"
              :min="0"
              :max="40"
            />
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="6" xl="6">
            <v-slider
              :modelValue="modelValue.pullingDown"
              @update:model-value="$emit('updatePullingDown', $event)"
              class="mt-4 ml-4 mr-4 mb-2"
              label="Tierを上位に寄せる"
              color="primary"
              :step="1"
              thumb-label="always"
              :min="0"
              :max="40"
            />
          </v-col>
        </v-row>
        <v-row v-if="displayDeatails">
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-end">
            <v-icon class="mr-1 mt-1" @click="page=1;hint=true;">
              mdi-help
            </v-icon>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card class="pa-1" flat>
              <weight-settings
                :params="modelValue.reviewFactorParams"
                @update-params="updateParams"
                @add-item="addWeightItemProxy"
                @update-name="updateWeightNameProxy"
                @update-is-point="updateWeightIsPointProxy"
                @update-weight="updateWeightProxy"
                @remove-item="removeWeightItemProxy"
                :max-len="tierValidation.paramsLenMax"
                :rules="[rulesFunc.required(' 項目が不要な場合は、空白のままにせず右側の×マークで削除してください'), rulesFunc.maxLen(tierValidation.paramNameLenMax)]"
                :required-point="true"
                :show-details="displayDeatails"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-divider class="mt-3 mb-3"></v-divider>
        </v-row>
        <v-row>
          <v-col>
            <section-editor-component
              :sections="sections"
              @update-parag-body="(v, i, j) => $emit('updateParagBody', v, j)"
              @add-parag="(t, i, j) => { addParagItemProxy(t, j) }"
              @del-parag="$emit('removeParagItem', $event)"
              :no-section="true"
              @submit="submit"
              @preview="toggleTab"
              title="説明文の追加"
              @open-hint="page = 2;hint = true;"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-container v-if="tab === 1" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
      <v-row>
        <v-col>
          <v-card>
            <padding-component>
              <tier-component
                :tier="modelValue"
                :is-sample="true"
                :point-type="pointType"
                display-type="all"
                :no-header="true"
                :no-menu-icon="true"
              />
            </padding-component>
          </v-card>
        </v-col>
      </v-row>

      <editor-tools
        :floatingStyle="true"
        @submit="submit"
        @preview="toggleTab"
        :allow-toggle="false"
        :hide-section="true"
        :hide-parag="true"
      />
    </v-container>

  </v-card>
  <v-card-actions>
    <v-row class="justify-end ma-5">
      <v-btn v-show="tab === 0" @click="tab = 1">
        プレビュー
      </v-btn>
      <v-btn v-show="tab === 1" @click="tab = 0">
        情報の入力
      </v-btn>
      <v-btn @click="submit">
        <span v-if="isNew">作成</span>
        <span v-else>更新</span>
      </v-btn>
    </v-row>
  </v-card-actions>

  <tier-settings-hint v-model="hint" v-model:page="page" :title="isNew ? 'Tierを作成しましょう' : 'Tierを編集しましょう'" />

  <simple-dialog v-model="cautionsDialog" title="警告" @submit="upload">
    <div v-for="c, i of cautions" :key="i" class="ma-2">
      <div><span class="error-style" v-text="c"></span></div>
    </div>
  </simple-dialog>
  <loading-component :is-loading="isSubmitting" :is-force="true" class="mt-5" title="Tierを送信中..." />
</template>

<script lang="ts">
import { ReviewFactorParam, ReviewFunc, ReviewParagraphType, ReviewPointType, Tier, tierValidation, sectionValidation, ReviewSection } from '@/common/review'
import { computed, ComputedRef, defineComponent, onMounted, PropType, ref } from 'vue'
import WeightSettings from '@/components/WeightSettings.vue'
import TierComponent from '@/components/TierComponent.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import SectionEditorComponent from '@/components/SectionEditorComponent.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import EditorTools from '@/components/EditorTools.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import TierSettingsHint from '@/components/TierSettingsHint.vue'
import rules from '@/common/rules'
import { ToastProps, useToast } from 'vue-toast-notification'
import RestApi, { getImgSource, toastError } from '@/common/restapi'
import router from '@/router'
import { onBeforeRouteLeave } from 'vue-router'
import store from '@/store'

export default defineComponent({
  name: 'TierSettings',
  components: {
    WeightSettings,
    TierComponent,
    PointTypeSelector,
    ReviewValueDisplay,
    ImageSelector,
    SectionEditorComponent,
    SimpleDialog,
    PaddingComponent,
    EditorTools,
    LoadingComponent,
    TierSettingsHint
  },
  props: {
    /** Tierデータ */
    modelValue: {
      type: Object as PropType<Tier>,
      required: true
    },
    /** もとのTierデータ */
    orgTier: {
      type: Object as PropType<Tier>,
      required: true
    },
    /** ポイント表示方法 */
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    /** 新規作成 */
    isNew: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    /**
     * Tier名を更新する際のイベント
     * @param value Tier名
     */
    updateTierName: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    /** Tierのカバー画像を更新する際のイベント */
    updateImageUrl: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    /**
     * ポイント表示方法を更新する際のイベント
     * @param value ポイント表示方法
     */
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true,
    /**
     * 評価項目の名前を更新する際のイベント
     * @param value 名前
     * @param index 評価項目のインデックス
     */
    updateWeightName: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string, index: number) => true,
    /**
     * 評価項目の種類を更新する際のイベント
     * @param value true ポイント、false 情報
     * @param index 評価項目のインデックス
     */
    updateWeightIsPoint: (
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
    /** 項目の追加イベント */
    addWeightItem: () => true,
    /**
     * 項目の削除イベント
     * @param index 評価項目のインデックス
     */
    removeWeightItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true,
    /**
     * パラグラフの追加イベント
     * @param type パラグラフタイプ
     * @param index パラグラフのインデックス
     */
    addParagItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type: ReviewParagraphType | 'section', index: number) => true,
    /**
     * パラグラフの削除イベント
     * @param index パラグラフのインデックス
     */
    removeParagItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true,
    /**
     * パラグラフのタイプを削除する際のイベント
     * @param value パラグラフのタイプ
     * @param index パラグラフのインデックス
     */
    updateParagType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewParagraphType, index: number) => true,
    /**
     * パラグラフの説明文を更新する際のイベント
     * @param value 説明文
     * @param index パラグラフのインデックス
     */
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string, index: number) => true,
    /**
     * 評価項目配列の更新イベント
     * @param value 評価項目配列
     */
    updateParams: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewFactorParam[]) => true,
    /**
     * Tier調整値更新イベント(値を上げるとレビューが全体的に下位に位置しやすくなる)
     * @param v Tier調整値
     */
    updatePullingUp: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: number) => true,
    /**
     * Tier調整値更新イベント(値を上げるとレビューが全体的に上位に位置しやすくなる)
     * @param v Tier調整値
     */
    updatePullingDown: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: number) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const toast = useToast()

    const tab = ref(0)
    const tweetdialog = ref(false)
    const cautionsDialog = ref(false)
    const isSubmitting = ref(false)
    /** 詳細表示 */
    const displayDeatails = ref(false)
    const hint = ref(false)
    const page = ref(0)
    // Tier作成後に次のヒントを表示する
    const nextHint = ref(false)

    const updateWeightNameProxy = (value: string, index: number) => {
      emit('updateWeightName', value, index)
    }

    const updateWeightIsPointProxy = (value: boolean, index: number) => {
      emit('updateWeightIsPoint', value, index)
    }

    const updateWeightProxy = (value: number, index: number) => {
      emit('updateWeight', value, index)
    }

    const removeWeightItemProxy = (index: number) => {
      emit('removeWeightItem', index)
    }

    const addWeightItemProxy = () => {
      if (props.modelValue.reviewFactorParams.length < tierValidation.paramsLenMax) {
        emit('addWeightItem')
      } else {
        toast.warning(`追加できる項目は${tierValidation.paramsLenMax}個までです`)
      }
    }

    const addParagItemProxy = (type: ReviewParagraphType, index: number) => {
      emit('addParagItem', type, index)
    }

    const sections: ComputedRef<ReviewSection[]> = computed(() => {
      return [{
        title: '',
        parags: props.modelValue.parags
      }]
    })

    const form = ref()

    const valid = async () => {
      let result = false
      const validResult = await form.value.validate()

      // タブ2のみ、ポイント項目があるかどうかチェックを行う
      result = validResult.valid && props.modelValue.reviewFactorParams.filter((value) => value.isPoint).length !== 0

      return result
    }

    const upload = () => {
      const data = ReviewFunc.createTierRequestData(props.modelValue)
      isSubmitting.value = true
      if (props.isNew) {
        RestApi.postTier(data).then((v) => {
          toast.success('Tierを作成しました')
          // 次の画面でreviewのヒントを表示する
          if (nextHint.value) {
            store.commit('setHintState', 'review')
          }
          router.push(`/tier/${v.data}`)
        }).catch((e) => {
          toastError(e, toast)
        }).finally(() => {
          isSubmitting.value = false
        })
      } else {
        RestApi.updateTier(data, props.modelValue.tierId).then((v) => {
          toast.success('Tierを更新しました')
          router.push(`/tier/${v.data}`)
        }).catch((e) => {
          toastError(e, toast)
        }).finally(() => {
          isSubmitting.value = false
        })
      }
    }

    const cautions = ref([] as string[])

    const submit = async () => {
      // 全タブでバリデーションチェックを行う
      if (!await valid()) {
        toast.warning('適切でない入力があります。')
        tab.value = 0
        return
      }

      cautions.value.splice(0)
      if (props.modelValue.reviewFactorParams.filter((v) => v.isPoint).length < 3) {
        cautions.value.push('項目の種類が「ポイント」に設定されている評価項目が2つ以下の場合、レビューを表示した際にレーダーチャートが表示されません。レーダーチャートを表示するには同項目を3つ以上設定する必要があります')
      }
      if (props.modelValue.pointType === 'unlimited') {
        cautions.value.push('ポイント表示方法を「unlimited」に設定した場合、Tier表やレーダーチャートは表示されません(この仕様は将来改善する予定があります)')
      }
      if (!props.isNew && props.modelValue.reviews.length > 0) {
        let f = true
        let f2 = true
        let f3 = true
        props.orgTier.reviewFactorParams.forEach((param) => {
          if (props.modelValue.reviewFactorParams.filter((param2) => param2.index === param.index).length === 0) {
            // 編集前には存在したが編集後になくなったもの
            if (param.isPoint) {
              // そのうちオリジナルの種類がポイントのもの
              f = false
            }
          } else {
            if (props.modelValue.reviewFactorParams.filter((param2) => param2.index === param.index && (param.isPoint === param2.isPoint)).length === 0) {
              // 編集前後で存在しているが、種類が変更されたもの
              f2 = false
            }
          }
        })

        // indexが負数
        if (props.modelValue.reviewFactorParams.filter((param) => param.index < 0).length !== 0) {
          // 追加されたもの
          f3 = false
        }

        if (!f || !f2 || !f3) {
          let cstr = '評価にかかわる項目が'
          if (!f3) {
            cstr += '追加'
            if (!f2) {
              cstr += '・'
            }
          }
          if (!f2) {
            cstr += '変更'
            if (!f) {
              cstr += '・'
            }
          }
          if (!f) {
            cstr += '削除'
          }
          cautions.value.push(`${cstr}されました`)

          if (!f3) {
            cautions.value.push('新規に追加した項目は各レビューにて手動で再設定する必要があります')
          }
          if (!f2 || !f) {
            cautions.value.push('Tier表が変動します レビューの評価が正しく表示されるか確認してください')
          }
        }
      }

      if (cautions.value.length === 0) {
        upload()
      } else {
        cautionsDialog.value = true
      }
    }

    // ページを離れた時に警告する
    onBeforeRouteLeave(() => {
      if (!isSubmitting.value) {
        if (props.isNew &&
          props.modelValue.name === '' &&
          props.modelValue.parags.length === 1 &&
          props.modelValue.parags[0].body === '' &&
          props.modelValue.parags[0].type === 'text') {
        } else {
          const result = window.confirm('入力途中のデータは破棄されます\nよろしいですか？')
          return result
        }
      }
      return true
    })

    onMounted(() => {
      RestApi.getLatestPostLists(store.state.userId, 1).then((res) => {
        if (res.data.tiers.length === 0) {
          hint.value = true
          page.value = 0
          nextHint.value = true
        }
      })
    })
    const updateParams = (value: ReviewFactorParam[]) => {
      emit('updateParams', value)
    }

    const infoToastConfig: ToastProps = {
      duration: 750,
      position: 'top',
      queue: false
    }
    const toggleTab = () => {
      if (tab.value === 0) {
        tab.value = 1
        toast.info('プレビュー', infoToastConfig)
      } else {
        tab.value = 0
        toast.info('レビュー情報の入力', infoToastConfig)
      }
    }

    return {
      getImgSource,
      sectionValidation,
      rulesFunc: rules,
      tierValidation,
      displayDeatails,
      hint,
      page,
      tab,
      tweetdialog,
      cautionsDialog,
      isSubmitting,
      updateWeightNameProxy,
      updateWeightIsPointProxy,
      updateWeightProxy,
      removeWeightItemProxy,
      addWeightItemProxy,
      addParagItemProxy,
      sections,
      form,
      submit,
      valid,
      cautions,
      upload,
      updateParams,
      toggleTab
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.down {
  margin-top: 60px;
}
</style>
