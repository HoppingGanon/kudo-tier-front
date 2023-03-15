<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-card height="100%" flat>
        <v-container class="pl-0 pr-0 pb-0 pt-1">
          <v-row>
            <v-col class="d-flex" style="min-height: 64px;">
              <v-icon color="gray darken-1" class="ml-5" @click="drawer = !drawer"> mdi-arrow-left-bold-outline </v-icon>
              <v-spacer />
              <v-btn v-if="hasSession" @click="openHint" flat icon class="mr-3">
                <v-icon>mdi-help-circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-divider />
          </v-row>
          <v-row v-if="hasSession">
            <v-col>
              <profile-component
                :disp-name="userName"
                profile=""
                :icon-url="userIconUrl"
                :tiers-count="tiersCount"
                :reviews-count="reviewsCount"
                :is-summary="true"
                :user-id="sessionUserId || ''"
                :is-vertical="true"
              />
            </v-col>
          </v-row>
          <v-row v-else style="min-height: 100px;" class="ml-2">
            <v-col>
              <span><b>ゲスト</b></span><br />
              <span>
                未ログイン
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-divider />
          </v-row>
          <v-row>
            <v-col>
              <v-list class="ml-3 mt-0" width="100%">
                <v-list-item v-if="hasSession" @click="goHome">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-home-account</v-icon>
                    ホーム
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-else @click="goLogin">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-login</v-icon>
                    ログイン/登録
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="hasSession"  @click="goTierSettings">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-table-plus</v-icon>
                    Tierの追加
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="hasSession"  @click="reviewDialog = true">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-book-plus-outline</v-icon>
                    レビューの追加
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="hasSession" @click="goNotifications">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-bell-outline</v-icon>
                    通知
                    <v-chip v-if="notificationsCount" v-text="notificationsCount" color="primary" variant="elevated" size="x-small"></v-chip>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="hasSession" @click="goSettings">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-cog-outline</v-icon>
                    ユーザー設定
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-row v-if="hasSession">
            <v-divider class="mt-0" />
          </v-row>
          <v-row v-if="hasSession">
            <v-list class="ml-3 mt-2" width="100%">
              <v-list-item @click="logoutDialog = true">
                <v-list-item-title>
                  <v-icon class="mr-3">mdi-logout</v-icon>
                  ログアウト
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-row>
        </v-container>

        <div style="position: absolute;bottom: 0px;">
          <v-list class="ml-3" width="100%">
            <v-list-item @click="goAbout">
              <v-list-item-title>
                このサイトについて
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar v-if="!noBar" app class="pink lighten-4 anime" :style="barStyle">
      <v-app-bar-nav-icon @click="() => {drawer = !drawer}">
      </v-app-bar-nav-icon>
      <div class="d-flex align-center" style="width: 100%;">
        <div class="cursor-pointer" @click="goWelcome">
          <v-img class="ml-1 mr-1" width="40px" src="@/assets/logo.png" />
        </div>
        <div class="cursor-pointer" @click="goWelcome">
          <v-toolbar-title>
            {{ appName }}
          </v-toolbar-title>
        </div>
        <div style="width: 100%" class="d-flex justify-end">
          <v-btn icon @click="clickHideBarIcon">
            <v-icon dark class="anime" :class="barIsVisible ? 'arrow1' : 'arrow2'">mdi-chevron-up</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <router-view :key="routeWatcher($route)" />
    </v-main>

    <footer-component />

    <v-avatar v-if="!noBar" class="anime overlay baricon" :class="barIsVisible ? 'icon1' : 'icon2'" color="primary" @click="clickHideBarIcon">
      <v-icon dark>mdi-page-layout-header</v-icon>
    </v-avatar>

    <simple-dialog
      v-model="logoutDialog"
      title="ログアウト"
      text="本当にログアウトしますか？"
      submit-button-text="ログアウト"
      close-button-text="キャンセル"
      @submit="goLogout"
    />

    <simple-dialog
      v-model="reviewDialog"
      title="レビューの追加"
      text="レビューを追加したいTierを選んでください"
      :show-submit-button="false"
    >
      <quick-review @close="reviewDialog = false" />
    </simple-dialog>
  </v-app>

  <home-hint v-model="hint" v-model:page="page" :force-type="hintState" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import QuickReview from '@/components/QuickReview.vue'
import HomeHint from '@/components/HomeHint.vue'
import router from '@/router'
import store from '@/store'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import RestApi from '@/common/restapi'
import { appName } from '@/common/names'
import { HintState } from './common/page'

