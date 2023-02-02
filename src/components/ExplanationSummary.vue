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
          TierReviewsはスマホやパソコンからレビューを投稿して、その情報をTierとして共有できる無料のサービスです。
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card class="pa-2"><v-img src="@/assets/welcome/tierTable.png" max-height="480px"/></v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <p>
          <span class="text-h6 font-weight-bold">Tierとは？</span>
        </p>
        <br />
        <p>
          物事の強さや大きさを比較して、その大小を段階別に表にしたものを(狭義の)Tierといいます。
        </p>
        <br />
        <br />
        <p>
          <span class="text-h6 font-weight-bold">レビューがTierに</span>
        </p>
        <br />
        <p>
          TierReviewsでは詳細なレビューを横断的なTierとして表現することができます。
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
          TierReviewsは数値化された情報をグラフィカルなインターフェースで共有できます。<br />
          文章だけでは表せない評価や画像だけでは伝えられない情報を表現してみましょう。
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-5 flex-row-reverse">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card class="pa-2"><v-img src="@/assets/welcome/reviewChart.png" max-height="480px" /></v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <p>
          <span class="text-h6 font-weight-bold">グラフィカルなレビュー</span>
        </p>
        <br />
        <p>
          レビューは自分で設定した採点基準で評価することができ、その点数をレーダーチャートで表示できます。
        </p>
        <br />
        <br />
        <p>
          <span class="text-h6 font-weight-bold">多様な採点方法</span>
        </p>
        <br />
        <p>
          採点方法はランク方式や、点数方式、スター数方式などがあり自由度の高い採点が可能です。
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
          TierReviewsで作成したTierは他のサービスにシェアできます。<br />
          投稿はTierReviewsに登録していない人でもシェア・閲覧ができるので、より多くの人に投稿を見てもらいましょう。
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <v-card class="pa-2"><v-img src="@/assets/welcome/tierTable.png" max-height="480px"/></v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="6">
        <p>
          <span class="text-h6 font-weight-bold">SNSへの共有</span>
        </p>
        <br />
        <p>
          Tierやレビューのシェアボタンから簡単にSNSに共有できます。
        </p>
        <br />
        <br />
        <p>
          <span class="text-h6 font-weight-bold">外部サイトへの埋め込み</span>
        </p>
        <br />
        <p>
          ホームページやブログ向けに、HTML埋め込みタグや画像を生成できます(beta版機能)。
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
          <span class="text-h5 font-weight-bold">TierReviewsをはじめよう</span>
        </p>
        <br />
        <p>
          TierReviewsは、Twitterからログインします。<br />
          Twitterのアカウントをお持ちであれば誰でも無料でTierやレビューが投稿できます。
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExplanationSummary',
  components: {},
  setup () {
    return {
      goLogin: () => router.push('/login')
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
