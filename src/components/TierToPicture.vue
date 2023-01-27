<template>
  <v-container>
    <v-row>
      <v-col>
        Tier表を画像として保存します
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" xl="6">
        <v-container fluid class="ma-0 pa-0">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
              <v-select
                :model-value="theme"
                @update:model-value="$emit('update:theme', $event)"
                label="テーマカラー"
                :items="tierThemeList"
                item-title="text"
                item-value="value"
              />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
              <point-type-selector
                :model-value="pointType"
                @update="$emit('update:pointType', $event)"
                :always="true"
                :is-select="true"
                :exclude-unlimited="true"
              />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
              <v-select
                :model-value="textSize"
                @update:model-value="$emit('update:textSize', $event)"
                label="評価情報サイズ"
                :items="textSizeList"
                item-title="text"
                item-value="value"
              />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
              <v-select
                :model-value="iconSize"
                @update:model-value="$emit('update:iconSize', $event)"
                label="アイコンサイズ"
                :items="iconSizeList"
                item-title="text"
                item-value="value"
              />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="6" xl="6">
              <v-select
                v-model="imageFormat"
                label="画像の保存形式"
                :items="ImageFormatList"
                item-title="text"
                item-value="value"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="ma-3 text-caption">
                この機能は特殊なレンダリングエンジンを使用して画像生成をしているため、ブラウザの種類によっては正しく出力されません<br/>
                正しく出力されない場合はテーマを変更して出力してください
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="primary" @click="save">
                生成
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" xl="6">
        【サンプル】
        <v-card flat id="tier-ranking-pivot" width="720px">
          <tier-ranking-pivot
            :tier-pivot-list="tierPivotList"
            :pointType="pointType"
            :params="params"
            :theme="theme"
            :icon-size="iconSize"
            :text-size="textSize"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { toJpeg, toPng } from 'html-to-image'
import { saveAs } from 'file-saver'
import TierRankingPivot from '@/components/TierRankingPivot.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import { iconSizeList, ImageFileFormat, ImageFormatList, textSizeList, tierThemeList } from '@/common/page'
import { PointDisplaySize, RankingTheme, ReviewFactorParam, ReviewPointType, TierPivotInfomation } from '@/common/review'

export default defineComponent({
  name: 'TierToPicture',
  components: {
    TierRankingPivot,
    PointTypeSelector
  },
  props: {
    tierPivotList: {
      type: Array as PropType<TierPivotInfomation[][]>,
      reuired: true,
      default: () => [] as TierPivotInfomation[][]
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    },
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      reuired: true,
      default: () => [] as ReviewFactorParam[]
    },
    theme: {
      type: String as PropType<RankingTheme>,
      default: 'light'
    },
    iconSize: {
      type: String,
      default: '64px'
    },
    textSize: {
      type: String as PropType<PointDisplaySize>,
      default: 'large2'
    }
  },
  emits: {
    'update:theme': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: RankingTheme) => true,
    'update:pointType': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true,
    'update:iconSize': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true,
    'update:textSize': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: string) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const save = () => {
      const tierRankingPivot = document.getElementById('tier-ranking-pivot')
      if (tierRankingPivot) {
        if (imageFormat.value === 'jpg') {
          toJpeg(tierRankingPivot).then((dataurl) => {
            saveAs(dataurl, 'tier表.jpg')
          })
        } else if (imageFormat.value === 'png') {
          toPng(tierRankingPivot).then((dataurl) => {
            saveAs(dataurl, 'tier表.png')
          })
        }
      }
    }

    const imageFormat = ref('jpg' as ImageFileFormat)

    return {
      iconSizeList,
      tierThemeList,
      textSizeList,
      ImageFormatList,
      save,
      imageFormat
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
