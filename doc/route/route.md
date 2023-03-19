# ルーティング設計

|パス|クエリパラメータ|オブジェクト|セッション必須|説明|
|:-|:-|:-|:-|:-|
|/|-|WelcomeView|-|このシステムについて説明するページ|
|/home|tab|HomeView|-|ユーザーのホーム画面|
|/home/:id|tab|HomeView|-|ユーザーのホーム画面|
|/about|-|AboutView|-|このサイトの技術について紹介するページ|
|/login|-|LoginView|-|ログイン時に使用するページ|
|/logout|-|LogoutView|-|来訪するとログアウト処理が走るページ|
|/auth|（連携対象のサービス側が指定）|SampleView|-|サービス連携の際、リダイレクト先に指定するページ|
|/regist|-|RegistrationView|〇|ユーザー登録のためのページ|
|/notifications|-|NotificationsView|〇|通知情報を一覧できるページ|
|/tier/:tid|-|TierView|-|Tierを表示するページ|
|/tier-settings-new|-|TierSettingsView|〇|Tierを新規作成するページ|
|/tier-settings/:tid|-|TierSettingsView|〇|Tierを編集するページ|
|/review/:rid|-|ReviewView|-|レビューを表示するページ|
|/review-settings-new/:tid|-|ReviewSettingsView|〇|レビューを新規作成するページ|
|/review-settings/:rid|-|ReviewSettingsView|〇|レビューを編集するページ|
|/tier-embedded/:tid|-|TierEmbeddedView|-|外部のサイトから埋め込みタグでTierを表示するためのページ|
|/settings|-|SettingsView|〇|ユーザー設定|
|該当なし|-|SampleViNotFoundViewew|-|Not Foundを表示|
