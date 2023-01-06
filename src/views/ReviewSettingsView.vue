<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="true" :no-session-error="true" />
  <v-container class="pa-0">
    <v-card class="ma-0">
      <v-toolbar color="secondary">
        <v-card-title>
          レビュー新規作成
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
          <v-tabs :model-value="tab" @update:model-value="updateTab" centered slider-color="primary">
            <v-tab>
              <span :class="tabValidation[0] === 'error' ? 'error-style' : ''">1. 概要</span>
            </v-tab>
            <v-tab :disabled="tabValidation[1] === 'none'">
              <span :class="tabValidation[1] === 'error' ? 'error-style' : ''">2. 評点</span>
            </v-tab>
            <v-tab :disabled="tabValidation[2] === 'none'">
              <span :class="tabValidation[2] === 'error' ? 'error-style' : ''">3. 説明</span>
            </v-tab>
            <v-tab :disabled="tabValidation[3] === 'none'">
              <span :class="tabValidation[3] === 'error' ? 'error-style' : ''">4. プレビュー</span>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-container v-show="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-form :ref="forms[0]">
          <v-row>
            <v-col>
              <v-card-title>
                1. 概要
              </v-card-title>
              <v-card-text>
                このレビューの概要・情報を入力してください。
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
                v-model="review.name"
                label="レビュー名 (必須)"
                hint="このレビュー対象を表す短い名前を設定してください (例: 劇場版〇〇)"
                :rules="[rulesFunc.required(), rulesFunc.maxLen(reviewValidation.nameLenMax)]"
              />
            </v-col>
          </v-row>
          <v-row class="mt-3 mb-3">
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="review.title"
                label="レビュータイトル"
                hint="レビューのタイトルを設定してください (例: 作中最高クラスの傑作映画)"
                :rules="[rulesFunc.maxLen(reviewValidation.titleLenMax)]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="7" lg="7" xl="7">
              <image-selector
                label="レビューのアイコンを設定してください"
                :aspect-ratio="(1 / 1)"
                @update-cropped-url="review.iconUrl = $event"
              />
            </v-col>
            <v-col cols="10" sm="6" md="4" lg="4" xl="4">
              <v-card v-if="review.iconUrl === ''" height="100%" class="dahed-box" flat>
                画像を選択するとここに表示されます
              </v-card>
              <v-img v-else style="border: 1px solid" height="100%" :src="review.iconUrl" />
            </v-col>
            <v-col cols="2" sm="1" md="1" lg="1" xl="1">
              <v-btn v-if="!isNew" icon flat @click="review.iconUrl = ''">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>

      <v-container v-show="tab === 1" flat class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-form :ref="forms[1]">
          <v-row>
            <v-col>
              <v-card-title>
                2. 評点
              </v-card-title>
              <v-card-text>
                このレビューの評点を設定してください<br />
                項目に評点を設定すると、自動的に総合ランクが計算されます
              </v-card-text>
            </v-col>
          </v-row>
          <v-row>
            <v-divider class="mt-3 mb-3"></v-divider>
          </v-row>
          <v-row>
            <v-col>
              <review-values-settings
                :review="review"
                :params="tier.reviewFactorParams"
                :point-type="tier.pointType"
                @update-point="updatePoint"
                @update-info="updateInfo"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>

      <v-container v-show="tab === 2" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-form :ref="forms[2]">
          <v-row>
            <v-col>
              <v-card-title>
                3. 説明
              </v-card-title>
              <v-card-text>
                このレビューの説明を入力してください
              </v-card-text>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" sm="9" md="10" lg="10" xl="10" />
            <v-col cols="4" sm="3" md="2" lg="2" xl="2">
              <menu-button :items="additionalItems" @select="addObject($event, 0, 0, true)">
                <template v-slot:button="{ open, props }">
                  <v-btn @click="open" v-bind="props" icon flat>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              </menu-button>
            </v-col>
          </v-row>
          <v-row v-for="section, index in review.sections" :key="index">
            <v-col>
              <v-container class="ma-0 pa-0" fluid>
                <v-row>
                  <v-col>
                    <section-component
                      :section="section"
                      :editable="true"
                      @update-title="updateSectionTitle($event, index)"
                      @update-parag-body="(v: string, j: number) => {updateParagBody(v, index, j)}"
                      @add-object="(v, j) => addObject(v, index, j, false)"
                      @del-section="() => delSection(index)"
                      @del-parag="(i) => delParag(index, i)"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-row v-if="review.sections.length === 0">
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

      <v-container v-show="tab === 3" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-form :ref="forms[3]">
          <v-row>
            <v-col>
              <v-card-title>
                4. プレビュー
              </v-card-title>
              <v-card-text>
                レビューの最終確認です<br />
                問題がなければ右下の「完了」を押してください
              </v-card-text>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <review-component
                :review="review"
                :point-type="tier.pointType"
                display-type="all"
                :no-header="true"
                :review-factor-params="tier.reviewFactorParams"
                :no-change-point="true"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
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
    </v-card>
  </v-container>

  <v-dialog v-model="confirmdialog">
    <v-container>
      <v-card>
        <v-toolbar color="secondary">
          <v-card-title>
            確認
          </v-card-title>
        </v-toolbar>
        <v-card-text>
          見出しがない場合、説明文やリンクは追加できません<br />
          既に入力がある場合は削除されます
        </v-card-text>
        <v-card-actions class="d-flex flex-row-reverse">
          <v-btn color="primary" dark @click="delAllSections">
            削除する
          </v-btn>
          <v-btn flat  @click="confirmdialog = false">
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import ReviewValuesSettings from '@/components/ReviewValuesSettings.vue'
import SectionComponent, { additionalItems } from '@/components/SectionComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import ReviewComponent from '@/components/ReviewComponent.vue'
import { ReviewParagraphType, ReviewFunc, reviewValidation, sectionValidation } from '@/common/review'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import RestApi, { ErrorResponse, Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { emptyReviwew, emptyTier } from '@/common/dummy'
import { ValidState } from '@/common/page'
import rules from '@/common/rules'
import router from '@/router'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    SessionChecker,
    ReviewValuesSettings,
    SectionComponent,
    MenuButton,
    ImageSelector,
    ReviewComponent
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNew = ref(true)

    const tab = ref(0)
    const confirmdialog = ref(false)
    const isSubmitting = ref(false)

    const tier = ref(ReviewFunc.cloneTier(emptyTier))
    const review = ref(ReviewFunc.cloneReview(emptyReviwew))
    review.value.sections.push({
      title: '',
      parags: [
        {
          type: 'text',
          body: ''
        }
      ]
    })

    onMounted(() => {
      if (route.params.tid && typeof route.params.tid === 'string') {
        RestApi.getTier(route.params.tid).then((res) => {
          // 成功の場合
          tier.value = Parser.parseTier(res.data)
          tier.value.reviewFactorParams.forEach((v) => {
            if (v.isPoint) {
              review.value.reviewFactors.push({
                point: 0
              })
            } else {
              review.value.reviewFactors.push({
                info: ''
              })
            }
          })
        }).catch((e) => {
          // 失敗の場合は通知を表示して、新規作成
          const v = e.response.data as ErrorResponse
          toast.warning(`${v.message}(${v.code}) Tierが存在しません`)
        })
      }
    })

    // これがないとイベントが設定できない
    history.replaceState(null, '')

    // ページを離れた時に警告する
    onBeforeRouteLeave(() => {
      if (!isSubmitting.value) {
        if (isNew.value &&
          review.value.name === '' &&
          review.value.title === '' &&
          review.value.iconUrl === '') {
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

      result = validResult.valid

      if (result) {
        tabValidation.value[index] = 'checked'
      } else {
        tabValidation.value[index] = 'error'
      }
      return result
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateTab = (v: any) => {
      valid(tab.value)
      tab.value = v
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
      if (route.params.tid && typeof route.params.tid === 'string') {
        const data = ReviewFunc.createReviewRequestData(review.value, route.params.tid, '')
        RestApi.postReview(data).then((v) => {
          toast.success('レビューを作成しました')
          isSubmitting.value = true
          router.push(`/review/${v.data}`)
        }).catch((e) => {
          const v = e.response.data as ErrorResponse
          toast.error(`${v.message}(${v.code})`)
        })
      }
    }

    const updatePoint = (v: number, i: number) => {
      if (i < review.value.reviewFactors.length && i < tier.value.reviewFactorParams.length && tier.value.reviewFactorParams[i].isPoint) {
        review.value.reviewFactors[i].point = v
      }
    }
    const updateInfo = (v: string, i: number) => {
      if (i < review.value.reviewFactors.length && i < tier.value.reviewFactorParams.length && !tier.value.reviewFactorParams[i].isPoint) {
        review.value.reviewFactors[i].info = v
      }
    }

    const addObject = (value: ReviewParagraphType | 'section', sectionIndex: number, paragIndex: number, isFirst: boolean) => {
      switch (value) {
        case 'section' :
          if (review.value.sections.length >= reviewValidation.sectionLenMax) {
            toast.warning(`追加できる説明文/リンクは合計${reviewValidation.sectionLenMax}個までです`)
            break
          }
          review.value.sections.splice(sectionIndex + (isFirst ? 0 : 1), 0,
            {
              title: '',
              parags: []
            }
          )
          break
        case 'text' :
        case 'twitterLink' :
        case 'imageLink' :
          if (review.value.sections[sectionIndex].parags.length >= sectionValidation.paragsLenMax) {
            toast.warning(`追加できる説明文/リンクは合計${sectionValidation.paragsLenMax}個までです`)
            break
          }
          if (review.value.sections.length === 0) {
            toast.warning('説明文の最上部は見出しを設定する必要があります')
            review.value.sections.push({
              title: '',
              parags: [
                {
                  type: value,
                  body: ''
                }
              ]
            })
          } else {
            review.value.sections[sectionIndex].parags.splice(paragIndex, 0,
              {
                type: value,
                body: ''
              }
            )
          }
          break
      }
    }

    const updateParagBody = (v: string, sectionIndex: number, paragIndex: number) => {
      review.value.sections[sectionIndex].parags[paragIndex].body = v
    }

    const updateSectionTitle = (v: string, sectionIndex: number) => {
      review.value.sections[sectionIndex].title = v
    }

    const delParag = (sectionIndex: number, paragIndex: number) => {
      review.value.sections[sectionIndex].parags.splice(paragIndex, 1)
    }

    const delAllSections = () => {
      review.value.sections.splice(0)
      confirmdialog.value = false
    }

    const delSection = (sectionIndex: number) => {
      if (review.value.sections.length === 0) {

      } else if (review.value.sections.length === 1) {
        if (review.value.sections[0].parags.length > 0) {
          if (review.value.sections[0].parags.filter((v) => v.body !== '').length !== 0) {
            // paragsの中に、bodyへの書き込みがあるparagがひとつでもあれば傾向を表示
            confirmdialog.value = true
            return
          }
        }
        delAllSections()
        return
      }

      if (sectionIndex === 0) {
        review.value.sections[1].parags.splice(0, 0, ...review.value.sections[0].parags)
      } else {
        review.value.sections[sectionIndex - 1].parags.splice(0, 0, ...review.value.sections[sectionIndex].parags)
      }
      review.value.sections.splice(sectionIndex, 1)
    }

    return {
      rulesFunc: rules,
      reviewValidation,
      isNew,
      tab,
      updateTab,
      confirmdialog,
      tabValidation,
      forms,
      next,
      back,
      submit,
      valid,
      tier,
      review,
      updatePoint,
      updateInfo,
      additionalItems,
      addObject,
      updateSectionTitle,
      updateParagBody,
      delParag,
      delSection,
      delAllSections
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.limit-bottom-2 {
  box-sizing: content-box;
  margin: 0;
}
</style>
