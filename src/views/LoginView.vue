<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container>
    <v-card>
      <v-toolbar color="secondary">
        <v-card-title class="font-weight-bold">ログイン/新規登録</v-card-title>
        <v-spacer />
        <v-btn icon>
          <v-icon>
            mdi-help-circle-outline
          </v-icon>
        </v-btn>
      </v-toolbar>
      <div class="d-flex justify-center" style="width: 100%;">
        <div>
          <v-container>
            <v-row>
              <v-col>
                <span class="text-subtitle-2">Twitterでログイン</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-img @click="connectTemp('twitter', '1')" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span class="text-subtitle-2">Twitterでログイン(OAuth2)</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-img @click="connectTemp('twitter', '2')" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span class="text-subtitle-2">Googleでログイン</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-img @click="connectTemp('google', '2')" src="@/assets/sns/google-login.png" width="160px" class="cursor-pointer" />
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store/index'
import RestApi, { goOAuth1, goOAuth2, LoginServiceType, LoginVersionType, toastError } from '@/common/restapi'
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
    const retryLink = ref('')

    const connectTemp = (service: LoginServiceType, version: LoginVersionType) => {
      if (!store.getters.isRegistered) {
        store.commit('setTempSessionId', '')
        store.commit('setTempSessionService', '')
        store.commit('setTempSessionVersion', '')
        RestApi.getTempSession(service, version).then((response) => {
          store.commit('setTempSessionId', response.data.sessionId)
          store.commit('setTempSessionService', service)
          store.commit('setTempSessionVersion', version)
          if (version === '1') {
            switch (service) {
              case 'twitter':
                goOAuth1(
                  response.data.url
                )
                break
            }
          } else if (version === '2') {
            switch (service) {
              case 'twitter':
                goOAuth2(
                  'https://twitter.com/i/oauth2/authorize',
                  'code',
                  process.env.VUE_APP_TW_CLIENT_ID || '',
                  process.env.VUE_APP_OAUTH_REDIRECT || '',
                  'review-maker-twittwer',
                  response.data.codeChallenge,
                  's256',
                  'tweet.read%20users.read'
                )
                break
              case 'google':
                goOAuth2(
                  'https://',
                  'code',
                  process.env.VUE_APP_GG_CLIENT_ID || '',
                  process.env.VUE_APP_OAUTH_REDIRECT || '',
                  'review-maker-twittwer',
                  response.data.codeChallenge,
                  's256',
                  'tweet.read%20users.read'
                )
                break
            }
          }
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
      retryLink
    }
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
</style>
