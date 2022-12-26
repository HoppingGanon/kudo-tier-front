<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />
  <v-card width="480px" class="center">

    <!-- セッション有効期限をチェックする -->
    <session-checker />

    <v-card-title class="text-subtitle-1">ログイン</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <span class="text-subtitle-2">Twitterでログイン</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-img @click="connectTemp" src="@/assets/sns/twitter-login.png" width="160px" style="cursor: pointer" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store/index'
import RestApi from '@/common/restapi'
import router from '@/router'
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'LoginView',

  components: {
    SessionChecker
  },
  setup () {
    const store = useStore()

    if (store.state.sessionId === '') {
      const connectTemp = () => {
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

          window.location.href = `${base}?${code}&${clientId}&${redirectUri}&${state}&${codeChallenge}&${codeChallengeMethod}&${scope}`
        }).catch(() => {
          alert('認証失敗')
        })
      }
      return {
        connectTemp
      }
    } else {
      router.push('/home')
      const connectTemp = () => {
        alert('既にログイン済みです')
      }
      return {
        connectTemp
      }
    }
  }
})
</script>

<style Modules>
.center {
    margin-left: auto;
    margin-right: auto;
    top: 20%;
}
</style>
