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
              hint="このTierを表す分かりやすい名前を設定してください。"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <review-values-settings />
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
import { ReviewParagraphType, ReviewPointType, Tier } from '@/common/review'
import { useRoute } from 'vue-router'
import RestApi, { ErrorResponse, Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'TierSettingsView',
  components: {
    SessionChecker,
    ReviewValuesSettings
  },
  setup () {
    const route = useRoute()
    const toast = useToast()

    const tab = ref(0)
    const updateTab = (v: any) => {
      tab.value = v
    }

    return {
      tab,
      updateTab
    }
  }
})
</script>
