<template>
  <div>
    <v-card width="540px" min-height="320px" class="center">

    <!-- セッション有効期限をチェックする -->
    <session-checker :is-going="true" :no-temp-session-error="true" />

      <v-card-title>
        ユーザー登録
      </v-card-title>

      <v-form ref="form">
        <registration-component
          v-model:icon-url="iconUrl"
          v-model:disp-name="dispName"
          v-model:profile="profile"
          v-model:is-checked-terms="isCheckedTerms"
          :twitter-name="twitterName"
          :twitter-user-name="twitterUserName"
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

  </div>
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

export default defineComponent({
  name: 'RegistrationView',

  components: {
    SessionChecker,
    RegistrationComponent
  },
  setup () {
    const twitterName = computed(() => store.state.twitterName)
    const twitterUserName = computed(() => store.state.twitterUserName)
    const dispName = ref('')
    const profile = ref('')
    const isCheckedTerms = ref(false)
    const iconUrl = computed(() => store.state.iconUrl)
    const form = ref()

    const toast = useToast()

    const submit = async () => {
      const validResult = await form.value.validate()
      if (validResult.valid) {
        RestApi.createUser({
          name: dispName.value,
          profile: profile.value,
          accept: isCheckedTerms.value
        }).then((res) => {
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
      RestApi.delSession().catch((e) => toastError(e, toast))
      store.commit('initAllSession')
    })

    return {
      twitterName,
      twitterUserName,
      dispName,
      profile,
      isCheckedTerms,
      iconUrl,
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

.scroll {
  overflow-y: scroll;
}
</style>
