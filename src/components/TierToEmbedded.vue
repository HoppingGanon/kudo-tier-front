<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="9" lg="9" xl="9">
        <v-text-field
          v-model="width"
          label="幅"
          type="number"
          :rules="widthRules"
        />
      </v-col>
      <v-col cols="10" sm="6" md="3" lg="3" xl="3">
        <v-select
          v-model="embeddedWidthType"
          label="幅の調整単位"
          :items="embeddedLenTypeList"
          item-title="text"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="12" md="9" lg="9" xl="9">
        <v-text-field
          v-model="height"
          label="高さ"
          type="number"
          :rules="heightRules"
        />
      </v-col>
      <v-col cols="10" sm="6" md="3" lg="3" xl="3">
        <v-select
          v-model="embeddedHeightType"
          label="高さの調整単位"
          :items="embeddedLenTypeList"
          item-title="text"
          item-value="value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-select
          v-model="theme"
          label="テーマカラー"
          :items="tierThemeList"
          item-title="text"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-select
          v-model="textSize"
          label="評価情報サイズ"
          :items="textSizeList"
          item-title="text"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-select
          v-model="iconSize"
          label="アイコンサイズ"
          :items="iconSizeListUndef"
          item-title="text"
          item-value="value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider class="mt-3 mb-3" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>
          下の「HTML埋め込みタグ」をコピーして、使用したいサイトのHTMLにペーストしてください<br />
          埋め込んだTier表は、Tierの情報が変更されると埋め込み先のサイトでも見た目が変更されます
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          ref="tagCreator"
          label="HTML埋め込みタグ"
          :readonly="true"
          :model-value="embeddedTag"
          @update:model-value="() => {}"
          :error-messages="errorText"
          :messages="successText"
        >
          <template v-if="false" v-slot:append>
            <v-btn type="button" @click="copy" icon flat>
              <v-icon>
                mdi-clipboard-text
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:message="{ message }">
            <v-icon class="success-style">mdi-check</v-icon><span v-text="message" class="text-caption success-style"></span>
          </template>
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        【サンプルプレビュー】
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-2" width="100%" height="720px">
          <iframe id="previewtierframe" :src="`${embeddedlink}?${params}`" :width="widthStr" :height="heightStr">
            <a>
              Tierを見る
            </a>
          </iframe>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { SelectObject, iconSizeList, textSizeList, tierThemeList } from '@/common/page'
import { IconSize, PointDisplaySize, RankingTheme } from '@/common/review'
import Rules from '@/common/rules'
import { computed, defineComponent, Ref, ref } from 'vue'
import useClipboard from 'vue-clipboard3'

type EmbeddedLenType = 'auto' | 'px'
const embeddedLenTypeList = [
  {
    text: '自動調整(%)',
    value: 'auto'
  },
  {
    text: '固定値(px)',
    value: 'px'
  }
] as SelectObject<EmbeddedLenType>[]

export default defineComponent({
  name: 'TierToEmbedded',
  components: {},
  props: {
    tierId: {
      type: String,
      required: true
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props) {
    const width = ref('100')
    const embeddedWidthType = ref('auto' as EmbeddedLenType)
    const height = ref('480')
    const embeddedHeightType = ref('px' as EmbeddedLenType)

    const iconSize: Ref<IconSize | 'auto'> = ref('auto')
    const theme: Ref<RankingTheme> = ref('light')
    const textSize: Ref<PointDisplaySize> = ref('large2')

    const embeddedlink = computed(() => `${process.env.VUE_APP_BASE_URI}/tier-embedded/${props.tierId}`)
    const link = computed(() => `${process.env.VUE_APP_BASE_URI}/tier/${props.tierId}`)
    const widthStr = computed(() => embeddedWidthType.value === 'auto' ? `${width.value}%` : `${width.value}px`)
    const heightStr = computed(() => embeddedHeightType.value === 'auto' ? `${height.value}%` : `${height.value}px`)
    const params = computed(() => {
      const param1 = `theme=${theme.value}`
      const param2 = `textsize=${textSize.value}`
      const param3 = `iconsize=${iconSize.value}`

      return `${param1}&${param2}${iconSize.value === 'auto' ? '' : '&' + param3}`
    })

    const embeddedTag = computed(() => {
      return `<iframe src="${embeddedlink.value}?${params.value}" width="${widthStr.value}" height="${heightStr.value}"><a href="${link.value}">Tierを見る</a></iframe>`
    })

    const errorText = ref(undefined as string | undefined)
    const successText = ref(undefined as string | undefined)

    const error = () => {
      errorText.value = 'このブラウザでは自動コピーができません 手動でタグをコピーしてください'
      successText.value = undefined
    }
    const success = () => {
      successText.value = '埋め込み用のHTMLタグをコピーしました'
      errorText.value = undefined
    }

    const rules = (v: string, type: EmbeddedLenType) => {
      if (type === 'auto') {
        return [
          Rules.isNumeric(),
          Rules.maxNum(100),
          Rules.minLen(0)
        ]
      } else {
        return [
          Rules.isNumeric(),
          Rules.minLen(0)
        ]
      }
    }
    const widthRules = computed((v) => rules(v, embeddedWidthType.value))
    const heightRules = computed((v) => rules(v, embeddedHeightType.value))

    const { toClipboard } = useClipboard({ appendToBody: true })
    const copy = () => {
      toClipboard('abc').then(() => {
        success()
      }).catch(() => {
        error()
      })
    }

    const iconSizeListUndef: SelectObject<PointDisplaySize | ''>[] = iconSizeList.filter(() => true)
    iconSizeListUndef.unshift({
      text: '自動(フレームサイズにより決定)',
      value: 'auto'
    })

    return {
      iconSizeListUndef,
      tierThemeList,
      textSizeList,
      embeddedLenTypeList,
      width,
      embeddedWidthType,
      height,
      embeddedHeightType,
      iconSize,
      theme,
      textSize,
      embeddedlink,
      params,
      widthStr,
      heightStr,
      embeddedTag,
      errorText,
      successText,
      widthRules,
      heightRules,
      copy
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
