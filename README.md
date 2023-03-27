# kudo-tier-front （くどくどTierフロントエンド）
<a href="https://kd-tier.hopgn.com">
  <img src="doc/img/logo.png" width="20%"></img>
</a>

このリポジトリは、WEBサイト[くどくどTier](https://kd-tier.hopgn.com)のフロントエンドのソースコードを公開するリポジトリです。

くどくどTierは、以下のような細かいレビューを交えたグラフィカルなTierを作成・管理・配信できるWEBアプリです。

くどくどTierバックエンドについては、[kudo-tier-back](https://github.com/HoppingGanon/kudo-tier-back)を参照してください。

<img src="doc/img/pivot-tier.png" width="40%" style="display: inline-block;"></img>
<img src="doc/img/review-card.png" width="40%" style="display: inline-block;"></img>

## くどくどTier紹介
[![Youtube くどくどTier紹介](doc/img/video.jpg)](https://www.youtube.com/watch?v=Ov0G86XN-tc)

## 目次
- [kudo-tier-front （くどくどTierフロントエンド）](#kudo-tier-front-くどくどtierフロントエンド)
  - [くどくどTier紹介](#くどくどtier紹介)
  - [目次](#目次)
  - [プロジェクト構成](#プロジェクト構成)
    - [ネットワーク図](#ネットワーク図)
    - [開発環境](#開発環境)
    - [その他のサービス](#その他のサービス)
    - [WebHookを利用したデプロイ](#webhookを利用したデプロイ)
    - [certbotによる証明書の更新](#certbotによる証明書の更新)
    - [データベースバックアップ](#データベースバックアップ)
  - [このプロジェクトの目的と要件](#このプロジェクトの目的と要件)
  - [設計書について](#設計書について)
    - [ルーティング設計](#ルーティング設計)
    - [コンポーネント設計](#コンポーネント設計)

## プロジェクト構成
くどくどTierプロジェクトの主な構成です。

* サーバー
  * プラットフォーム
    * AWS EC2 t2.micro
  * OS
    * Amazon Linux
  * メモリ
    * 1GB + Swap 1.8GB
  * ストレージ
    * 8GB
    * 20GB (Amazon EBS)
* 仮想化
  * Docker
* リバースプロキシ
  * nginx
* フロントエンド
  * アプリケーションプラットフォーム
    * Node.js
  * フレームワーク
    * Vue.js
  * UIフレームワーク
    * Vuetify
  * ビルド環境
    * Vue Cli
  * 言語
    * TypeScript
* バックエンド
  * WEBフレームワーク
    * Echo
  * ORMライブラリ
    * GORM
* バージョン管理システム
  * Git
* データベース
  * プラットフォーム
    * Amazon RDS db.t3.micro
  * ストレージ
    * 20GB
  * 管理システム
    * PostgreSQL

基本的な環境は`tier-reviews-server`リポジトリにDockerfileで纏めてあるので、ファイルを配置して`docker-compose up`コマンドを実行するだけでサーバーが機能します。

### ネットワーク図

![](doc/img/AWS.png)

### 開発環境
* エディタ
  * VS Code 
* フロントエンド
  * パッケージ管理システム
    * npm
  * ビルド環境
    * Vue Cli
* バックエンド
  * ホットリロードプラグイン
    * Air

### その他のサービス
* ドメイン
  * お名前.com
* TLS証明書
  * Let's Encrypt（更新にはcertbotを使用）

### WebHookを利用したデプロイ
GitHubの`tier-reviews`リポジトリにてpush（とプルリクエストによるマージ）を検知すると`Deployment Server`にWebhookが送信されます。Webhookのペイロードと証明書を検証し、`main`ブランチの変更が認められた場合は、以下の手順でデプロイします。

1. フロントエンドのサーバー停止
2. バックエンドのサーバー停止
3. フロントエンドのソースコードをビルド
4. バックエンドのソースコードをビルド
5. バックエンドのサーバーを起動
6. フロントエンドのサーバーを起動

また、デプロイを受理すると`202 Accepted`を返しますが、デプロイ自体は数分間続きます。その間はくどくどTierの利用はできず、プロキシが`502 Bad Gateway`を返します。

### certbotによる証明書の更新
証明書は`certbot`によって更新されます。
更新チェックのタイミングは以下の通りです。
* dockerコンテナが起動してから2分後
* 毎日3:00（UTC 18:00）

### データベースバックアップ
AmazonRDSにより自動バックアップ（14日間保持）
* 毎日04:00 (UTC 19:00)

また、定期的にAmazon S3へスナップショットをエクスポートする。

## このプロジェクトの目的と要件
詳しくは以下のページを参照してください。

> [このプロジェクトの目的と要件](doc/about/about.md)

## 設計書について
### ルーティング設計
詳しくは以下のページを参照してください。

> [くどくどTier フロントエンド ルーティング設計書](doc/route/route.md)

### コンポーネント設計
詳しくは以下のページを参照してください。

> [くどくどTier フロントエンド コンポーネント設計書](https://hoppingganon.github.io/kudo-tier-front/components/index.html)


