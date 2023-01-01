<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="true" :no-session-error="true" />

  <v-container class="pa-0">
    <v-card class="ma-0">
      <v-toolbar color="secondary">
        <v-card-title>
          Review新規作成
        </v-card-title>
        <template v-slot:extension>
          <v-tabs :model-value="tab" @update:model-value="updateTab" centered slider-color="primary">
            <v-tab>
              1. 概要
            </v-tab>
            <v-tab>
              2. 評点
            </v-tab>
            <v-tab>
              3. 説明
            </v-tab>
            <v-tab>
              4. プレビュー
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-container v-show="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
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
              label="レビュー名 (必須)"
              hint="このレビュー対象を表す短い名前を設定してください (例: 劇場版〇〇)"
              class="font-weight-bold"
            />
          </v-col>
        </v-row>
        <v-row class="mt-3 mb-3">
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="レビュータイトル"
              hint="レビューのタイトルを設定してください (例: 作中最高クラスの傑作映画)"
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
        <v-row>
          <v-divider class="mt-3 mb-3"></v-divider>
        </v-row>
        <v-row>
          <v-col>
            <review-values-settings />
          </v-col>
        </v-row>
      </v-container>

      <v-container v-show="tab === 1" flat class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-row>
          <v-col>
            <v-card-title>
              2. 評点
            </v-card-title>
            <v-card-text>
              このレビューの評点を設定してください
            </v-card-text>
          </v-col>
        </v-row>

      </v-container>

      <v-container v-show="tab === 2" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
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
      </v-container>
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
import TierSettings from '@/components/TierSettings.vue'
import ReviewValuesSettings from '@/components/ReviewValuesSettings.vue'
import SectionComponent, { additionalItems } from '@/components/SectionComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import { ReviewParagraphType, ReviewPointType, Tier } from '@/common/review'
import { useRoute } from 'vue-router'
import RestApi, { ErrorResponse, Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { emptyReviwew } from '@/common/dummy'
import { SelectObject } from '@/common/page'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    SessionChecker,
    ReviewValuesSettings,
    SectionComponent,
    MenuButton,
    ImageSelector
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const isNew = ref(true)

    const tab = ref(0)
    const updateTab = (v: any) => {
      tab.value = v
    }
    const confirmdialog = ref(false)

    const review = ref(emptyReviwew)

    const addObject = (value: ReviewParagraphType | 'section', sectionIndex: number, paragIndex: number, isFirst: boolean) => {
      switch (value) {
        case 'section' :
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
      isNew,
      tab,
      updateTab,
      confirmdialog,
      review,
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
