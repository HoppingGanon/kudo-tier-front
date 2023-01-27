<template>
  <v-app id="inspire">

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-container>
        <v-row style="min-height: 64px;">
          <v-icon color="gray darken-1" class="ml-5" @click="drawer = !drawer"> mdi-arrow-left-bold-outline </v-icon>
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
          <v-list class="ml-3 mt-3" width="100%">
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
            <v-list-item v-if="hasSession"  @click="goTierSearch">
              <v-list-item-title>
                <v-icon class="mr-3">mdi-table-account</v-icon>
                Tier一覧
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="hasSession"  @click="goTierSettings">
              <v-list-item-title>
                <v-icon class="mr-3">mdi-table-plus</v-icon>
                Tier追加
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="hasSession" @click="goSettings">
              <v-list-item-title>
                <v-icon class="mr-3">mdi-cog-outline</v-icon>
                ユーザー設定
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-row>
        <v-row v-if="hasSession">
          <v-divider class="mt-3" />
        </v-row>
        <v-row v-if="hasSession">
          <v-list class="ml-3 mt-3" width="100%">
            <v-dialog v-model="logoutDialog">
              <template v-slot:activator>
                <v-list-item @click="() => {logoutDialog = true}">
                  <v-list-item-title>
                    <v-icon class="mr-3">mdi-logout</v-icon>
                    ログアウト
                  </v-list-item-title>
                </v-list-item>
              </template>

              <v-card>
                <v-toolbar color="secondary" dark>
                  <v-card-title>確認</v-card-title>
                </v-toolbar>
                <v-card-text>
                  本当にログアウトしますか？
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn @click="logout">はい</v-btn>
                  <v-btn @click="() => { logoutDialog = false }">いいえ</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar v-if="!isEmbedded" app class="pink lighten-4 anime" :style="barStyle">
      <v-app-bar-nav-icon @click="() => {drawer = !drawer}">
      </v-app-bar-nav-icon>
      <div class="d-flex align-center" style="width: 100%;">
        <div>
          <v-img class="ml-1 mr-1" width="40px" src="@/assets/logo.png" />
        </div>
        <div>
          <v-toolbar-title>
            TierReviews
          </v-toolbar-title>
        </div>
        <div style="width: 100%" class="d-flex justify-end">
          <v-btn icon @click="clickHideBarIcon">
            <v-icon dark class="anime" :class="barIsVisible ? 'arrow1' : 'arrow2'">mdi-chevron-up</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-dialog v-model="forceDialog">
      <v-card>
        <v-toolbar color="primary">
          <v-card-title>確認</v-card-title>
        </v-toolbar>
        <v-card-text>
          ログアウトに失敗しました<br />
          強制的にセッションを削除しますか？
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="forceLogout">はい</v-btn>
         <v-btn @click="() => { forceDialog = false }">いいえ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <router-view :key="routeWatcher($route)" />
    </v-main>

    <v-avatar v-if="!isEmbedded" class="anime overlay baricon" :class="barIsVisible ? 'icon1' : 'icon2'" color="primary" @click="clickHideBarIcon">
      <v-icon dark>mdi-page-layout-header</v-icon>
    </v-avatar>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import RestApi from '@/common/restapi'
import router from '@/router'
import store from '@/store'
import { useToast } from 'vue-toast-notification'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    ProfileComponent
  },
  setup () {
    const toast = useToast()
    const route = useRoute()

    const drawer = ref(false)
    const logoutDialog = ref(false)
    const forceDialog = ref(false)

    const sessionUserId = computed(() => store.state.userId)

    const barIsVisible = ref(true)
    const isEmbedded = ref(true)

    const clickHideBarIcon = () => {
      barIsVisible.value = !barIsVisible.value
    }

    const barStyle = computed(() => barIsVisible.value ? 'height:60px;' : 'height: 0px;')
    const hasSession = computed(() => store.getters.isRegistered)
    const isNew = computed(() => store.state.isNew)

    const logout = () => {
      if (store.getters.isRegistered) {
        RestApi.delSession().then(() => {
          logoutDialog.value = false
          store.commit('initAllSession')
          toast.success('ログアウトしました')
          router.push('/login')
        }).catch(() => {
          logoutDialog.value = false
          forceDialog.value = true
          toast.error('ログアウトに失敗しました')
        })
      }
    }

    const goHome = () => {
      router.push(`/home/${store.state.userId}`)
    }

    const forceLogout = () => {
      logoutDialog.value = false
      forceDialog.value = false
      store.commit('initAllSession')
      toast.success('ログアウトしました')
      router.push('/login')
    }

    const goLogin = () => {
      router.push('/login')
    }

    const goTierSearch = () => {
      router.push(`/tier-search/${store.state.userId}`)
    }

    const goTierSettings = () => {
      router.push('/tier-settings-new')
    }

    const goSettings = () => {
      router.push('/settings')
    }

    // セッションのユーザーIDに変化があればユーザーデータをダウンロードする
    const { userId, userName, userProfile, userIconUrl, reviewsCount, tiersCount } = toRefs(store.state)

    // ユーザーIDが変更したときはダウンロード
    watch(userId, () => {
      store.commit('downloadUserData', store.state.userId)
    })

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
      if (idStart === -1) {
        return route.fullPath
      } else if (paramStart === -1) {
        return route.fullPath.substring(0, idStart)
      } else {
        return route.fullPath.substring(0, idStart) + route.fullPath.substring(paramStart, len)
      }
    }

    /** 埋め込みとして動作してるかどうか判定する */
    const checkEmb = async () => {
      await router.isReady()
      if (route.name === 'tier-embedded') {
        isEmbedded.value = true
      } else {
        isEmbedded.value = false
      }
    }

    onMounted(async () => {
      // 埋め込みかどうかの判定、非同期で行う
      checkEmb()
      // ユーザーデータの取得
      store.commit('downloadUserData', store.state.userId)
    })

    return {
      logoutDialog,
      forceDialog,
      userName,
      userProfile,
      userIconUrl,
      reviewsCount,
      tiersCount,
      sessionUserId,
      barIsVisible,
      isEmbedded,
      drawer,
      barStyle,
      hasSession,
      isNew,
      clickHideBarIcon,
      goHome,
      logout,
      forceLogout,
      goLogin,
      goTierSearch,
      goTierSettings,
      goSettings,
      routeWatcher
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
