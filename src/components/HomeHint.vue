<!-- レビュー作成・編集のhintを表示 -->

<template>
  <hint-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :page="page"
    @update:page="$emit('update:page', $event)"
    @close="$emit('close')"
    :enable-next="enableNext"
    :enable-prev="enablePrev"
  >
    <template v-slot:default="{ close }">

      <!-- welcome -->
      <hint-card v-if="welcomeShow" :title="title" sub-title="くどくどTierへようこそ" @close="close" :show-close="welcomeClose">
        <div class="d-flex justify-center" style="width: 100%;">
          <div class="pa-1 image-container">
            <v-img src="/img/icons/android-chrome-512x512.png" width="20%" min-width="100px"></v-img>
          </div>
        </div>
        <div class="pa-1 mt-5 mb-5">
          くどくどTierで細かいレビューを交えたグラフィカルなTierを作成しましょう。<br />
        </div>
        <div style="width: 100%;">
          <v-container>
            <v-row>
              <v-col cols="12" sm="8" md="6" lg="5" xl="4">
                <v-img src="/hint/app/pivot-tier.png"></v-img>
              </v-col>
              <v-col cols="12" sm="8" md="6" lg="5" xl="5">
                <v-img src="/hint/app/review-card.png"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </hint-card>

      <!-- tier -->
      <hint-card v-if="systemShow" :title="title" sub-title="Tier作成の流れ（1/2）" @close="close" :show-close="systemClose">
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="10" xl="8">
              <v-img src="/hint/app/relations-1.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              ものごとを評価ごとに段組みで並べたTierを作成します。<br />
              Tierを作成する際には<span class="font-weight-bold">評価基準を設定します。</span><br />
            </v-col>
          </v-row>
        </v-container>
      </hint-card>

      <!-- review -->
      <hint-card v-if="systemShow" :title="title" sub-title="Tier作成の流れ（2/2）" @close="close" :show-close="systemClose">
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="10" xl="8">
                <v-img src="/hint/app/relations-2.jpg"></v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                次にTierに紐づいたレビューを作成します。<br />
                レビューでは<span class="font-weight-bold">Tierで設定した評価基準に従って評価点を設定します。</span><br />
              </v-col>
            </v-row>
          </v-container>

      </hint-card>

      <!-- goTier -->
      <hint-card v-if="tierShow" :title="title" sub-title="Tierを作ってみましょう" @close="close">
        <template v-slot:image>
          <video src="/hint/app/create-tier.mp4" class="width" autoplay muted loop playsinline></video>
        </template>
        <template v-slot:text>
          まずはTierを作成しましょう。<br />
          Tierを作成するには以下の手順で操作してください。<br />
          <br />
          <span class="font-weight-bold">①メニューボタンを押してください</span><br />
          <br />
          <span class="font-weight-bold">②「Tierの追加」を押してください</span><br />
          <br />
        </template>
      </hint-card>

<!-- goReview -->
<hint-card v-if="reviewShow" :title="title" sub-title="レビューを作ってみましょう" @close="close">
  <template v-slot:image>
    <video src="/hint/app/create-review.mp4" class="width" autoplay muted loop playsinline></video>
  </template>
  <template v-slot:text>
    次にレビューを作成しましょう。<br />
    レビューを作成するには以下の手順で操作してください。<br />
    <br />
    <span class="font-weight-bold">①メニューボタンを押してください</span><br />
    <br />
    <span class="font-weight-bold">②「レビューの追加」を押してください</span><br />
    <br />
    <span class="font-weight-bold">②レビューを作成したいTierを選んでください</span><br />
    <br />
  </template>
</hint-card>

<!-- share -->
<hint-card v-if="shareShow" :title="title" sub-title="投稿をシェアしましょう" @close="close">
  <template v-slot:image>
    <v-img src="/hint/app/share.jpg" />
  </template>
  <template v-slot:text>
    これにてチュートリアルは完了です。<br /><br/>
    最後に、Tierやレビューの上部にある
    <v-btn class="text-no-transform text-caption pa-2" color="#00acee" style="color: white;">
      <v-icon>mdi-twitter</v-icon>ツイートする
    </v-btn>
    を押して投稿をシェアしてみましょう。<br />
  </template>
</hint-card>

    </template>
  </hint-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import HintDialog from '@/components/HintDialog.vue'
import HintCard from '@/components/HintCard.vue'
import { reviewValidation, sectionValidation } from '@/common/review'
import { HintState } from '@/common/page'

export default defineComponent({
  name: 'ReviewSettingsHint',
  components: {
    HintDialog,
    HintCard
  },
  props: {
    /** ダイアログが開いてる状態かどうか */
    modelValue: {
      type: Boolean,
      required: true
    },
    /** ページ番号 */
    page: {
      type: Number,
      required: true
    },
    /** 初期ページ番号 */
    title: {
      type: String,
      default: 'くどくどTierの使い方'
    },
    /** Tierの説明を読み切るまで閉じることができない */
    forceType: {
      type: String as PropType<HintState>
    }
  },
  emits: {
    /**
     * ダイアログの開閉操作が行われた際のイベント
     * @param v ダイアログの状態
     */
    'update:model-value': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: boolean) => true,
    /**
     * ページが変化した際のイベント
     * @param v ページ番号
     */
    'update:page': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: number) => true,
    /** 閉じるボタンを押した際のイベント */
    close: () => true
  },
  setup (props) {
    const enablePrev = computed(() => props.page !== 0)
    const enableNext = computed(() => {
      if (props.forceType === 'tier') {
        return props.page !== 1
      } else if (props.forceType === 'review') {
        return false
      } else if (props.forceType === 'share') {
        return false
      } else {
        return props.page !== 5
      }
    })
    return {
      dummyPage: ref<number | undefined>(undefined),
      sectionValidation,
      reviewValidation,
      welcomeClose: computed(() => true),
      welcomeShow: computed(() => props.forceType !== 'review' && props.forceType !== 'share'),
      systemClose: computed(() => true),
      systemShow: computed(() => !props.forceType),
      tierShow: computed(() => props.forceType !== 'review' && props.forceType !== 'share'),
      reviewShow: computed(() => props.forceType !== 'tier' && props.forceType !== 'share'),
      shareShow: computed(() => props.forceType !== 'review' && props.forceType !== 'tier'),
      enablePrev,
      enableNext
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.outlined {
  border: 1px solid gray;
}

video.width {
  max-width: 100%;
}

.image-container {
  display: inline-block;
  width: 20%;
  min-width: 100px;
}
</style>
