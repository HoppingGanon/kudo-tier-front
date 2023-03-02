<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker :no-session-error="true" />
  <v-container class="pa-0 down">
    <v-card class="ma-0">
      <v-toolbar color="secondary">
        <v-card-title v-if="isNew" class="font-weight-bold">
          レビュー新規作成
        </v-card-title>
        <v-card-title v-else class="font-weight-bold">
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
              <span>レビュー情報の入力</span>
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
              <v-card-title class="font-weight-bold">
                レビュー情報の入力
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
            <v-col cols="8" sm="6" md="5" lg="4" xl="3">
              <image-selector
                label="レビューのアイコンを設定してください"
                :cropped-url="review.iconUrl"
                :aspect-ratio="(1 / 1)"
                @update-cropped-url="review.iconUrl = $event"
                img-max-height="320px"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider class="mt-3 mb-3"></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <review-values-settings
                :review="review"
                :params="tier.reviewFactorParams"
                :point-type="tier.pointType"
                @update-point="updatePoint"
                @update-info="updateInfo"
                :pulling-up="tier.pullingUp"
                :pulling-down="tier.pullingDown"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <section-editor-component
                :sections="review.sections"
                @update-title="updateSectionTitle"
                @update-section-title="updateSectionTitle"
                @update:parags="(v, i) => review.sections[i].parags = v"
                @update-parag-body="updateParagBody"
                @add-section="addSection"
                @add-parag="addParag"
                @del-section="delSection"
                @del-parag="delParag"
                @submit="submit"
                @preview="toggleTab"
                title="詳しい説明分の追加"
              />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <v-divider class="ml-2 mr-2" />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-container v-show="tab === 1" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-row>
          <v-col>
            <v-card-title class="font-weight-bold">
              プレビュー
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12" sm="12" md="12" lg="10" xl="8">
            <review-component
              :review="review"
              :point-type="tier.pointType"
              display-type="all"
              :no-header="true"
              :review-factor-params="tier.reviewFactorParams"
              :no-change-point="true"
              :pulling-up="tier.pullingUp"
              :pulling-down="tier.pullingDown"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <editor-tools
              :floatingStyle="true"
              @submit="submit"
              @preview="toggleTab"
              :allow-toggle="false"
              :hide-section="true"
              :hide-parag="true"
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
            情報の入力
          </v-btn>
          <v-btn @click="submit">
            <span v-if="isNew">作成</span>
            <span v-else>更新</span>
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import ReviewValuesSettings from '@/components/ReviewValuesSettings.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import ReviewComponent from '@/components/ReviewComponent.vue'
import SectionEditorComponent from '@/components/SectionEditorComponent.vue'
import EditorTools from '@/components/EditorTools.vue'
import { ReviewParagraphType, ReviewFunc, reviewValidation, sectionValidation, ReviewSection, ReviewParagraph } from '@/common/review'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import RestApi, { ErrorResponse, Parser, toastError, getImgSource } from '@/common/restapi'
import { ToastProps, useToast } from 'vue-toast-notification'
import { emptyReviwew, emptyTier } from '@/common/dummy'
import rules from '@/common/rules'
import router from '@/router'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    SessionChecker,
    ReviewValuesSettings,
    ImageSelector,
    ReviewComponent,
    SectionEditorComponent,
    EditorTools
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNew = ref(true)

    const tab = ref(0)
    const isSubmitting = ref(false)
    const form = ref()

    const tier = ref(ReviewFunc.cloneTier(emptyTier))
    const review = ref(ReviewFunc.cloneReview(emptyReviwew))
    review.value.sections.push({
      title: '',
      parags: [
        {
          type: 'text',
          body: '',
          isChanged: false
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
          tier.value.parags.forEach((_, i) => {
            tier.value.parags[i].isChanged = false
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
        tab.value = 0
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
          toastError(e, toast)
        })
      } else {
        // 編集
        const data = ReviewFunc.createReviewRequestData(review.value, tier.value.tierId)
        RestApi.updateReview(review.value.reviewId, data).then((v) => {
          toast.success('レビューを更新しました')
          isSubmitting.value = true
          router.push(`/review/${v.data}`)
        }).catch((e) => {
          toastError(e, toast)
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
        case 'serviceLink' :
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
                  body: '',
                  isChanged: false
                }
              ]
            })
          } else {
            review.value.sections[sectionIndex].parags.splice(paragIndex, 0,
              {
                type: value,
                body: '',
                isChanged: false
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

    const addSection = (sectionIndex: number) => {
      const newSection: ReviewSection = {
        title: '',
        parags: [
          {
            type: 'text',
            body: ''
          }
        ]
      }
      review.value.sections.splice(sectionIndex, 0, newSection)
    }

    const addParag = (paragType: ReviewParagraphType, sectionIndex: number, paragIndex: number) => {
      const newParag: ReviewParagraph = {
        type: paragType,
        body: ''
      }
      review.value.sections[sectionIndex].parags.splice(paragIndex, 0, newParag)
    }

    const delParag = (sectionIndex: number, paragIndex: number) => {
      review.value.sections[sectionIndex].parags.splice(paragIndex, 1)
    }

    const delSection = (sectionIndex: number) => {
      if (review.value.sections.length === 0) {
        return
      }
      review.value.sections.splice(sectionIndex, 1)
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
      rulesFunc: rules,
      reviewValidation,
      isNew,
      tab,
      form,
      submit,
      valid,
      tier,
      review,
      updatePoint,
      updateInfo,
      addObject,
      updateSectionTitle,
      updateParagBody,
      addSection,
      addParag,
      delParag,
      delSection,
      toggleTab
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

.down {
  margin-top: 60px;
}
</style>
