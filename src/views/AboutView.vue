
<!-- このサイトの技術について紹介するページ -->

<template>
  <v-container class="centering-x">

    <v-row>
      <v-col class="d-flex justify-center">
        <v-card flat width="200px">
          <v-img src="@/assets/logo.png" />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="title-row">
      <v-col class="text-h5">
        {{ appName }}について
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        {{ appName }}は、開発者である<span v-text="myName"></span>が
        「一度はゼロからwebシステム作って運用してみたいな～」という欲求のために勉強もかねて作成したサイトです。
      </v-col>
    </v-row>

    <v-row class="title-row">
      <v-col class="text-h6">
        contributors
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        このサイトの作成・運営にあたってご協力いただいている皆様のお名前です。
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <table>
          <tr :style="bgStyle">
            <th>
              担当
            </th>
            <th>
              名前
            </th>
          </tr>
          <tr v-for="c, i of contributors" :key="i" :style="i % 2 == 1 ? bgStyle : ''">
            <td class="pl-4 pt-1 pb-1 pr-4">
              <span v-text="c.charge"></span>
            </td>
            <td class="pl-4 pt-1 pb-1 pr-4">
              <span v-for="n, j of c.names" :key="j" v-text="n"></span>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>

    <v-row class="title-row">
      <v-col class="text-h6 centering-x">
        サービス
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        このサイトを作成・運営にあたって利用させていただいている主なサービスです。<br/>
        ただし、下記のサービスに関わる組織・団体が当サイトを支援しているわけではございません。また、当サイトの直接の運営に関与する関係でもありません。
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <service-colmun
        subtitle="インフラストラクチャ"
        text="サーバー（EC2）、ストレージ（S3）、データベース（RDS）"
        :wide="true"
      >
        <template v-slot:image>
          <a href="https://aws.amazon.com/what-is-cloud-computing"><img src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing"></a>
        </template>
      </service-colmun>
      <service-colmun
        subtitle="開発プラットフォーム"
        text="バージョン管理"
        :wide="true"
      >
        <template v-slot:image>
          <v-img src="@/assets/external/github.png"></v-img>
        </template>
      </service-colmun>
    </v-row>

    <v-row class="title-row">
      <v-col class="text-h6 centering-x">
        技術
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        このサイトの作成・運営にあたって利用させていただいている主な技術です。<br/>
        ただし、下記の技術に関わる組織・団体が当サイトを支援しているわけではございません。また、当サイトの直接の運営に関与する関係でもありません。
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <!-- AWS-->
      <!-- 規約OK 変更禁止 link可 https://d1.awsstatic.com/legal/trademarkguidelines/trademark%20guidelines_jp.pdf -->
      <!-- https://aws.amazon.com/jp/co-marketing/ -->
      <service-colmun
        title="Docker"
        subtitle="ソフトウェアプラットフォーム"
        text="開発環境および本番環境の構築、仮想化"
      />
      <service-colmun
        title="nginx"
        subtitle="Webサーバシステム"
        text="リバースプロキシ"
      />
      <!-- 規約OK サイズ変更不可 link可 4ページ https://nodejs.org/static/documents/trademark-policy.pdf -->
      <!-- マージン指定アリ https://nodejs.org/static/documents/foundation-visual-guidelines.pdf -->
      <service-colmun
        title="Node.js"
        subtitle="アプリケーションプラットフォーム"
        text="フロントエンドアプリケーション開発および運用"
        :license="licensesFramework.node"
      />
      <service-colmun
        title="Vue.js"
        subtitle="Node.js フレームワーク"
        text="フロントエンドアプリケーション開発および運用"
      />
      <service-colmun
        title="Vuetify"
        subtitle="Vue.js UI フレームワーク"
        text="フロントエンドアプリケーションのユーザーインターフェース"
      />
      <!-- TypeScriptダメそう https://www.typescriptlang.org/branding/ -->
      <service-colmun
        title="TypeScript"
        subtitle="プログラミング言語"
        text="フロントエンドアプリケーションの開発"
      />
      <service-colmun
        title="Go"
        subtitle="プログラミング言語"
        text="バックエンドアプリケーションおよびデプロイマネージャの開発"
        :license="licensesFramework.go"
      >
      </service-colmun>
      <service-colmun
        title="Echo"
        subtitle="Go Webフレームワーク"
        text="バックエンドアプリケーションのAPI"
      />
      <service-colmun
        title="GORM"
        subtitle="Go ORMライブラリ"
        text="バックエンドアプリケーションのデータベース操作"
      />
      <service-colmun
        title="PostgreSQL"
        subtitle="データベース"
        text="情報を管理するリレーショナルデータベース"
      />
      <service-colmun
        title="Git"
        subtitle="バージョン管理システム"
        text="ソースコードのバージョン管理"
      />
    </v-row>

    <v-row class="title-row">
      <v-col class="text-h6">
        ライセンス
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        このサイトを作成するにあたって使用させていただいたパッケージ・モジュール等の一覧です。
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5 d-flex justify-center">
        フロントエンドのパッケージ
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <license-list :licenses="licensesFront" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5 d-flex justify-center">
        フロントエンドの開発用パッケージ
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <license-list :licenses="licensesFrontDev" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5 d-flex justify-center">
        バックエンドのモジュール
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <license-list :licenses="licensesBack" />
      </v-col>
    </v-row>

    <v-row class="title-row">
      <v-col class="text-h6 centering-x">
        その他素材を利用させていただいたサイト等
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-list-item>
            フリー素材ぱくたそ （<a href="https://www.pakutaso.com">https://www.pakutaso.com</a>）
          </v-list-item>
          <v-list-item>
            pthotoAC （<a href="https://www.photo-ac.com/">https://www.photo-ac.com/</a>）
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Names, { myName, appName } from '@/common/names'
import vuetify from '@/plugins/vuetify'
import LicenseList from '@/components/LicenseList.vue'
import ServiceColmun from '@/components/ServiceColmun.vue'
import licensesFront from '@/assets/licenses-front.json'
import licensesFrontDev from '@/assets/licenses-front-dev.json'
import licensesBack from '@/assets/licenses-back.json'
import licensesFramework from '@/assets/licenses-framework.json'
import { LicenseData } from '@/common/page'

export default defineComponent({
  name: 'AboutView',
  components: {
    LicenseList,
    ServiceColmun
  },
  setup () {
    const bgStyle = `
background-color: ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};
border: 10px solid ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};
`

    return {
      appName,
      myName,
      contributors: Names.contributors,
      bgStyle,
      licensesFront: licensesFront as LicenseData[],
      licensesBack: licensesBack as LicenseData[],
      licensesFrontDev: licensesFrontDev as LicenseData[],
      licensesFramework
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.title-row {
  margin-top: 48px;
}

.centering-x {
  text-align: center;
}
.centering-y {
  margin-top: auto;
  margin-bottom: auto;
}
.image-block {
  width: 100%;
  height: 50px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.image-block-go {
  width: 100%;
  height: 160px;
}
</style>
