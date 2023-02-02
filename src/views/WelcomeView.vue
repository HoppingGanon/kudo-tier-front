<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <v-col>
        <div style="width: 100%;" class="d-flex justify-end">
          <v-btn v-if="hasSession" flat @click="logoutDialog = true">
            ログアウト
          </v-btn>
          <v-btn v-else flat @click="goLogin">
            ログイン/新規登録
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <welcome-carousel />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <explanation-summary :has-session="hasSession" />
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: center;">
        <v-btn v-if="hasSession" color="primary" class="text-no-transform" @click="goHome">TierReviewsのホーム画面へ</v-btn>
        <v-btn v-else color="primary" class="text-no-transform" @click="goLogin">TierReviewsをはじめる</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div style="height: 100px"></div>
      </v-col>
    </v-row>
  </v-container>

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import WelcomeCarousel from '@/components/WelcomeCarousel.vue'
import ExplanationSummary from '@/components/ExplanationSummary.vue'
import store from '@/store'
import { useToast } from 'vue-toast-notification'
import RestApi from '@/common/restapi'
import router from '@/router'

export default defineComponent({
  name: 'WelcomeView',
  components: {
    WelcomeCarousel,
    ExplanationSummary
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const toast = useToast()
    const logoutDialog = ref(false)
    const forceDialog = ref(false)
    const hasSession = computed(() => store.getters.isRegistered)

    const goHome = () => {
      router.push('/home')
    }

    const goLogin = () => {
      router.push('/login')
    }

    const goLogout = () => {
      router.push('/logout')
    }

    return {
      hasSession,
      logoutDialog,
      forceDialog,
      goHome,
      goLogin,
      goLogout
    }
  }
})
</script>

<style scoped>
</style>
