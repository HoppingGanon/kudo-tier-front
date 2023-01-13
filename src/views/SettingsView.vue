<template>
  <session-checker :is-going="true" :no-session-error="true" />
  <v-container>
    <v-card>
      <v-toolbar color="secondary">
        <v-card-title class="font-weight-bold">
          ユーザー設定
        </v-card-title>
        <v-spacer />
        <v-btn icon hint="保存" @click="save">
          <v-icon>
            mdi-content-save
          </v-icon>
        </v-btn>
        <template v-slot:extension>
          <v-tabs v-model="tab" centered slider-color="primary" grow>
            <v-tab>
              プロフィール
            </v-tab>
            <v-tab>
              詳細設定
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <div v-show="tab === 0">
        <v-form ref="form">
          <registration-component
            v-model:icon-url="iconUrl"
            v-model:disp-name="dispName"
            v-model:profile="profile"
            :twitter-name="twitterName"
            :twitter-user-name="twitterUserName"
            :twitter-icon-url="twitterIconUrl"
            :is-new="false"
          />
        </v-form>
      </div>

      <div v-show="tab === 1">
        <v-container fluid class="ma-0 pa-1">
          <v-row>
            <v-col>
              <div class="mt-1 ml-1">
                <span class="text-caption">
                  有効にすると、他人がユーザー情報を参照したときに、Twitterアカウントにアクセスできるリンクボタンを表示します
                </span>
              </div>
              <v-checkbox
                v-model="allowTwitterLink"
                label="Twitterへのリンクを表示する"
              >
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-card-actions class="d-flex flex-row-reverse">
        <v-btn @click="save">
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import store from '@/store'
import RestApi, { toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import Base64Api from '@/common/base64api'
import router from '@/router'

export default defineComponent({
  name: 'SettingsView',
  components: {
    SessionChecker,
    RegistrationComponent
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const toast = useToast()

    const tab = ref(0)
    const twitterName = computed(() => store.state.twitterName)
    const twitterUserName = computed(() => store.state.twitterUserName)
    const twitterIconUrl = computed(() => store.state.twitterIconUrl)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')
    const allowTwitterLink = ref(false)

    const form = ref()

    onMounted(() => {
      if (store.getters.isRegistered) {
        RestApi.getUserData(store.state.userId).then((res) => {
          dispName.value = res.data.name
          profile.value = res.data.profile
          iconUrl.value = res.data.iconUrl
          allowTwitterLink.value = res.data.allowTwitterLink
        }).catch((e) => toastError(e, toast))
      }
    })

    const save = async () => {
      const validResult = await form.value.validate()
      if (validResult.valid) {
        RestApi.updateUser({
          name: dispName.value,
          profile: profile.value,
          iconBase64: Base64Api.dataURLToBase64(iconUrl.value),
          allowTwitterLink: allowTwitterLink.value
        }, store.state.userId).then((res) => {
          toast.success('ユーザー設定を更新しました')
          router.push(`/home/${res.data}`)
        }).catch((e) => toastError(e, toast))
      }
    }

    return {
      tab,
      twitterName,
      twitterUserName,
      twitterIconUrl,
      dispName,
      profile,
      iconUrl,
      allowTwitterLink,
      form,
      save
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
