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
    <template v-slot:extension>
      <v-tabs :model-value="tab" @update:model-value="updateTab($event as number)" centered slider-color="primary">
        <v-tab>
          <span :class="tabValidation[0] === 'error' ? 'error-style' : ''">1. Tier概要</span>
        </v-tab>
        <v-tab :disabled="tabValidation[1] === 'none'" :class="tabValidation[1] === 'error' ? 'error-style' : ''">
          2. 表示方法
        </v-tab>
        <v-tab :disabled="tabValidation[2] === 'none'" :class="tabValidation[2] === 'error' ? 'error-style' : ''">
          3. 評価項目
        </v-tab>
        <v-tab :disabled="tabValidation[3] === 'none'" :class="tabValidation[3] === 'error' ? 'error-style' : ''">
          4. プレビュー
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
              :rules="[rulesFunc.required(), rulesFunc.maxLen(tierRules.tierNameLenMax)]"
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
            <v-img v-else style="border: 1px solid" height="100%" :src="modelValue.imageUrl" />
          </v-col>
          <v-col cols="2" sm="1" md="1" lg="1" xl="1">
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
        <v-row v-for="factor,index in modelValue.parags" :key="index">
          <v-col v-if="factor.type === 'text'" cols="11">
            <v-textarea
              label="説明文"
              hint="Tierの説明文を入力してください。"
              :model-value="factor.body"
              @update:model-value="$emit('updateParagBody', $event, index)"
              :rules="[rulesFunc.required(' 説明文が不要な場合は、空白のままにせず右側の×マークで削除してください'), rulesFunc.maxLen(tierRules.paragTextLenMax)]"
            />
          </v-col>
          <v-col v-if="factor.type === 'text'" cols="1">
            <v-btn icon flat @click="$emit('removeParagItem', index)">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
          <v-col v-else-if="factor.type === 'twitterLink'" cols="12">
            <tweet-embedder
              :model-value="factor.body"
              @update="$emit('updateParagBody', $event, index)"
              @remove="$emit('removeParagItem', index)"
              :rules="[rulesFunc.required(' 埋め込みツイートが不要な場合は、空白のままにせず右側の×マークで削除してください'), rulesFunc.maxLen(tierRules.paragLinkLenMax)]"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex flex-row-reverse pr-3">
          <v-btn
            class="mt-3 mb-3 mr-1 ml-1"
            color="#00acee"
            @click="addParagItemProxy('twitterLink')"
          >
            <v-icon color="white"> mdi-twitter </v-icon>
            <b style="color: white;">埋め込みツイートを追加</b>
          </v-btn>
          <v-btn
            class="mt-3 mb-3 mr-1 ml-1"
            color="primary"
            @click="addParagItemProxy('text')"
          >
            <v-icon color="white"> mdi-plus </v-icon>
            <b style="color: white;">説明文を追加</b>
          </v-btn>
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
              @add-item="addWeightItemProxy"
              @update-name="updateWeightNameProxy"
              @update-is-point="updateWeightIsPointProxy"
              @update-weight="updateWeightProxy"
              @remove-item="removeWeightItemProxy"
              :max-len="tierRules.paramsLenMax"
              :rules="[rulesFunc.required(' 項目が不要な場合は、空白のままにせず右側の×マークで削除してください'), rulesFunc.maxLen(tierRules.paramNameLenMax)]"
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
import { ReviewFunc, ReviewParagraphType, ReviewPointType, Tier, tierRules } from '@/common/review'
import { defineComponent, PropType, ref } from 'vue'
import WeightSettings from '@/components/WeightSettings.vue'
import TweetEmbedder from '@/components/TweetEmbedder.vue'
import TierComponent from '@/components/TierComponent.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import rules from '@/common/rules'
import { useToast } from 'vue-toast-notification'
import RestApi, { ErrorResponse } from '@/common/restapi'
import router from '@/router'
import { useStore } from '@/store'

/**
 * バリデーション状態
 * none...一度も開いていない
 * unknown...開いたが、検証していない
 * checked...検証済み
 * error...検証の結果、入力エラー
 */
type ValidState = 'none' | 'unknown' | 'checked' | 'error'

export default defineComponent({
  name: 'TierSettings',
  components: {
    WeightSettings,
    TweetEmbedder,
    TierComponent,
    PointTypeSelector,
    ReviewValueDisplay,
    ImageSelector
  },
  props: {
    modelValue: {
      type: Object as PropType<Tier>,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
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
      type: ReviewParagraphType
    ) => true,
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
      value: string, index: number) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const toast = useToast()
    const store = useStore()
    const tab = ref(0)
    const tweetdialog = ref(false)

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
      if (props.modelValue.reviewFactorParams.length < tierRules.paramsLenMax) {
        emit('addWeightItem')
      } else {
        toast.warning(`追加できる項目は${tierRules.paramsLenMax}個までです`)
      }
    }

    const addParagItemProxy = (type: ReviewParagraphType) => {
      if (props.modelValue.parags.length < tierRules.paragsLenMax) {
        emit('addParagItem', type)
      } else {
        toast.warning(`追加できる説明文/リンクは合計${tierRules.paragsLenMax}個までです`)
      }
    }

    const tabValidation = ref([
      'none',
      'none',
      'none',
      'none'
    ] as ValidState[])

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
      const data = ReviewFunc.createTierRequestData(props.modelValue, props.modelValue.tierId)
      if (props.isNew) {
        RestApi.postTier(data).then((v) => {
          toast.success('Tierを作成しました')
          router.push(`/tier/${store.state.userId}/${v.data}`)
        }).catch((e) => {
          const v = e.response.data as ErrorResponse
          toast.error(`${v.message}(${v.code})`)
        })
      } else {
        RestApi.updateTier(data).then((v) => {
          toast.success('Tierを更新しました')
          router.push(`/tier/${store.state.userId}/${v.data}`)
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

    return {
      tab,
      tweetdialog,
      updateWeightNameProxy,
      updateWeightIsPointProxy,
      updateWeightProxy,
      removeWeightItemProxy,
      addWeightItemProxy,
      addParagItemProxy,
      rulesFunc: rules,
      tierRules: tierRules,
      forms,
      tabValidation,
      next,
      back,
      submit,
      valid,
      updateTab
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.error-style {
  color: red;
}
</style>
