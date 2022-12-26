<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <!-- サイズ調整のためfluidは入れない -->
  <v-container v-if="isNotFound" class="pa-0">
    <v-row>
      <v-col>
        <v-card>
          <error-component
            comment="Tierが見つかりません"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- サイズ調整のためfluidは入れない -->
  <v-container v-else class="pa-0">
    <v-card class="block-center" max-width="1080px">
      <v-toolbar color="secondary" dark>
        <v-card-title>
          Tier
        </v-card-title>
        <v-spacer />
        <v-card-actions v-if="isSelf">
          <v-btn class="mt-3 mr-3">
            <v-icon>
              mdi-book-plus-outline
            </v-icon>
            レビューを追加する
          </v-btn>
          <v-btn class="mt-3 mr-3" @click="edit">
            <v-icon>
              mdi-pencil-box-outline
            </v-icon>
            Tierを編集する
          </v-btn>
        </v-card-actions>
      </v-toolbar>

      <tier-component
        class="pa-1"
        :tier="tier"
        :point-type="pointType"
        @update-point-type="updatePointType"
        display-type="all"
        point-display-type="normal"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { ReviewPointType } from '@/common/review'
import TierComponent from '@/components/TierComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import { emptyTier } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import store from '@/store'
import router from '@/router'

export default defineComponent({
  name: 'TierView',
  components: {
    TierComponent,
    ErrorComponent,
    SessionChecker
  },
  props: {},
  emits: {},
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(false)
    const isSelf = ref(false)

    const tier = ref(emptyTier)
    const pointType = ref('stars' as ReviewPointType)
    const updatePointType = (v: ReviewPointType) => {
      pointType.value = v
    }

    // tierの初期値を設定
    onMounted(() => {
      if (route.params.uid && typeof route.params.uid === 'string' && route.params.tid && typeof route.params.tid === 'string') {
        // URIにIDが含まれている場合
        RestApi.getTier(route.params.uid, route.params.tid).then((res) => {
          tier.value = Parser.parseTier(res.data)
          pointType.value = tier.value.pointType
          isNotFound.value = false
        }).catch((e) => {
          const v = e.response.data
          toast.warning(`${v.message} (${v.code})`)
          isNotFound.value = true
        })
        // 自身のTierを表示している場合
        isSelf.value = route.params.uid === store.state.userId
      }
    })

    const edit = () => {
      if (!isNotFound.value && isSelf.value) {
        router.push(`/tier-settings/${route.params.uid}/${route.params.tid}`)
      }
    }

    return {
      tier,
      pointType,
      isNotFound,
      isSelf,
      updatePointType,
      edit
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
