<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="true" :no-session-error="true" />
  <v-container class="pa-0">
    <v-card class="ma-0">
      <v-toolbar color="secondary">
        <v-card-title v-if="isNew">
          レビュー新規作成
        </v-card-title>
        <v-card-title v-else>
          レビュー編集
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
            <v-tab>
              <span>編集</span>
            </v-tab>
            <v-tab>
              <span>プレビュー</span>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-form ref="form">
        <v-container v-show="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
          <v-row>
            <v-col>
              <v-card-title>
                編集
              </v-card-title>
              <v-card-text>
                このレビューの情報を入力してください。
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
              <v-img v-else style="border: 1px solid" height="100%" :src="getImgSource(review.iconUrl)" />
            </v-col>
            <v-col cols="2" sm="1" md="1" lg="1" xl="1">
              <v-btn v-if="!isNew" icon flat @click="review.iconUrl = ''">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
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
        </v-container>
      </v-form>
      <v-container v-show="tab === 1" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-row>
          <v-col>
            <v-card-title>
              プレビュー
            </v-card-title>
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
      </v-container>
      <v-card-actions>
        <v-row class="justify-end ma-5">
          <v-btn v-show="tab == 0" @click="tab = 1">
            プレビュー
          </v-btn>
          <v-btn v-show="tab == 1" @click="tab = 0">
            編集画面へ
          </v-btn>
          <v-btn @click="submit">
            完了
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>

  <simple-dialog
    v-model="confirmdialog"
    title="確認"
    text="見出しがない場合、説明文やリンクは追加できません"
    append-text="既に入力がある場合は削除されます"
    submit-button-text="削除"
    close-button-text="キャンセル"
  >
  </simple-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import ReviewValuesSettings from '@/components/ReviewValuesSettings.vue'
import SectionComponent, { additionalItems } from '@/components/SectionComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import ReviewComponent from '@/components/ReviewComponent.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import { ReviewParagraphType, ReviewFunc, reviewValidation, sectionValidation } from '@/common/review'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import RestApi, { ErrorResponse, Parser, toastError, getImgSource } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { emptyReviwew, emptyTier } from '@/common/dummy'
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
    ReviewComponent,
    SimpleDialog
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNew = ref(true)

    const tab = ref(0)
    const confirmdialog = ref(false)
    const isSubmitting = ref(false)
    const form = ref()

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
        // RouterからTierIDが指定されている場合
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
          isNew.value = true
        }).catch((e) => {
          // 失敗の場合は通知を表示して、新規作成
          const v = e.response.data as ErrorResponse
          toast.warning(`${v.message}(${v.code}) Tierが存在しません`)
          isNew.value = true
        })
      }

      if (route.params.rid && typeof route.params.rid === 'string') {
        // RouterからReviewIDが指定されている場合
        RestApi.getReview(route.params.rid).then((revres) => {
          // 成功の場合
          RestApi.getTier(revres.data.review.tierId).then((res) => {
          // 成功の場合
            review.value = Parser.parseReview(revres.data.review)
            tier.value = Parser.parseTier(res.data)
            isNew.value = false
          }).catch((e) => {
            // 失敗の場合は通知を表示して、新規作成
            toastError(e, toast)
            toast.warning('レビューを新規作成します')
            isNew.value = true
          })
        }).catch((e) => {
          // 失敗の場合は通知を表示して、新規作成
          toastError(e, toast)
          toast.warning('レビューを新規作成します')
          isNew.value = true
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

    const valid = async () => {
      let result = false
      const validResult = await form.value.validate()

      result = validResult.valid
      return result
    }

    const submit = async () => {
      // バリデーションチェックを行う
      if (!await valid()) {
        toast.warning('適切でない入力があります。')
        return
      }
      if (isNew.value) {
        // 新規作成
        const data = ReviewFunc.createReviewRequestData(review.value, tier.value.tierId)
        RestApi.postReview(data).then((v) => {
          toast.success('レビューを作成しました')
          isSubmitting.value = true
          router.push(`/review/${v.data}`)
        }).catch((e) => {
          const v = e.response.data as ErrorResponse
          toast.error(`${v.message}(${v.code})`)
        })
      } else {
        // 編集
        const data = ReviewFunc.createReviewRequestData(review.value, tier.value.tierId)
        RestApi.updateReview(review.value.reviewId, data).then((v) => {
          toast.success('レビューを更新しました')
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
      getImgSource,
      rulesFunc: rules,
      reviewValidation,
      isNew,
      tab,
      confirmdialog,
      form,
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
