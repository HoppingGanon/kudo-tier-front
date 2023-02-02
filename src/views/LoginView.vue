<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container fluid class="ma-0 pa-1">
    <v-row>
      <v-col cols="0" sm="0" md="3" lg="4" xl="4" />
      <v-col cols="12" sm="12" md="6" lg="4" xl="4">
        <v-card class="margin-top">
          <v-toolbar color="secondary">
            <v-card-title class="font-weight-bold">ログイン/新規登録</v-card-title>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col>
                <span class="text-subtitle-2">Twitterでログイン</span>
              </v-col>
            </v-row>
            <v-row v-if="wasFailed">
              <v-col>
                <span class="error-style">スマホをご利用の場合、Twitterアプリが開いてしまってログインできない場合があります<br />失敗した場合は30秒以内にもう一度以下のボタンを「新しいタブを開く」等で開いてください</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <a v-if="wasFailed" :href="retryLink"><v-img @click="connectTemp" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" /></a>
                <v-img v-else @click="connectTemp" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store/index'
import RestApi, { toastError } from '@/common/restapi'
import router from '@/router'
import SessionChecker from '@/components/SessionChecker.vue'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'LoginView',

  components: {
    SessionChecker
  },
  setup () {
    const store = useStore()
    const toast = useToast()
    const wasFailed = ref(false)
    const retryLink = ref('')

    const connectTemp = () => {
      if (!store.getters.isRegistered) {
        RestApi.getTempSession().then((response) => {
          // URI
          const base = 'https://twitter.com/i/oauth2/authorize'
          // OAuth2.0では"code"固定
          const code = 'response_type=code'
          // 開発者ページで確認した固有ID
          const clientId = `client_id=${process.env.VUE_APP_CLIENT_ID}`
          // リダイレクト先(AuthView)
          const redirectUri = `redirect_uri=${process.env.VUE_APP_REDIRECT}`
          // 状態を渡す
          const state = 'state=' + 'review-maker-twittwer'
          // バックエンドから渡されたコードチャレンジ(バックエンドで元のcode_verifierから計算した文字列)
          const codeChallenge = `code_challenge=${response.data.codeChallenge}`
          // コードチャレンジの計算アルゴリズム
          const codeChallengeMethod = 'code_challenge_method=s256'
          // 使用する権限
          const scope = 'scope=tweet.read%20users.read'

          store.commit('setTempSessionId', response.data.sessionId)

          retryLink.value = `${base}?${code}&${clientId}&${redirectUri}&${state}&${codeChallenge}&${codeChallengeMethod}&${scope}`
          window.location.href = retryLink.value
          setTimeout(() => {
            wasFailed.value = true
          }, 1000)
        }).catch((e) => {
          toastError(e, toast)
        })
      }
    }

    if (store.getters.isRegistered) {
      toast.warning('すでにログイン済みです')
      router.push(`/home/${store.state.userId}`)
    }

    return {
      connectTemp,
      wasFailed,
      retryLink
    }
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
.margin-top {
    margin-top: 20vh;
}
</style>
