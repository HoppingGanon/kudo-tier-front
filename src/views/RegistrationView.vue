<template>
  <v-container>
    <v-card>

      <!-- セッション有効期限をチェックする -->
      <session-checker :is-going="true" :no-temp-session-error="true" />
      <v-toolbar color="secondary">
        <v-card-title class="font-weight-bold">
          ユーザー登録
        </v-card-title>
      </v-toolbar>

      <v-form ref="form">
        <registration-component
          v-model:icon-url="iconUrl"
          v-model:disp-name="dispName"
          v-model:profile="profile"
          v-model:is-checked-terms="isCheckedTerms"
          :twitter-name="twitterName"
          :twitter-user-name="twitterUserName"
          :twitter-icon-url="twitterIconUrl"
          :is-new="true"
        />

      </v-form>
      <v-card-actions class="justify-end">
        <v-btn @click="cancel">
          今はしない
        </v-btn>
        <v-btn @click="submit">
          登録
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import store from '@/store'
import RestApi, { toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import SessionChecker from '@/components/SessionChecker.vue'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import { onBeforeRouteLeave } from 'vue-router'
import base64Api from '@/common/base64api'

export default defineComponent({
  name: 'RegistrationView',

  components: {
    SessionChecker,
    RegistrationComponent
  },
  setup () {
    const twitterName = computed(() => store.state.twitterName)
    const twitterUserName = computed(() => store.state.twitterUserName)
    const twitterIconUrl = computed(() => store.state.twitterIconUrl)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')
    const isCheckedTerms = ref(false)

    const form = ref()
    const isSumitting = ref(false)

    const toast = useToast()

    const submit = async () => {
      const validResult = await form.value.validate()
      if (validResult.valid) {
        const img = base64Api.dataURLToBase64(iconUrl.value)
        RestApi.createUser({
          name: dispName.value,
          profile: profile.value,
          iconBase64: img.base64,
          accept: isCheckedTerms.value
        }).then((res) => {
          isSumitting.value = true
          toast.success('登録しました')
          store.commit('setUserId', res.data.userId)
          router.push(`/home/${res.data.userId}`)
        }).catch((err) => {
          toast.error('登録に失敗しました')
          console.log(err)
        })
      } else {
        toast.warning('入力に誤りがあります')
      }
    }

    const cancel = () => {
      router.push('/login')
    }

    // これがないとページを離れる際のイベントが設定できない
    history.replaceState(null, '')

    // ページを離れた時にセッションを削除する
    onBeforeRouteLeave(() => {
      if (!isSumitting.value) {
        RestApi.delSession().catch((e) => toastError(e, toast))
        store.commit('initAllSession')
      }
    })

    return {
      twitterName,
      twitterUserName,
      twitterIconUrl,
      dispName,
      profile,
      iconUrl,
      isCheckedTerms,
      form,
      submit,
      cancel
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
