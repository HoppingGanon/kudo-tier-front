<template>
  <v-toolbar color="secondary">
    <v-card-title>
      <b v-if="isNew">
        Tier新規作成
      </b>
      <b v-else>
        Tier編集
      </b>
    </v-card-title>
    <div style="width: 100%;margin-right: 54px" class="d-flex flex-row-reverse">
      <v-btn v-if="tab === 3" icon @click="submit">
        <v-icon>
          mdi-send
        </v-icon>
      </v-btn>
      <v-btn v-else icon @click="next(tab)">
        <v-icon>
          mdi-arrow-right-drop-circle-outline
        </v-icon>
      </v-btn>
      <v-btn v-if="tab > 0" icon @click="back(tab)">
        <v-icon>
          mdi-arrow-left-drop-circle-outline
        </v-icon>
      </v-btn>
    </div>
    <template v-slot:extension>
      <v-tabs :model-value="tab" @update:model-value="updateTab($event as number)" centered slider-color="primary" grow>
        <v-tab>
          <span :class="tabValidation[0] === 'error' ? 'error-style' : ''">1. Tier概要</span>
        </v-tab>
        <v-tab :disabled="tabValidation[1] === 'none'">
          <span :class="tabValidation[1] === 'error' ? 'error-style' : ''">2. 表示方法</span>
        </v-tab>
        <v-tab :disabled="tabValidation[2] === 'none'">
          <span :class="tabValidation[2] === 'error' ? 'error-style' : ''">3. 評価項目</span>
        </v-tab>
        <v-tab :disabled="tabValidation[3] === 'none'">
          <span :class="tabValidation[3] === 'error' ? 'error-style' : ''">4. プレビュー</span>
        </v-tab>
      </v-tabs>
    </template>
  </v-toolbar>

  <v-card flat class="pa-0">
    <v-container v-show="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
      <v-form :ref="forms[0]">
        <v-row>
          <v-col>
            <v-card-title>
              1.Tier概要
            </v-card-title>
            <v-card-text>
              このTierを表す基本的な情報を設定しましょう。
            </v-card-text>
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
          <v-divider class="mt-3 mb-3"></v-divider>
        </v-row>
        <v-row v-if="modelValue.parags.length === 0">
          <v-col cols="8" sm="9" md="10" lg="10" xl="10" />
          <v-col cols="4" sm="3" md="2" lg="2" xl="2">
            <menu-button :items="additionalItems2" @select="addParagItemProxy($event, 0)">
              <template v-slot:button="{ open, props }">
                <v-btn @click="open" v-bind="props" icon flat>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </menu-button>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <section-component
              :section="getSection()"
              display-type="all"
              :editable="true"
              :hide-section-title="true"
              @update-parag-body="(v, i) => $emit('updateParagBody', v, i)"
              @add-object="addParagItemProxy"
              @del-parag="$emit('removeParagItem', $event)"
            />
          </v-col>
        </v-row>
        <v-row v-if="modelValue.parags.length === 0">
          <v-col>
            <v-card flat class="ma-3">
              <b>
                説明文がありません<br />
                右上の[<v-icon>mdi-plus</v-icon>]をクリックして、説明文を追加しましょう
              </b>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <v-container v-show="tab === 1" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
      <v-form :ref="forms[1]">
        <v-row>
          <v-col>
            <v-card-title>
              2.表示方法
            </v-card-title>
            <v-card-text>
              レビューやTierの評点を表示する方法を選んでください。
            </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
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
                          bar-width="200px"
                          display-size="larger"
                        />
                      </td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <v-container v-show="tab === 2" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
      <v-form :ref="forms[2]">
        <v-row>
          <v-col>
            <v-card-title>
              3.評価項目
            </v-card-title>
            <v-card-text>
              評価する項目や付加したい情報を設定してください。
            </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
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
            />
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <v-container v-show="tab === 3" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
      <v-form :ref="forms[3]">
        <v-row>
          <v-col>
            <tier-component
              :tier="modelValue"
              :is-sample="true"
              :point-type="pointType"
              display-type="all"
              :no-header="true"
              :no-menu-icon="true"
              point-display-type="normal"
              width="100%"
              min-height="720px"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-container>

  </v-card>
  <v-card-actions>
    <v-row class="justify-end ma-5">
      <v-btn v-show="tab > 0" @click="back(tab)">
        戻る
      </v-btn>
      <v-btn v-show="tab < 3" @click="next(tab)">
        次へ
      </v-btn>
      <v-btn v-show="tab == 3" @click="submit">
        完了
      </v-btn>
    </v-row>
  </v-card-actions>
</template>

