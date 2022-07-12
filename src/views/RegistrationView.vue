<template>
  <div>
    <v-card width="540px" min-height="320px" class="center">

    <!-- セッション有効期限をチェックする -->
    <session-checker :is-going="true" />

      <v-card-title>
        ユーザー登録
      </v-card-title>

      <v-form ref="form">
        <v-container flat>
          <v-row class="ma-3">
            <v-card flat class="ma-3">
              <v-avatar>
                <v-img :src="iconUrl"/>
              </v-avatar>
            </v-card>
            <v-card flat>
              <v-row>
                <v-col>
                  <b>{{ twitterName }}</b>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  @{{ twitterUserName }}
                </v-col>
              </v-row>
            </v-card>
          </v-row>
          <v-row>
            <v-divider class="ma-3" />
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="dispName" label="表示名" :rules="[requiredValidation, nameValidation]" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea v-model="profile" label="プロフィール" multi-line height="120px" :rules="[profValidation]" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="body-1" flat @click="() => { termDialog = true }">
                利用規約を読む
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="body-1" flat>
                <v-checkbox v-model="isCheckedTerms" label="利用規約に同意します" :rules="[checkedValidation]" />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions class="justify-end">
        <v-btn>
          今はしない
        </v-btn>
        <v-btn @click="submit">
          登録
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="iniDialog">
      <v-card width="540px" min-height="200px">
        <v-card-actions class="justify-end">
          <v-btn @click="() => { iniDialog = false }">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title>
          ユーザー登録の方法
        </v-card-title>
        <v-card-text class="ma-5">
          <span>
            ユーザー登録は、表示名を設定するだけで完了します。<br />
            一度登録すると、次回以降はTwitter認証のみでログイン可能です。
          </span>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="termDialog">
      <v-btn color="primary" @click="() => { termDialog = false }">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <v-card width="540px" min-height="200px">
        <iframe :src="termsOfService" height="480px" width="100%"></iframe>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import store from '@/store'
import rules from '@/common/rules'
import restApi, { } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import SessionChecker from '@/components/SessionChecker.vue'

export default defineComponent({
  name: 'RegistrationView',

  components: {
    SessionChecker
  },
  setup () {
    const twitterName = computed(() => store.state.twitterName)
    const twitterUserName = computed(() => store.state.twitterUserName)
    const dispName = ref('')
    const profile = ref('')
    const isCheckedTerms = ref(false)
    const iconUrl = computed(() => store.state.iconUrl)
    const iniDialog = ref(true)
    const termDialog = ref(false)
    const termsOfService = ref(`${process.env.VUE_APP_BASE_URI}/terms/service.html`)
    const form = ref()
    const requiredValidation = rules.required()
    const nameValidation = rules.maxLen(64)
    const profValidation = rules.maxLen(200)
    const checkedValidation = (v: boolean) => v || '登録するには利用規約に同意する必要があります'

    const toast = useToast()

    const submit = async () => {
      const validResult = await form.value.validate()
      if (validResult.valid) {
        restApi.createUser({
          name: dispName.value,
          profile: profile.value,
          accept: isCheckedTerms.value
        }).then(() => {
          toast.success('登録しました')
          router.push('/home')
        }).catch((err) => {
          toast.error('登録に失敗しました')
          console.log(err)
        })
      } else {
        toast.warning('入力に誤りがあります')
      }
    }

    return {
      twitterName,
      twitterUserName,
      dispName,
      profile,
      isCheckedTerms,
      iconUrl,
      iniDialog,
      termsOfService,
      termDialog,
      form,
      requiredValidation,
      nameValidation,
      profValidation,
      checkedValidation,
      submit
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
