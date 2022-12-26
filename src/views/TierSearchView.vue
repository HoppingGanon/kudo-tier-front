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
      <tier-search v-else :tiers="tiers" />
      </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import TierSearch from '@/components/TierSearch.vue'
import { tiers as tiersOrg } from '@/common/dummy'
import { useRoute } from 'vue-router'
import RestApi, { Parser } from '@/common/restapi'

export default defineComponent({
  name: 'TierSearchView',
  components: {
    TierSearch
  },
  props: {},
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const route = useRoute()
    const isNotFound = ref(false)
    const dispName = ref('')

    const tiers = ref(tiersOrg)

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        const id = route.params.id
        // URIにIDが含まれている場合
        RestApi.getUserData(id).then((res) => {
          dispName.value = res.data.name
          // ユーザーが存在する場合は、Tierの検索
          RestApi.getTierList(id, '', 'tier', 'updatedAtAsc', 1).then((res) => {
            const tierDataList = res.data
            tiers.value.splice(0)
            tierDataList.forEach((v) => {
              tiers.value.push(Parser.parseTier(v))
            })
          }).catch(() => {
            isNotFound.value = true
          })
        }).catch(() => {
          isNotFound.value = true
        })
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        isNotFound.value = true
      }
    })
    return {
      tiers,
      isNotFound,
      dispName
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
