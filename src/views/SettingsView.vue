<template>
  <session-checker :no-session-error="true" />
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
            :twitter-user-name="twitterUserName"
            :google-email="googleEmail"
            :is-new="false"
          />
        </v-form>
      </div>

      <div v-show="tab === 1">
        <v-container fluid class="ma-0 pa-1">
          <v-row>
            <v-col class="font-weight-bold mt-3">
              プロフィールにTwitterへのリンクを表示する
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="mt-1 ml-1">
                <span class="text-caption">
                  有効にすると、他ユーザーがプロフィールを参照したときに、Twitterアカウントにアクセスできるリンクボタンを表示します
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox
                v-model="allowTwitterLink"
                label="有効"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="font-weight-bold mt-3">
              セッション保持時間(分)
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="mt-1 ml-1">
                <span class="text-caption">
                  ログイン状態を保持する時間を指定します この設定は次回のログイン時から適用されます
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                v-model="keepSession"
                class="mr-5"
                :step="10"
                :min="10"
                :max="1440"
                prepend-icon="mdi-key"
                thumb-label
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="font-weight-bold mt-3">
              連携サービス
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="mt-1 ml-1">
                <span class="text-caption">
                  ログインに使用できる連携サービスを変更できます。
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-container fluid class="pa-0 ml-2 mr-0 mt-0 mb-0">
                <v-row>
                  <v-col cols="12" sm="3" md="2" lg="1" xl="1">
                    Twitter:
                  </v-col>
                  <v-col cols="12" sm="9" md="8" lg="11" xl="11">
                    <span v-if="twitterUserName">
                      <span class="no-break">連携済み(@<span v-text="twitterUserName"></span>)</span>
                      <v-btn flat @click="openRemoveServiceDialog('twitter')" style="color: red;">
                        解除する
                      </v-btn>
                    </span>
                    <span v-else>
                      未連携
                      <v-btn flat @click="addServiceDialog = true" style="color: green;">
                        連携する
                      </v-btn>
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="3" md="2" lg="1" xl="1">
                    Google:
                  </v-col>
                  <v-col cols="12" sm="9" md="8" lg="11" xl="11">
                    <span v-if="googleEmail">
                      <span class="no-break">連携済み(<span v-text="googleEmail"></span>)</span>
                      <v-btn flat @click="openRemoveServiceDialog('google')" style="color: red;">
                        解除する
                      </v-btn>
                    </span>
                    <span v-else>
                      未連携
                      <v-btn flat @click="addServiceDialog = true" style="color: green;">
                        連携する
                      </v-btn>
                    </span>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="font-weight-bold mt-3">
              アカウントの削除
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn flat color="red" width="100%" @click="openDel">
                このアカウントを削除する
              </v-btn>
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

  <simple-dialog
    v-model="deleteDialog"
    title="アカウントの削除"
    @submit="commitDel"
  >
    <span>
      アカウントの削除を確定させるには削除コード'<span v-text="receivedDelcode"></span>'を入力してください
    </span>
    <br/>
    <v-text-field class="mt-5" v-model="delcode" label="削除コード" />
    <br/>
  </simple-dialog>

<simple-dialog v-model="addServiceDialog" title="サービス連携" :show-submit-button="false" >
  <login-component :is-update="true" :disable-twitter="!!twitterUserName" :disable-google="!!googleEmail" />
</simple-dialog>

<simple-dialog
  v-model="removeServiceDialog"
  title="サービス連携の解除"
  :text="`本当に'${removeServiceTarget ? LoginServiceTypeNames[removeServiceTarget] : ''}'との連携を解除しますか？`"
  @submit="removeService"
/>

<simple-dialog
  v-model="dialogAfterRemoveService"
  title="サービス連携の解除"
  text="サービス連携を解除しました。"
  append-text="連携していたサービスに本アプリの情報が残っている可能性があります。お手数ですが該当サービスの設定より手動で削除してください。"
  :show-cancel-button="false"
  :show-top-close-button="false"
/>

<simple-dialog
  v-model="dialogAfterDeleteUser"
  title="アカウントの削除"
  text="アカウントを削除しました。"
  append-text="連携していたサービスに本アプリの情報が残っている可能性があります。お手数ですが該当サービスの設定より手動で削除してください。"
  :show-cancel-button="false"
  :show-top-close-button="false"
  @submit="goWelcome"
/>

<loading-component :is-loading="loading" :is-force="true" class="mt-5" title="ユーザー情報の取得中です..." />
<loading-component :is-loading="processing" :is-force="true" class="mt-5" title="処理中です..." />

</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import store from '@/store'
import RestApi, { LoginServiceType, LoginServiceTypeNames, toastError } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import Base64Api from '@/common/base64api'
import { useRoute } from 'vue-router'
import router from '@/router'

