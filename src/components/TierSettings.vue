<template>
  <v-card>
    <v-toolbar color="secondary">
      <v-card-title v-if="isNew" class="font-weight-bold">
        Tier新規作成
      </v-card-title>
      <v-card-title v-else class="font-weight-bold">
        Tier編集
      </v-card-title>
      <div style="width: 100%;margin-right: 54px" class="d-flex flex-row-reverse">
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
          <v-col>
            <v-card-title class="font-weight-bold">
              Tier情報の入力
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6" lg="6" xl="6">
            <v-card-text>
              このTierの情報を入力してください。
            </v-card-text>
          </v-col>
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
              hint="このTierを表す分かりやすい名前を設定してください。"
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
              :aspect-ratio="(10 / 3)"
              @update-cropped-url="$emit('updateImageUrl', $event)"
            />
          </v-col>
          <v-col cols="10" sm="6" md="4" lg="4" xl="4">
            <v-card v-if="modelValue.imageUrl === ''" height="100%" class="dahed-box" flat>
              画像を選択するとここに表示されます
            </v-card>
            <v-img v-else style="border: 1px solid" height="100%" :src="getImgSource(modelValue.imageUrl)" />
          </v-col>
          <v-col v-if="!isNew" cols="2" sm="1" md="1" lg="1" xl="1">
            <v-btn icon flat @click="$emit('updateImageUrl', '')">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
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
                <v-col cols="12" sm="5" md="4" lg="3" xl="2">
                  <point-type-selector
                    :model-value="pointType"
                    @update="$emit('updatePointType', $event)"
                    :always="true"
                  />
                </v-col>
                <v-col style="vertical-align: top;">
                  <v-container class="ma-0 pa-0" fluid>
                    <v-row>
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
                    <v-col>
                      <v-divider />
                    </v-col>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
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
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-container v-if="tab === 1" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
      <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            プレビュー
          </v-card-title>
        </v-col>
      </v-row>
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

  <simple-dialog v-model="cautionsDialog" title="警告" @submit="upload">
    <div v-for="c, i of cautions" :key="i" class="ma-2">
      <div><span class="error-style" v-text="c"></span></div>
    </div>
  </simple-dialog>
</template>

<script lang="ts">
import { ReviewFactorParam, ReviewFunc, ReviewParagraphType, ReviewPointType, Tier, tierValidation, sectionValidation, ReviewSection } from '@/common/review'
import { computed, ComputedRef, defineComponent, PropType, ref } from 'vue'
import WeightSettings from '@/components/WeightSettings.vue'
import TierComponent from '@/components/TierComponent.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import SectionEditorComponent from '@/components/SectionEditorComponent.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import rules from '@/common/rules'
import { useToast } from 'vue-toast-notification'
import RestApi, { getImgSource, toastError } from '@/common/restapi'
import router from '@/router'
import { onBeforeRouteLeave } from 'vue-router'

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
    PaddingComponent
  },
  props: {
    modelValue: {
      type: Object as PropType<Tier>,
      required: true
    },
    orgTier: {
      type: Object as PropType<Tier>,
      required: true
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    /** Tier名の変更 */
    updateTierName: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    /** Tierのカバー画像を変更 */
    updateImageUrl: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    /** レビューポイント表示方法の変更 */
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true,
    /** 重みや情報の項目名称の変更 */
    updateWeightName: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string, index: number) => true,
    /** 重みか情報かの変更 */
    updateWeightIsPoint: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: boolean, index: number) => true,
    /** 重み値の変更 */
    updateWeight: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: number, index: number) => true,
    /** 項目の追加 */
    addWeightItem: () => true,
    /** 項目の削除 */
    removeWeightItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true,
    /** 本文の追加 */
    addParagItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type: ReviewParagraphType | 'section', index: number) => true,
    /** 本文の削除 */
    removeParagItem: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true,
    /** 本文の更新 */
    updateParagType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewParagraphType, index: number) => true,
    /** Tier説明文の変更 */
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string, index: number) => true,
    updateParams: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewFactorParam[]) => true,
    updatePullingUp: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true,
    updatePullingDown: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const toast = useToast()

    const tab = ref(0)
    const tweetdialog = ref(false)
    const cautionsDialog = ref(false)
    const isSubmitting = ref(false)
    const displayDeatails = ref(false)

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
      if (props.modelValue.parags.length < sectionValidation.paragsLenMax) {
        emit('addParagItem', type, index)
      } else {
        toast.warning(`追加できる説明文/リンクは合計${sectionValidation.paragsLenMax}個までです`)
      }
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
      if (props.isNew) {
        RestApi.postTier(data).then((v) => {
          toast.success('Tierを作成しました')
          isSubmitting.value = true
          router.push(`/tier/${v.data}`)
        }).catch((e) => {
          toastError(e, toast)
        })
      } else {
        RestApi.updateTier(data, props.modelValue.tierId).then((v) => {
          toast.success('Tierを更新しました')
          isSubmitting.value = true
          router.push(`/tier/${v.data}`)
        }).catch((e) => {
          toastError(e, toast)
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

    // これがないとイベントが設定できない
    history.replaceState(null, '')

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
    const updateParams = (value: ReviewFactorParam[]) => {
      emit('updateParams', value)
    }

    return {
      getImgSource,
      sectionValidation,
      rulesFunc: rules,
      tierValidation,
      displayDeatails,
      tab,
      tweetdialog,
      cautionsDialog,
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
      updateParams
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
