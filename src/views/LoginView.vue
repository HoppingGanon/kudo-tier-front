<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container>
    <v-card>
      <v-toolbar color="secondary">
        <v-card-title class="font-weight-bold">ログイン/新規登録</v-card-title>
      </v-toolbar>
        <div style="width: 100%;text-align:center;">
          <div class="ma-2" style="display: inline-block;">
            <span class="text-subtitle-2">Twitterでログイン(OAuth1.0a)</span>
          </div>
          <br/>
          <div class="ma-2" style="display: inline-block;">
            <v-img @click="connectTemp('twitter', '1')" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" />
          </div>
          <br/>
          <div class="ma-2" style="display: inline-block;">
            <span class="text-subtitle-2">Googleでログイン(OAuth2.0)</span>
          </div>
          <br/>
          <div class="ma-2" style="display: inline-block;">
            <v-img @click="connectTemp('google', '2')" src="@/assets/sns/google-login.png" width="160px" class="cursor-pointer" />
          </div>
        </div>
      <v-expansion-panels multiple>
        <v-expansion-panel title="敗北者認証">
          <template v-slot:text>
            <div style="width: 100%;text-align:center;">
            <span class="text-subtitle-2">Twitterでログイン(OAuth2.0)</span><br>
            <span class="text-caption" style="color: gray;">
              こっちの方が新しい認証方法だから文献少ない中ライブラリも無しに実装したのに、なんとモバイルでこのボタンを押してもTwitterアプリにリダイレクトして全然認証してくれないのです。
              （調べたところ他の開発者もみんな悩んでる様子）
              そもそもTwitterAPIが有償化するとかいってたけど本当にこれ大丈夫なんか？
              ってことで新時代の敗北者じゃけぇ
            </span>
            </div>
            <div class="d-flex justify-center" style="width: 100%;">
              <div class="ma-2">
                <v-img @click="connectTemp('twitter', '2')" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" />
              </div>
            </div>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store/index'
import RestApi, { LoginServiceType, LoginVersionType, toastError } from '@/common/restapi'
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
          window.location.href = response.data.url
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
