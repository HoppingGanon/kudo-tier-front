<template>
  <v-container>
    <!-- ここから概要 -->

    <v-row>
      <v-col style="text-align: center;">
        <p>
          <span class="text-h5 font-weight-bold">独断と偏見のTierを作ろう</span>
        </p>
        <br />
        <p>
          {{ appName }}はスマホやパソコンからレビューを投稿して、その情報をTierとして共有できる無料のサービスです。
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card class="pa-2" flat><v-img src="@/assets/welcome/tierTable.png" max-height="480px"/></v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <p>
          <span class="text-h6 font-weight-bold">Tier形式のレビュー</span>
        </p>
        <br />
        <p>
          格闘ゲームや愉快なパーティゲームでよく見るアレに長々とレビューをつけることができます。
        </p>
        <br />
        <br />
        <p>
          <span class="text-h6 font-weight-bold">すぐ・簡単に使える</span>
        </p>
        <br />
        <p>
          TwitterやGoogleのアカウントを使用して、誰でも簡単に始めることができます。
        </p>
      </v-col>
    </v-row>

    <!-- ここからレビュー -->

    <v-row>
      <v-col>
        <v-divider class="mt-5 mb-5" />
      </v-col>
    </v-row>

    <v-row>
      <v-col style="text-align: center;">
        <p>
          <span class="text-h5 font-weight-bold">マニアックなレビューを書こう</span>
        </p>
        <br />
        <p>
          {{ appName }}は数値化された情報をグラフィカルなインターフェースで共有できます。<br />
          文章だけでは表せない評価や画像だけでは伝えられない情報を表現してみましょう。
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-5 flex-row-reverse">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card class="pa-2" flat ><v-img src="@/assets/welcome/reviewChart.png" max-height="540px" /></v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <p>
          <span class="text-h6 font-weight-bold">グラフィカルな採点</span>
        </p>
        <br />
        <p>
          採点基準や表示形式を設定して、自分だけの見やすいレビューを作成しましょう。<br />
          細かい評点はレーダーチャートで表示されます。
        </p>
        <br />
        <br />
        <p>
          <span class="text-h6 font-weight-bold">くどくど説明文</span>
        </p>
        <br />
        <p>
          動画や画像付きで細かいレビューを書いてTierにしたい...<br />
          とチーズ牛丼を食べながら思った私はなんとなくこのサイトを作りました。<br />
          早口で喋る博識者の皆さん、是非ご活用ください。
        </p>
      </v-col>
    </v-row>

    <!-- ここから共有 -->

    <v-row>
      <v-col>
        <v-divider class="mt-5 mb-5" />
      </v-col>
    </v-row>

    <v-row>
      <v-col style="text-align: center;">
        <p>
          <span class="text-h5 font-weight-bold">評価をシェアしよう</span>
        </p>
        <br />
        <p>
          {{ appName }}で作成したTierは他のサービスにシェアできます。<br />
          {{ appName }}に登録していない人でもシェア・閲覧ができるので、より多くの人に投稿を見てもらいましょう。
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card class="pa-2" flat ><v-img src="@/assets/welcome/share.png" max-height="280px" class="shadow" /></v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <p>
          <span class="text-h6 font-weight-bold">SNSへの共有</span>
        </p>
        <br />
        <p>
          シェアボタンからSNSに共有できます。現状、実家のような安心感のあるTwitterのみ対応しています。
        </p>
        <br />
        <br />
        <p>
          <span class="text-h6 font-weight-bold">外部サイトへの埋め込み</span>
        </p>
        <br />
        <p>
          ホームページやブログ向けに、HTML埋め込みタグや画像を生成できます(まだbeta版機能だけどヨシ!)。
        </p>
      </v-col>
    </v-row>

    <!-- ここからはじめよう -->

    <v-row>
      <v-col>
        <v-divider class="mt-5 mb-5" />
      </v-col>
    </v-row>

    <v-row>
      <v-col style="text-align: center;">
        <p>
          <span class="text-h5 font-weight-bold">{{ appName }}をはじめよう</span>
        </p>
        <br />
        <p>
          {{ appName }}は、Twitterからログインします。<br />
          Twitterのアカウントをお持ちであれば誰でも無料でTierやレビューが投稿できます。
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent } from 'vue'
import { appName } from '@/common/names'

export default defineComponent({
  name: 'ExplanationSummary',
  components: {},
  setup () {
    return {
      goLogin: () => router.push('/login'),
      appName
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.shadow {
  filter: drop-shadow(10px 10px 1px #FFC0F0);
}

</style>
