<template>
  <div v-if="!disableTwitter" style="width: 100%;text-align:center;">
    <div class="ma-2" style="display: inline-block;">
      <span class="text-subtitle-2">Twitterでログイン(OAuth1.0a)</span>
    </div>
    <br/>
    <div class="ma-2" style="display: inline-block;">
      <v-img @click="connectTemp('twitter', '1')" src="@/assets/sns/twitter-login.png" width="160px" class="cursor-pointer" />
    </div>
  </div>
  <br/>
  <div v-if="!disableGoogle" style="width: 100%;text-align:center;">
    <div class="ma-2" style="display: inline-block;">
      <span class="text-subtitle-2">Googleでログイン(OAuth2.0)</span>
    </div>
    <br/>
    <div class="ma-2" style="display: inline-block;">
      <v-img @click="connectTemp('google', '2')" src="@/assets/sns/google-login.png" width="160px" class="cursor-pointer" />
    </div>
  </div>
  <v-expansion-panels v-if="!disableTwitter" multiple>
    <v-expansion-panel title="敗北者認証">
      <template v-slot:text>
        <div style="width: 100%;text-align:center;">
        <span class="text-subtitle-2">Twitterでログイン(OAuth2.0)</span><br>
        <span class="text-caption" style="color: gray;">
          こっちの方が新しい認証方法だから文献少ない中ライブラリも無しに実装したのに、
          なんとモバイルブラウザででこのボタンを押すとTwitterアプリにリダイレクトして認証してくれないことがあるのです。
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

  <loading-component :is-loading="isloading" :is-force="true" class="mt-5" title="情報を取得しています..." />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store/index'
import RestApi, { LoginServiceType, LoginVersionType, toastError } from '@/common/restapi'
import LoadingComponent from '@/components/LoadingComponent.vue'
import router from '@/router'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'LoginComponent',
  components: {
    LoadingComponent
  },
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    },
    disableTwitter: {
      type: Boolean,
      default: false
    },
    disableGoogle: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const store = useStore()
    const toast = useToast()
    const retryLink = ref('')
    const isloading = ref(false)

    const connectTemp = (service: LoginServiceType, version: LoginVersionType) => {
      isloading.value = true
      if (!store.getters.isRegistered || (store.getters.isRegistered && props.isUpdate)) {
        // 未ログイン状態か、ログイン状態で連携サービスの更新をかける場合
        store.commit('setTempSessionId', '')
        store.commit('setTempSessionService', '')
        store.commit('setTempSessionVersion', '')
        RestApi.getTempSession(service, version).then((response) => {
          store.commit('setTempSessionAdditioning', props.isUpdate)
          store.commit('setTempSessionId', response.data.sessionId)
          store.commit('setTempSessionService', service)
          store.commit('setTempSessionVersion', version)
          window.location.href = response.data.url
        }).catch((e) => {
          toastError(e, toast)
        })
      }
    }

    if (!props.isUpdate && store.getters.isRegistered) {
      toast.warning('すでにログイン済みです')
      router.push(`/home/${store.state.userId}`)
    }

    return {
      connectTemp,
      retryLink,
      isloading
    }
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
</style>
