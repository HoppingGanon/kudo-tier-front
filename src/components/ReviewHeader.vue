<template>
  <v-card flat>
    <v-container fluid>
      <v-row>
        <v-col cols="3" sm="2" md="1" lg="1" xl="1">
          <div class="avatar-space cursor-pointer" @click="goHome">
            <v-avatar size="100%">
              <v-img :src="iconUrl" />
            </v-avatar>
          </div>
        </v-col>
        <v-col cols="9" sm="10" md="10" lg="10" xl="10">
          <p class="no-break cursor-pointer"  @click="goHome">
            <span v-text="dispName"></span><br />
            <span v-text="lastWriteTime"></span>に更新
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ReviewHeader',
  components: {},
  props: {
    dispName: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    lastWriteTime: {
      type: String,
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    }
  },
  emits: { },
  setup (props) {
    const goHome = () => {
      router.push(`/home/${props.userId}`)
    }
    return {
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
  width: 100%;
}
</style>
