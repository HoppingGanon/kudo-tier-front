<template>
  <v-container>
    <v-card>

      <!-- セッション有効期限をチェックする -->
      <session-checker :no-temp-session-error="true" />

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
          :twitter-user-name="twitterUserName"
          :google-email="googleEmail"
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

  <loading-component :is-loading="isSubmitting" :is-force="true" class="mt-5" title="ユーザー情報を送信中..." />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import store from '@/store'
import RestApi, { toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import SessionChecker from '@/components/SessionChecker.vue'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { onBeforeRouteLeave } from 'vue-router'
import base64Api from '@/common/base64api'

export default defineComponent({
  name: 'RegistrationView',

  components: {
    SessionChecker,
    RegistrationComponent,
    LoadingComponent
  },
  setup () {
    const twitterUserName = computed(() => store.state.twitterUserName)
    const googleEmail = computed(() => store.state.googleEmail)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')
    const isCheckedTerms = ref(false)

    const form = ref()
    const isSubmitting = ref(false)

    const toast = useToast()

    const submit = async () => {
      const validResult = await form.value.validate()
      if (validResult.valid) {
        isSubmitting.value = true
        const img = base64Api.dataURLToBase64(iconUrl.value)
        RestApi.createUser({
          name: dispName.value,
          profile: profile.value,
          iconBase64: img.base64,
          accept: isCheckedTerms.value
        }).then((res) => {
          toast.success('登録しました')
          store.commit('setUserId', res.data.userId)
          router.push(`/home/${res.data.userId}`)
        }).catch((err) => {
          toastError(err, toast)
        }).finally(() => {
          isSubmitting.value = false
        })
      } else {
        toast.warning('入力に誤りがあります')
      }
    }

    const cancel = () => {
      router.push('/login')
    }

    // ページを離れた時にセッションを削除する
    onBeforeRouteLeave(() => {
      if (!isSubmitting.value) {
        RestApi.delSession().catch((e) => toastError(e, toast))
        store.commit('initAllSession')
      }
    })

    return {
      twitterUserName,
      googleEmail,
      dispName,
      profile,
      iconUrl,
      isCheckedTerms,
      form,
      isSubmitting,
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