<script lang="ts">
import { ReviewFactorParam, ReviewFunc, ReviewParagraphType, ReviewPointType, Tier, tierValidation, sectionValidation, ReviewSection } from '@/common/review'
import { defineComponent, PropType, ref, toRefs, watch } from 'vue'
import WeightSettings from '@/components/WeightSettings.vue'
import TierComponent from '@/components/TierComponent.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import SectionComponent, { additionalItems2 } from '@/components/SectionComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import rules from '@/common/rules'
import { useToast } from 'vue-toast-notification'
import RestApi, { ErrorResponse, getImgSource } from '@/common/restapi'
import router from '@/router'
import { onBeforeRouteLeave } from 'vue-router'
import { ValidState } from '@/common/page'

export default defineComponent({
  name: 'TierSettings',
  components: {
    WeightSettings,
    TierComponent,
    PointTypeSelector,
    ReviewValueDisplay,
    ImageSelector,
    SectionComponent,
    MenuButton
  },
  props: {
    modelValue: {
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
      value: ReviewFactorParam[]) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const toast = useToast()
    const tab = ref(0)
    const tweetdialog = ref(false)
    const isSubmitting = ref(false)

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

    const addParagItemProxy = (type: ReviewParagraphType | 'section', index: number) => {
      if (props.modelValue.parags.length < sectionValidation.paragsLenMax) {
        emit('addParagItem', type, index)
      } else {
        toast.warning(`追加できる説明文/リンクは合計${sectionValidation.paragsLenMax}個までです`)
      }
    }

    const getSection: () => ReviewSection = () => {
      return {
        title: '',
        parags: props.modelValue.parags
      }
    }

    const tabValidation = ref([
      'none',
      'none',
      'none',
      'none'
    ] as ValidState[])

    // 仕方ないのでisNewを監視して、falseになったらバリデーションをcheckedにすることで更新時には食べの変更ができるようにする
    const { isNew } = toRefs(props)
    watch(isNew, () => {
      if (!isNew.value) {
        tabValidation.value[0] = 'checked'
        tabValidation.value[1] = 'checked'
        tabValidation.value[2] = 'checked'
        tabValidation.value[3] = 'checked'
      }
    })

    const forms = ref([
      ref(),
      ref(),
      ref(),
      ref()
    ])

    const valid = async (index: number) => {
      let result = false
      const validResult = await forms.value[index].value.validate()

      if (index === 2) {
        // タブ2のみ、ポイント項目があるかどうかチェックを行う
        result = validResult.valid && props.modelValue.reviewFactorParams.filter((value) => value.isPoint).length !== 0
      } else {
        result = validResult.valid
      }

      if (result) {
        tabValidation.value[index] = 'checked'
      } else {
        tabValidation.value[index] = 'error'
      }
      return result
    }

    const next = async (index: number) => {
      const result: boolean = await valid(index)
      if (result) {
        if (index + 1 < 4) {
          tab.value++
          if (tabValidation.value[index + 1] === 'none') {
            tabValidation.value[index + 1] = 'unknown'
          }
        }
      } else {
        tabValidation.value[index] = 'error'
        toast.warning('適切でない入力があります。')
      }
    }
    const back = async (index: number) => {
      await valid(index)
      tab.value--
    }

    const submit = async () => {
      // 全タブでバリデーションチェックを行う
      for (let i = 0; i < 4; i++) {
        if (!await valid(i)) {
          toast.warning('適切でない入力があります。')
          tab.value = i
          return
        }
      }
      const data = ReviewFunc.createTierRequestData(props.modelValue)
      if (props.isNew) {
        RestApi.postTier(data).then((v) => {
          toast.success('Tierを作成しました')
          isSubmitting.value = true
          router.push(`/tier/${v.data}`)
        }).catch((e) => {
          const v = e.response.data as ErrorResponse
          toast.error(`${v.message}(${v.code})`)
        })
      } else {
        RestApi.updateTier(data, props.modelValue.tierId).then((v) => {
          toast.success('Tierを更新しました')
          isSubmitting.value = true
          router.push(`/tier/${v.data}`)
        }).catch((e) => {
          const v = e.response.data as ErrorResponse
          toast.error(`${v.message}(${v.code})`)
        })
      }
    }

    const updateTab = async (value: number) => {
      await valid(tab.value)
      tab.value = value
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
          if (!result) {
            toast.warning('前の設定を変更したい場合は右下の「戻る」ボタンか、上部のタブを押してください')
          }
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
      additionalItems2,
      sectionValidation,
      rulesFunc: rules,
      tierValidation,
      tab,
      tweetdialog,
      updateWeightNameProxy,
      updateWeightIsPointProxy,
      updateWeightProxy,
      removeWeightItemProxy,
      addWeightItemProxy,
      addParagItemProxy,
      getSection,
      forms,
      tabValidation,
      next,
      back,
      submit,
      valid,
      updateTab,
      updateParams
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