export default defineComponent({
  name: 'SettingsView',
  components: {
    SessionChecker,
    RegistrationComponent,
    SimpleDialog,
    LoginComponent,
    LoadingComponent
  },
  setup () {
    const toast = useToast()
    const route = useRoute()

    const tab = ref(0)
    const loading = ref(true)
    const processing = ref(false)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')
    const allowTwitterLink = ref(false)
    const keepSession = ref(120)
    const twitterUserName = ref('')
    const googleEmail = ref('')

    const deleteDialog = ref(false)
    const dialogAfterDeleteUser = ref(false)
    const addServiceDialog = ref(false)
    const removeServiceDialog = ref(false)
    const dialogAfterRemoveService = ref(false)
    const removeServiceTarget: Ref<'' | LoginServiceType> = ref('')

    const delcode = ref('')
    const receivedDelcode = ref('')

    const form = ref()

    const load = () => {
      loading.value = true
      if (route.query.tab === 'detail') {
        tab.value = 1
      }
      if (store.getters.isRegistered) {
        RestApi.getUserData(store.state.userId).then((res) => {
          dispName.value = res.data.name
          profile.value = res.data.profile
          iconUrl.value = res.data.iconUrl
          twitterUserName.value = res.data.twitterUserName || ''
          googleEmail.value = res.data.googleEmail || ''
          allowTwitterLink.value = res.data.allowTwitterLink
          keepSession.value = res.data.keepSession || 120
        }).catch((e) => toastError(e, toast)).finally(() => {
          loading.value = false
        })
      } else {
        loading.value = false
      }
    }
    onMounted(load)

    const openDel = () => {
      processing.value = true
      RestApi.deleteUser1(store.state.userId).then((r) => {
        receivedDelcode.value = r.data as string
        deleteDialog.value = true
      }).catch(e => toastError(e, toast)).finally(() => {
        processing.value = false
      })
    }

    const commitDel = () => {
      processing.value = true
      RestApi.deleteUser2(store.state.userId, delcode.value).then(() => {
        deleteDialog.value = false
        toast.success('ユーザーを削除しました')
        store.commit('initAllSession')
        dialogAfterDeleteUser.value = true
      }).catch(e => toastError(e, toast)).finally(() => {
        delcode.value = ''
        processing.value = false
      }).finally(() => {
        processing.value = false
      })
    }

    const goWelcome = () => {
      router.push('/')
    }

    const save = async () => {
      processing.value = true
      const validResult = await form.value.validate()
      if (validResult.valid) {
        const img = Base64Api.dataURLToBase64(iconUrl.value)
        RestApi.updateUser({
          name: dispName.value,
          profile: profile.value,
          iconBase64: img.base64,
          iconIsChanged: img.isChanged,
          allowTwitterLink: allowTwitterLink.value,
          keepSession: keepSession.value
        }, store.state.userId).then((res) => {
          toast.success('ユーザー設定を更新しました')
          router.push(`/home/${res.data}`)
        }).catch((e) => toastError(e, toast)).finally(() => {
          processing.value = false
        })
      } else {
        processing.value = false
      }
    }

    const openRemoveServiceDialog = (service: LoginServiceType) => {
      let cnt = 0
      cnt += twitterUserName.value ? 1 : 0
      cnt += googleEmail.value ? 1 : 0
      if (cnt > 1) {
        removeServiceDialog.value = true
        removeServiceTarget.value = service
      } else {
        toast.warning('連携サービスは最低でも一つ必要です')
      }
    }

    const removeService = () => {
      if (removeServiceTarget.value !== '') {
        processing.value = true
        RestApi.deleteService(removeServiceTarget.value).then(() => {
          toast.success('サービス連携の解除に成功しました')
          if (removeServiceTarget.value === 'twitter') {
            store.commit('initTwitter')
          } else if (removeServiceTarget.value === 'google') {
            store.commit('initGoogle')
          }
          dialogAfterRemoveService.value = true
          load()
        }).catch((e) => {
          toastError(e, toast)
        }).finally(() => {
          processing.value = false
        })
      }
    }

    return {
      LoginServiceTypeNames,
      tab,
      loading,
      processing,
      twitterUserName,
      googleEmail,
      dispName,
      profile,
      iconUrl,
      allowTwitterLink,
      keepSession,
      deleteDialog,
      addServiceDialog,
      removeServiceDialog,
      dialogAfterDeleteUser,
      removeServiceTarget,
      dialogAfterRemoveService,
      delcode,
      receivedDelcode,
      form,
      openDel,
      commitDel,
      goWelcome,
      save,
      openRemoveServiceDialog,
      removeService
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
