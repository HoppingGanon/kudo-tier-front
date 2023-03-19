
<!-- 来訪するとログアウト処理が走るページ -->

<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container>
    <v-card>
      <v-toolbar color="secondary">
        <v-card-title class="font-weight-bold">ログイン/新規登録</v-card-title>
      </v-toolbar>
      <login-component :is-update="false" />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import LoginComponent from '@/components/LoginComponent.vue'

export default defineComponent({
  name: 'LoginView',

  components: {
    SessionChecker,
    LoginComponent
  }
})
</script>

<style Modules>
@import url("@/style/common-style.css");
</style>
