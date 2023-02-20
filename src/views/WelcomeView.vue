<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <v-col>
        <div v-if="hasSession" style="width: 100%;" class="d-flex justify-end">
          <v-btn flat @click="goHome" class="ml-3">
            ホームへ移動
          </v-btn>
          <v-btn flat @click="logoutDialog = true" class="ml-3">
            ログアウト
          </v-btn>
        </div>
        <div v-else style="width: 100%;" class="d-flex justify-end">
          <v-btn flat @click="goLogin" class="ml-3">
            ログイン/新規登録
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <welcome-carousel />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <explanation-summary :has-session="hasSession" />
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: center;">
        <v-btn v-if="hasSession" color="primary" class="text-no-transform" @click="goHome">TierReviewsのホーム画面へ</v-btn>
        <v-btn v-else color="primary" class="text-no-transform" @click="goLogin">TierReviewsをはじめる</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div style="height: 100px"></div>
      </v-col>
    </v-row>
  </v-container>

  <simple-dialog
    v-model="logoutDialog"
    title="ログアウト"
    text="本当にログアウトしますか？"
    submit-button-text="ログアウト"
    close-button-text="キャンセル"
    @submit="goLogout"
  />

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import WelcomeCarousel from '@/components/WelcomeCarousel.vue'
import ExplanationSummary from '@/components/ExplanationSummary.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import store from '@/store'
import router from '@/router'

export default defineComponent({
  name: 'WelcomeView',
  components: {
    WelcomeCarousel,
    ExplanationSummary,
    SimpleDialog,
    SessionChecker
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const logoutDialog = ref(false)
    const hasSession = computed(() => store.getters.isRegistered)

    const goHome = () => {
      router.push('/home')
    }

    const goLogin = () => {
      router.push('/login')
    }

    const goLogout = () => {
      router.push('/logout')
    }

    return {
      hasSession,
      logoutDialog,
      goHome,
      goLogin,
      goLogout
    }
  }
})
</script>

<style scoped>
</style>
