<!-- レビューやTierに付与するヘッダ -->

<template>
  <div style="display:flex">
    <div class="avatar-space cursor-pointer" @click="goHome">
      <v-avatar size="100%">
        <v-img v-if="iconUrl" :src="getImgSource(iconUrl)"/>
        <v-img v-else src="@/assets/common/noimage256.png"/>
      </v-avatar>
    </div>
    <v-card flat height="100%">
      <p class="no-break cursor-pointer mt-1 ml-3"  @click="goHome">
        <span v-text="dispName"></span><br />
        <span v-text="lastWriteTime" class="text-body-2"></span><span class="text-body-2">に更新</span>
      </p>
    </v-card>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { getImgSource } from '@/common/restapi'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ReviewHeader',
  props: {
    /** 表示名 */
    dispName: {
      type: String,
      required: true
    },
    /** ユーザーID */
    userId: {
      type: String,
      required: true
    },
    /** 最終更新日 */
    lastWriteTime: {
      type: String,
      required: true
    },
    /** ユーザーのアイコンURL */
    iconUrl: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const goHome = () => {
      router.push(`/home/${props.userId}`)
    }
    return {
      getImgSource,
      goHome
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
a{
  color:inherit;
  text-decoration: none;
}
.avatar-space {
  aspect-ratio: 1;
  width: 25%;
  height: auto;
  max-width: 64px;
  max-height: 64px;
}
</style>
