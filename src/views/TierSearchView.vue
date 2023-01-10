<template>

  <!-- セッション有効期限をチェックする -->
  <session-checker />

  <v-container class="pa-0">
    <v-card class="ma-0">
      <v-toolbar color="secondary" dark>
        <div class="no-break-box">
          <v-card-title>
            <span v-text="`Tier一覧(${dispName})`" />
          </v-card-title>
        </div>
      </v-toolbar>
      <v-card v-if="isNotFound" flat>
        <span>
          ユーザーが存在しません
        </span>
      </v-card>
      <tier-search v-else :tiers="tiers" :user-id="userId" @clear-tiers="clearTiers" @update-tiers="updateTiers" @add-tiers="addTiers" />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SessionChecker from '@/components/SessionChecker.vue'
import TierSearch from '@/components/TierSearch.vue'
import { useRoute } from 'vue-router'
import RestApi, { Parser } from '@/common/restapi'
import { useToast } from 'vue-toast-notification'
import { Tier } from '@/common/review'

export default defineComponent({
  name: 'TierSearchView',
  components: {
    SessionChecker,
    TierSearch
  },
  props: {},
  emits: {},
  setup () {
    const route = useRoute()
    const toast = useToast()
    const isNotFound = ref(true)
    const dispName = ref('')
    const userId = ref('')

    const tiers = ref([] as Tier[])

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        const id = route.params.id
        // URIにIDが含まれている場合
        RestApi.getUserData(id).then((res) => {
          dispName.value = res.data.name
          userId.value = id
          // ユーザーが存在する場合は、Tierの検索(初動)
          RestApi.getTierList(id, '', 'updatedAtDesc', 1).then((res) => {
            const tierDataList = res.data
            tiers.value.splice(0)
            tierDataList.forEach((v) => {
              tiers.value.push(Parser.parseTier(v))
            })
          }).catch((e) => {
            const v = e.response.data
            toast.error(`${v.message} (${v.code})`)
          })
          isNotFound.value = false
        }).catch(() => {
          isNotFound.value = true
        })
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        isNotFound.value = true
      }
    })

    const clearTiers = () => {
      tiers.value.splice(0)
    }

    const updateTiers = (v: Tier[]) => {
      clearTiers()
      setTimeout(() => {
        tiers.value = v
      }, 0)
    }

    const addTiers = (v: Tier[]) => {
      tiers.value = tiers.value.concat(v)
    }

    return {
      tiers,
      isNotFound,
      dispName,
      userId,
      clearTiers,
      updateTiers,
      addTiers
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
