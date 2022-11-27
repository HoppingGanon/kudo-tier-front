<template>
  <v-toolbar color="secondary">
    <v-card-title>
      <b>
        Tier新規作成
      </b>
    </v-card-title>
    <template v-slot:extension>
      <v-tabs v-model="tab" centered slider-color="primary">
        <v-tab>
          1. Tier概要
        </v-tab>
        <v-tab :disabled="true">
          2. 表示方法
        </v-tab>
        <v-tab :disabled="true">
          3. 評価項目
        </v-tab>
        <v-tab :disabled="true">
          4. プレビュー
        </v-tab>
      </v-tabs>
    </template>
  </v-toolbar>
  <v-container fluid>
    <v-container v-if="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-0" fluid>
      <v-row>
        <v-col>
          <v-text-field
            label="Tier名"
            hint="このTierを表す分かりやすい名前を設定してください。"
            :model-value="modelValue.name"
            @update:model-value="$emit('updateTierName', $event)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-divider class="mt-3 mb-3"></v-divider>
      </v-row>
      <v-row v-for="factor,index in modelValue.parags" :key="index">
        <v-col>
          <v-textarea
            v-if="factor.type === 'text'"
            label="説明文"
            hint="Tierの説明文を入力してください。"
            :model-value="factor.body"
            @update:model-value="$emit('updateParagBody', $event, index)"
          />
          <tweet-embedder
            v-else-if="factor.type === 'twitterLink'"
            :model-value="factor.body"
            @update="$emit('updateParagBody', $event, index)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex flex-row-reverse">
          <v-btn
            class="mt-3 mb-3"
            color="#00acee"
            @click="$emit('addParagItem', 'twitterLink')"
          >
            <v-icon color="white"> mdi-twitter </v-icon>
            <b style="color: white;">埋め込みツイートを追加</b>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="tab === 1" class="mt-3 ml-0 mb-0 mr-0 pa-0" fluid>
      <v-card flat>
        <table>
          <tr>
            <td style="vertical-align:top" class="minimum">
              <v-card flat width="120px">
                <point-type-selector
                  :model-value="pointType"
                  @update="$emit('updatePointType', $event)"
                  :always="true"
                />
              </v-card>
            </td>
            <td style="vertical-align: top;">
              <v-container class="ma-1 pa-3" fluid>
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
                      <span v-if="modelValue.pointType === 'stars'">
                        0～5つの星の数で6段階のレビューを行います。<br />
                        シンプルでわかりやすいレビューが可能なため、初心者向けのレビューや簡単なレビューを作成したい場合におすすめです。
                      </span>
                      <span v-if="modelValue.pointType === 'rank7'">
                        E～SSランクで7段階のレビューを行います。<br />
                        シンプルでわかりやすいレビューが可能なため、初心者向けのレビューや簡単なレビューを作成したい場合におすすめです。
                      </span>
                      <span v-if="modelValue.pointType === 'rank14'">
                        E～SS+のランクで14段階のレビューを行います。<br />
                        詳細なレビューを作成できるため、こだわりのある分野のレビューを行う場合におすすめです。
                      </span>
                      <span v-if="modelValue.pointType === 'score'">
                        0～10点で11段階のレビューを行います。<br />
                        評価の大小が分かりやすいため、明確に数値化できるものをレビューしたい場合におすすめです。
                      </span>
                      <span v-if="modelValue.pointType === 'point'">
                        0～100点で101段階のレビューを行います。<br />
                        評価の大小が分かりやすく、詳細なレビューが可能なため、明確な数値や百分率で表せるものをレビューしたい場合におすすめです。
                      </span>
                      <span v-if="modelValue.pointType === 'unlimited'">
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
            </td>
          </tr>
        </table>
      </v-card>
    </v-container>

    <v-container v-if="tab === 2" class="mt-3 ml-0 mb-0 mr-0 pa-0" fluid>
      <v-row>
        <v-col>
          <weight-settings :params="modelValue.reviewFactorParams"></weight-settings>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="tab === 3" class="mt-3 ml-0 mb-0 mr-0 pa-0" fluid>
      <v-row>
        <v-col>
          <tier-card
            :tier="modelValue"
            :point-type="pointType"
            @update-point-type="$emit('updatePointType', $event)"
            display-type="all"
            :no-header="true"
            :no-menu-icon="true"
            point-display-type="normal"
            width="100%"
            min-height="720px"
            class="ma-3"
          />
        </v-col>
      </v-row>
    </v-container>

  </v-container>
  <v-card-actions>
    <v-row class="justify-end ma-5">
      <v-btn v-if="tab > 0" @click="tab--">
        戻る
      </v-btn>
      <v-btn v-if="tab < 3" @click="tab++">
        次へ
      </v-btn>
      <v-btn v-else-if="tab == 3">
        完了
      </v-btn>
    </v-row>
  </v-card-actions>
</template>

<script lang="ts">
import { ReviewParagraphType, ReviewPointType, Tier } from '@/common/review'
import { defineComponent, PropType, ref } from 'vue'
import WeightSettings from '@/components/WeightSettings.vue'
import TweetEmbedder from '@/components/TweetEmbedder.vue'
import TierCard from '@/components/TierCard.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'TierSettings',
  components: {
    WeightSettings,
    TweetEmbedder,
    TierCard,
    PointTypeSelector,
    ReviewValueDisplay
  },
  props: {
    modelValue: {
      type: Object as PropType<Tier>,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {
    /** Tier名の変更 */
    updateTierName: (
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
  setup () {
    const tab = ref(0)
    const tweetdialog = ref(false)
    return {
      tab,
      tweetdialog
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
