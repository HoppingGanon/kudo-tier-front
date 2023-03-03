<template>
  <v-list>
    <v-list-item
      v-for="notification, i of notifications"
      :key="i"
      @click="sel === i ? undefined :selectItem(notification, i)"
      class="pt-2 pb-2 ml-2 mr-2"
      style="border-top: 1px solid lightgray;"
    >
      <v-list-item-title
        v-text="`${notification.createdAt} 運営からのお知らせ`"
        class="anime"
        :class="`${notification.isRead ? '' : 'font-weight-bold'}`"
      />
      <div
        class="anime"
        :class="`${notification.isRead ? '' : 'font-weight-bold '} ${sel === i ? 'text-subtitle-1 select' : 'no-break-box not-select'}`"
      >
        <span v-text="notification.content"></span>
      </div>
      <div
        class="anime"
        :class="sel === i ? 'btn-select' : 'btn-no-select'"
        style="text-align: end;"
        flat
        :disabled="sel !== i"
      >
        <span class="cursor-pointer">
          <v-tooltip v-if="notification.isRead" text="未読状態に戻す">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" @click="updateRead(notification, i, false)">
                mdi-bell-outline
              </v-icon>
            </template>
          </v-tooltip>
          <v-tooltip v-else text="既読にする">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" @click="updateRead(notification, i, true)">
                mdi-bell-check-outline
              </v-icon>
            </template>
          </v-tooltip>
        </span>
      </div>
    </v-list-item>
  </v-list>

  <!-- 待機 -->
  <loading-component :is-loading="loading" :is-force="true" class="mt-5" title="通知を取得中..." />
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import RestApi, { NotificationData, toastError, Parser } from '@/common/restapi'
import LoadingComponent from '@/components/LoadingComponent.vue'
import store from '@/store'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'NotificationsComponent',
  components: {
    LoadingComponent
  },
  setup () {
    const toast = useToast()

    const loading = ref(true)
    const notifications: Ref<NotificationData[]> = ref([])
    const sel = ref(-1)

    onMounted(() => {
      if (store.getters.isRegistered) {
        // ログイン状態なら通知を取得
        RestApi.getNotifications().then((res) => {
          const a = Parser.parseNotificationsStr(res.data)
          notifications.value = a
        }).catch((err) => {
          toastError(err, toast)
        }).finally(() => {
          loading.value = false
        })
      }
    })

    const selectItem = (notification: NotificationData, index: number) => {
      if (index < notifications.value.length) {
        sel.value = index
        notifications.value[index].isRead = true
        RestApi.updateNotificationRead(notification.id, true).then(() => {
          // 成功したら通知数を更新
          RestApi.getNotificationsCount().then((res) => {
            store.commit('setNotificationsCount', res.data.count)
          })
        })
      }
    }

    const updateRead = (notification: NotificationData, index: number, isRead: boolean) => {
      if (index < notifications.value.length) {
        notifications.value[index].isRead = isRead
        RestApi.updateNotificationRead(notification.id, isRead).then(() => {
          // 成功したら通知数を更新
          RestApi.getNotificationsCount().then((res) => {
            store.commit('setNotificationsCount', res.data.count)
          })
        })
      }
    }

    return {
      loading,
      notifications,
      sel,
      selectItem,
      updateRead
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.select {
  opacity: 1;
}

.not-select {
  opacity: 0.75;
}

.btn-no-select {
  opacity: 1;
}

.btn-no-select {
  opacity: 0;
  font-size: 0px;
}

.anime {
  transition: all 0.1s ease-out;
}

</style>
