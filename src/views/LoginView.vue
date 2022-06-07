<template>
  <v-card width="480px" class="center">
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
import { onMounted, computed, defineComponent } from 'vue'
import store from '@/store/index'
import restApi from '@/common/restapi'

export default defineComponent({
  name: 'LoginView',

  components: {

  },
  data () {
    return {
      aaa: process.env.VUE_APP_TWITTERAPI
    }
  },
  setup () {
    // const authLink = computed(() => {

    const connectTemp = () => {
      restApi.getTempSession().then((response) => {
        const session = response.data.Session
        const base = 'https://twitter.com/i/oauth2/authorize'
        const code = 'response_type=code'
        const clientId = `client_id=${process.env.VUE_APP_CLIENT_ID}`
        const redirectUri = 'redirect_uri=http://localhost:8200/login'
        const state = 'state=' + 'abcdef'
        const codeChallenge = `code_challenge=${session}`
        const codeChallengeMethod = 'code_challenge_method=s256'
        const scope = 'scope=tweet.read%20users.read'

        window.location.href = `${base}?${code}&${clientId}&${redirectUri}&${state}&${codeChallenge}&${codeChallengeMethod}&${scope}`
      }).catch(() => {
        alert('認証失敗')
      })
    }

    return {
      connectTemp
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
