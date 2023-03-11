<!-- ユーザー登録のコンポーネント -->

<template>
  <v-container flat>
    <v-row v-show="isNew">
      <v-col>
        <table>
          <tr v-if="twitterUserName">
            <td>
              Twitterでログイン中:
            </td>
            <td>
              <span>
                (<span v-text="twitterUserName"></span>)
              </span>
            </td>
          </tr>
          <tr v-if="googleEmail">
            <td>
              Googleでログイン中:
            </td>
            <td>
              <span>
                <span v-text="googleEmail"></span>
              </span>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" sm="6" md="5" lg="4" xl="3">
        <image-selector
          label="アイコン画像を選択してください"
          :cropped-url="iconUrl"
          :aspect-ratio="(1 / 1)"
          @update-cropped-url="$emit('update:iconUrl', $event)"
          img-max-height="320px"
        >
        </image-selector>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          :model-value="dispName"
          @update:model-value="$emit('update:dispName', $event)"
          label="表示名"
          :rules="[requiredValidation, nameValidation]"
          :hint="`ユーザーの名前を設定してください(最大${userValidation.nameLenMax}文字)`"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          :model-value="profile"
          @update:model-value="$emit('update:profile', $event)"
          label="プロフィール"
          multi-line
          height="120px"
          :rules="[profValidation]"
          :hint="`自己紹介文を設定してください(最大${userValidation.profileLenMax}文字)`"
        />
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
import { computed, defineComponent, ref } from 'vue'
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
    /** ツイッター表示名 */
    twitterUserName: {
      type: String,
      default: ''
    },
    /** Googleのメインメールアドレス */
    googleEmail: {
      type: String,
      default: ''
    },
    /** 表示名 */
    dispName: {
      type: String,
      required: true
    },
    /** プロフィール文 */
    profile: {
      type: String,
      required: true
    },
    /** 規約への同意 */
    isCheckedTerms: {
      type: Boolean
    },
    /** アイコンのURL */
    iconUrl: {
      type: String,
      required: true
    },
    /** 新規作成かどうか */
    isNew: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    /** 表示名の更新の際のイベント */
    'update:dispName': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    /** プロフィール文の更新の際のイベント */
    'update:profile': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    /** 規約への同意更新の際のイベント */
    'update:isCheckedTerms': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true,
    /** アイコンURL更新の際のイベント */
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

    const imgSource = computed(() => getImgSource(props.iconUrl))

    return {
      userValidation,
      imgSource,
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
