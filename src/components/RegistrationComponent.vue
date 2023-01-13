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
    <v-row v-if="isNew">
      <v-col>
        <term-of-servise />
      </v-col>
    </v-row>
    <v-row v-if="isNew">
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import rules from '@/common/rules'
import { getImgSource } from '@/common/restapi'
import SimpleDialog from '@/components/SimpleDialog.vue'
import TermOfServise from '@/components/TermOfServise.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import { userValidation } from '@/common/review'

export default defineComponent({
  name: 'RegistrationComponent',

  components: {
    SimpleDialog,
    TermOfServise,
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
      type: Boolean
    },
    iconUrl: {
      type: String,
      required: true
    },
    twitterIconUrl: {
      type: String,
      required: true
    },
    isNew: {
      type: Boolean,
      default: false
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
  setup (props) {
    const iniDialog = ref(props.isNew)
    const termDialog = ref(false)
    const requiredValidation = rules.required()
    const nameValidation = rules.maxLen(userValidation.nameLenMax)
    const profValidation = rules.maxLen(userValidation.profileLenMax)
    const checkedValidation = (v: boolean) => v || '登録するには利用規約に同意する必要があります'

    return {
      getImgSource,
      iniDialog,
      termDialog,
      requiredValidation,
      nameValidation,
      profValidation,
      checkedValidation
    }
  }
})
</script>
