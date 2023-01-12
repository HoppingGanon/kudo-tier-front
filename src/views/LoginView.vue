<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container fluid class="ma-0 pa-1">
    <v-row>
      <v-col cols="0" sm="0" md="3" lg="4" xl="4" />
      <v-col cols="12" sm="12" md="6" lg="4" xl="4">
        <v-card class="margin-top">
          <!-- セッション有効期限をチェックする -->
          <session-checker />
          <v-toolbar color="secondary">
            <v-card-title class="font-weight-bold">ログイン</v-card-title>
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
          const session = response.data.codeChallenge
          const base = 'https://twitter.com/i/oauth2/authorize'
          const code = 'response_type=code'
          const clientId = `client_id=${process.env.VUE_APP_CLIENT_ID}`
          const redirectUri = `redirect_uri=${process.env.VUE_APP_REDIRECT}`
          const state = 'state=' + 'review-maker-twittwer'
          const codeChallenge = `code_challenge=${session}`
          const codeChallengeMethod = 'code_challenge_method=s256'
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