export default defineComponent({
  name: 'App',
  components: {
    ProfileComponent,
    SimpleDialog,
    FooterComponent,
    QuickReview,
    HomeHint
  },
  setup () {
    const route = useRoute()

    const drawer = ref(false)
    const logoutDialog = ref(false)
    const forceDialog = ref(false)
    const reviewDialog = ref(false)

    const sessionUserId = computed(() => store.state.userId)

    const barIsVisible = ref(true)
    const noBar = ref(true)

    const clickHideBarIcon = () => {
      barIsVisible.value = !barIsVisible.value
    }

    const barStyle = computed(() => barIsVisible.value ? 'height:60px;' : 'height: 0px;')
    const hasSession = computed(() => store.getters.isRegistered)
    const isNew = computed(() => store.state.isNew)

    const hint = ref(false)
    const page = ref(0)
    const hintState = ref<HintState>(undefined)

    const goLogout = () => {
      logoutDialog.value = false
      forceDialog.value = false
      router.push('/logout')
    }

    const goHome = () => {
      drawer.value = false
      router.push(`/home/${store.state.userId}`)
    }

    const goNotifications = () => {
      drawer.value = false
      router.push('/notifications')
    }

    const goLogin = () => {
      drawer.value = false
      router.push('/')
    }

    const goTierSettings = () => {
      drawer.value = false
      router.push('/tier-settings-new')
    }

    const goSettings = () => {
      drawer.value = false
      router.push('/settings')
    }

    const goWelcome = () => {
      drawer.value = false
      router.push('/')
    }

    const goAbout = () => {
      drawer.value = false
      router.push('/about')
    }

    // セッションのユーザーIDに変化があればユーザーデータをダウンロードする
    const { userId, userName, userProfile, userIconUrl, reviewsCount, tiersCount, notificationsCount } = toRefs(store.state)

    // ユーザーIDが変更したときはダウンロード
    watch(userId, () => {
      store.commit('downloadUserData', store.state.userId)
    })

    /**
     * URLが変化したら発生するイベント
     */
    const onChangePath = () => {
      if (store.state.hintState === 'tier') {
        // ユーザーが作成されてすぐの場合、Tier作成のヒントを表示
        store.commit('setHintState', undefined)
        hint.value = true
        page.value = 0
        hintState.value = 'tier'
      } else if (store.state.hintState === 'review') {
        // Tierを作成してすぐの場合、レビュー作成のヒントを表示
        store.commit('setHintState', undefined)
        hint.value = true
        page.value = 0
        hintState.value = 'review'
      } else if (store.state.hintState === 'share') {
        // Tierを作成してすぐの場合、レビュー作成のヒントを表示
        store.commit('setHintState', undefined)
        hint.value = true
        page.value = 0
        hintState.value = 'share'
      }
    }

    /**
     * routerがページ内リンクによる変化には反応しないように制御
     * URI変更 → 更新
     * ID変更 → 更新しない
     * クエリパラメータ変更 → 更新(多くのページでonMount時にしか読み込んでいないため)
    */
    const routeWatcher = (route: RouteLocationNormalizedLoaded) => {
      const len = route.fullPath.length
      const paramStart = route.fullPath.indexOf('?')
      const idStart = route.fullPath.indexOf('#')

      // ページチェック
      checkRouter()

      let path = ''
      if (idStart === -1) {
        path = route.fullPath
      } else if (paramStart === -1) {
        path = route.fullPath.substring(0, idStart)
      } else {
        path = route.fullPath.substring(0, idStart) + route.fullPath.substring(paramStart, len)
      }

      onChangePath()

      return path
    }

    /** ページチェック */
    const checkRouter = async () => {
      if (route.name === 'tier-embedded') {
        // 埋め込みとして動作
        noBar.value = true
      } else if (route.name === 'welcome') {
        // 埋め込みとして動作
        noBar.value = true
      } else {
        noBar.value = false
      }
    }

    /** 非同期ページチェック */
    const checkRouterOnMounted = async () => {
      await router.isReady()
      checkRouter()
    }

    const openHint = () => {
      page.value = 0
      hint.value = true
      drawer.value = false
      hintState.value = undefined
    }

    onMounted(async () => {
      // ページごとの初期状態処理を、非同期で行う
      checkRouterOnMounted()
      // ユーザーデータの取得
      store.commit('downloadUserData', store.state.userId)

      // ログイン状態なら未読通知数を取得
      if (store.getters.isRegistered) {
        RestApi.getNotificationsCount().then((res) => {
          store.commit('setNotificationsCount', res.data.count)
        })
      }
    })

    return {
      appName,
      logoutDialog,
      forceDialog,
      reviewDialog,
      userName,
      userProfile,
      userIconUrl,
      reviewsCount,
      tiersCount,
      notificationsCount,
      sessionUserId,
      barIsVisible,
      noBar,
      drawer,
      barStyle,
      hasSession,
      isNew,
      hint,
      page,
      hintState,
      clickHideBarIcon,
      goHome,
      goNotifications,
      goLogout,
      goLogin,
      goTierSettings,
      goSettings,
      goWelcome,
      goAbout,
      routeWatcher,
      openHint
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.overlay {
  position:fixed;
  right: 6px;
  z-index: 100;
  text-align: right;
  align-content: right;
  cursor: pointer;
}

.icon1 {
  top: -60px;
}

.icon2 {
  top: 8px;
}

.baricon {
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, .3);
}

.anime {
  transition: all 0.25s ease-out;
}

.arrow1 {
  rotate: 0deg;
}

.arrow2 {
  rotate: 180deg;
}

</style>
