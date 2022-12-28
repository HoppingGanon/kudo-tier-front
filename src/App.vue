<template>
  <v-app id="inspire">

    <v-navigation-drawer
      v-model="drawer"
      class="grad"
      app
    >
      <v-container>
        <v-row style="min-height: 64px;">
          <v-icon color="gray darken-1" class="ml-5" @click="drawer = !drawer"> mdi-arrow-left-bold-outline </v-icon>
        </v-row>
        <v-row>
          <v-divider />
        </v-row>
        <v-row v-if="hasSession">
          <v-col cols="4">
            <v-avatar
              class="ma-3"
              size="56"
              color="purple"
            >
              <v-img src="https://placehold.jp/150x150.png" />
            </v-avatar>
          </v-col>
        </v-row>
        <v-row v-if="hasSession" style="min-height: 100px;" class="ml-2">
          <v-col>
            <span><b>炎獄少年がのんくん</b></span><br />
            <span>
              社会人だってあばれたい
            </span>
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
        <v-row style="min-height: 300px;">
          <v-list class="ma-3">
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
            <v-list-item v-if="hasSession">
              <v-list-item-title>
                <v-icon class="mr-3">mdi-cog-outline</v-icon>
                設定
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-row>
        <v-row v-if="hasSession">
          <v-divider class="mt-5 mb-5" />
        </v-row>
        <v-row v-if="hasSession">
          <v-list>
            <v-dialog v-model="logoutDialog">
              <template v-slot:activator="{ isActive, props}">
                <v-list-item @click="() => {logoutDialog = true}" v-on="isActive" v-bind="props">
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

    <v-app-bar app class="pink lighten-4 anime" :style="barStyle" v-if="isVisibleBar">
      <v-app-bar-nav-icon @click="() => {drawer = !drawer}">
      </v-app-bar-nav-icon>
      <v-toolbar-title>Tiereview</v-toolbar-title>
    </v-app-bar>

    <v-dialog v-model="forceDialog">
      <v-card>
        <v-toolbar dark color="primary">
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

    <v-avatar class="overlay anime baricon" color="primary" @click="clickHideBarIcon" :style="iconStyle">
      <v-icon v-if="isVisibleBar" dark>mdi-overscan</v-icon>
      <v-icon v-else dark>mdi-page-layout-header</v-icon>
    </v-avatar>

    <v-main class="grad">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import RestApi from '@/common/restapi'
import router from '@/router'
import store from '@/store'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'App',
  setup () {
    const toast = useToast()

    const isVisibleBar = ref(true)
    const drawer = ref(false)
    const barHeight = ref(60)
    const logoutDialog = ref(false)
    const forceDialog = ref(false)

    const clickHideBarIcon = () => {
      isVisibleBar.value = !isVisibleBar.value
      drawer.value = true
    }

    const iconStyle = computed(() => isVisibleBar.value ? `top:${barHeight.value + 8}px;` : 'top: 0px;')
    const barStyle = computed(() => isVisibleBar.value ? `height:${barHeight.value}px;` : 'height: 0px;')
    const hasSession = computed(() => store.state.sessionId !== '')
    const isNew = computed(() => store.state.isNew)

    const logout = () => {
      if (store.state.sessionId !== '') {
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
      router.push('/tier-settings')
    }

    return {
      logoutDialog,
      forceDialog,
      isVisibleBar,
      drawer,
      barHeight,
      iconStyle,
      barStyle,
      hasSession,
      isNew,
      clickHideBarIcon,
      goHome,
      logout,
      forceLogout,
      goLogin,
      goTierSearch,
      goTierSettings
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.grad{
  background: linear-gradient(white, #FCE4EC);
}

.overlay {
  position: fixed;
  top: 20px;
  right: 10px;
  z-index: 100;
  text-align: right;
  align-content: right;
  cursor: pointer;
}

.baricon {
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, .3);
}

.anime {
  transition: all 0.25s ease-out;
}
</style>
