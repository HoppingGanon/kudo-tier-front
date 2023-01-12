<template>
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
        <v-text-field :model-value="dispName" @update:model-value="$emit('update:dispName', $event)" label="表示名" :rules="[requiredValidation, nameValidation]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea :model-value="profile" @update:model-value="$emit('update:profile', $event)" label="プロフィール" multi-line height="120px" :rules="[profValidation]" />
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
          <v-checkbox :model-value="isCheckedTerms" @update:model-value="$emit('update:isCheckedTerms', $event)" label="利用規約に同意します" :rules="[checkedValidation]" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <simple-dialog v-model="iniDialog" title="ユーザー登録の方法" :show-submit-button="false">
    <span>
      ユーザー登録は、表示名を設定するだけで完了します。<br />
      一度登録すると、次回以降はTwitter認証のみでログイン可能です。
    </span>
  </simple-dialog>

  <simple-dialog
    v-model="termDialog"
    title="利用規約"
    :show-submit-button="false"
    :fullscreen="$vuetify.display.smAndDown"
    :width="$vuetify.display.smAndDown ? '100%' : '800px'"
  >
    <iframe :src="termsOfService" style="width: 100%; height: 60vh"></iframe>
  </simple-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import rules from '@/common/rules'
import SimpleDialog from '@/components/SimpleDialog.vue'

export default defineComponent({
  name: 'RegistrationComponent',

  components: {
    SimpleDialog
  },
  props: {
    twitterName: {
      type: String,
      required: true
    },
    twitterUserName: {
      type: String,
      required: true
    },
    dispName: {
      type: String,
      required: true
    },
    profile: {
      type: String,
      required: true
    },
    isCheckedTerms: {
      type: Boolean,
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    }
  },
  emits: {
    'update:dispName': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    'update:profile': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    'update:isCheckedTerms': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true,
    'update:iconUrl': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true
  },
  setup () {
    const iniDialog = ref(true)
    const termDialog = ref(false)
    const termsOfService = ref(`${process.env.VUE_APP_BASE_URI}/terms/service.html`)
    const requiredValidation = rules.required()
    const nameValidation = rules.maxLen(64)
    const profValidation = rules.maxLen(200)
    const checkedValidation = (v: boolean) => v || '登録するには利用規約に同意する必要があります'

    return {
      iniDialog,
      termsOfService,
      termDialog,
      requiredValidation,
      nameValidation,
      profValidation,
      checkedValidation
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
