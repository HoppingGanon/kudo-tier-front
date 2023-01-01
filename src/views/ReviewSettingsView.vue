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
              1. レビュー設定
            </v-tab>
            <v-tab>
              2. プレビュー
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-container v-show="tab === 0" class="mt-3 ml-0 mb-0 mr-0 pa-1" fluid>
        <v-row>
          <v-col>
            <v-card-title>
              1. レビュー設定
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
              label="レビュー名"
              hint="このレビューを表す分かりやすい名前を設定してください"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="レビュータイトル"
              hint="レビューの文章を一言で表したタイトルを設定してください"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <review-values-settings />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-row-reverse">
            <menu-button :items="additionalItems" @select="addObject($event, 0)">
              <template v-slot:button="{ open, props }">
                <v-btn @click="open" v-bind="props" color="primary">
                  <v-icon>mdi-plus-thick</v-icon>追加
                </v-btn>
              </template>
            </menu-button>

          </v-col>
        </v-row>
        <v-row v-for="section, i in review.sections" :key="i">
          <v-col>
            <v-container class="ma-0 pa-0" fluid>
              <v-row>
                <v-col>
                  <section-component :section="section" :editable="true" />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex flex-row-reverse">
                  <menu-button :items="additionalItems" @select="addObject($event, i)">
                    <template v-slot:button="{ open, props }">
                      <v-btn @click="open" v-bind="props" color="primary">
                        <v-icon>mdi-plus-thick</v-icon>追加
                      </v-btn>
                    </template>
                  </menu-button>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import TierSettings from '@/components/TierSettings.vue'
import ReviewValuesSettings from '@/components/ReviewValuesSettings.vue'
import SectionComponent from '@/components/SectionComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
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
    MenuButton
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const tab = ref(0)
    const updateTab = (v: any) => {
      tab.value = v
    }

    const review = ref(emptyReviwew)

    const additionalItems: SelectObject<ReviewParagraphType | 'section', string>[] = [
      {
        text: 'セクション区切り',
        value: 'section'
      },
      {
        text: '説明文',
        value: 'text'
      },
      {
        text: 'Twitterリンク',
        value: 'twitterLink'
      }
    ]

    const addObject = (value: ReviewParagraphType | 'section', index: number) => {
      console.log(value)
      switch (value) {
        case 'section' :
          review.value.sections.splice(index, 0,
            {
              title: '',
              parags: [
                {
                  type: 'text',
                  body: ''
                }
              ]
            }
          )
          break
        case 'text' :
          review.value.sections[index].parags.push({
            type: 'text',
            body: ''
          })
          break
        case 'twitterLink' :
          review.value.sections[index].parags.push({
            type: 'twitterLink',
            body: ''
          })
          break
        case 'imageLink' :
          review.value.sections[index].parags.push({
            type: 'imageLink',
            body: ''
          })
          break
      }
    }

    return {
      tab,
      updateTab,
      review,
      additionalItems,
      addObject
    }
  }
})
</script>
