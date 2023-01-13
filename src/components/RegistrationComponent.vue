<template>
  <v-container flat>
    <v-row>
      <v-col class="d-flex align-center">
        <v-card flat class="ma-2">
          <v-avatar>
            <v-img :src="twitterIconUrl"/>
          </v-avatar>
        </v-card>
        <div class="ma-2"><span class="font-weight-bold" v-text="twitterName" /></div>
        <div class="ma-2"><span v-text="`@${twitterUserName}`" /></div>
      </v-col>
    </v-row>
    <v-row>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" sm="7" md="8" lg="9" xl="9">
        <image-selector
          label="アイコン画像を選択してください"
          :aspect-ratio="(1 / 1)"
          @update-cropped-url="$emit('update:iconUrl', $event)"
        />
      </v-col>
      <v-col cols="6" sm="5" md="4" lg="3" xl="3">
        <v-avatar v-if="iconUrl === ''" size="100%" class="dahed-box">
          <v-card flat style="aspect-ratio: 1;width: 100%;" class="d-flex align-center justify-center">
            <div>
              画像を選択するとここに表示されます
            </div>
          </v-card>
        </v-avatar>
        <v-avatar v-else size="100%">
          <v-img style="border: 1px solid" height="100%" :src="getImgSource(iconUrl)" />
        </v-avatar>
      </v-col>
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
import { getImgSource } from '@/common/restapi'
import SimpleDialog from '@/components/SimpleDialog.vue'
import ImageSelector from '@/components/ImageSelector.vue'

export default defineComponent({
  name: 'RegistrationComponent',

  components: {
    SimpleDialog,
    ImageSelector
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
    },
    twitterIconUrl: {
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
      getImgSource,
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
