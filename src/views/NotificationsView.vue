<template>
  <session-checker :no-session-error="true" />

  <padding-component :target-user-id="userId" title="ユーザー情報">
    <v-card>
      <v-toolbar color="secondary" dark>
        <v-card-title>
          通知
        </v-card-title>
      </v-toolbar>
      <notifications-component />
    </v-card>
  </padding-component>
</template>

<script lang="ts">
import store from '@/store'
import { defineComponent, onMounted, ref } from 'vue'
import PaddingComponent from '@/components/PaddingComponent.vue'
import SessionChecker from '@/components/SessionChecker.vue'
import NotificationsComponent from '@/components/NotificationsComponent.vue'

export default defineComponent({
  name: 'NotificationsView',
  components: {
    PaddingComponent,
    SessionChecker,
    NotificationsComponent
  },
  props: {},
  emits: {},
  setup () {
    const userId = ref('')

    onMounted(() => {
      userId.value = store.state.userId
    })

    return {
      userId
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
