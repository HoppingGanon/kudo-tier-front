<template>
  <div v-if="$vuetify.display.mdAndUp" class="d-flex parent" :style="detailStyle">
    <div class="left">
      <slot name="left" :props="{ closeDrawer }"></slot>
    </div>
    <div class="right pa-1">
      <slot name="right" :props="{ calcHeight }"></slot>
    </div>
  </div>

  <div v-else style="width: 180%;overflow-x: auto;">
    <slot name="left" :props="{ openDrawer }"></slot>
    <v-dialog v-model="drawer" :fullscreen="true">
      <v-card>
        <v-toolbar color="secondary">
          <div class="text-end" style="width: 100%">
            <v-btn icon flat @click="closeDrawer">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </v-toolbar>
        <slot name="right" :props="{ calcHeight, closeDrawer }"></slot>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ComponentPicker',
  setup () {
    const detailStyle = ref('')
    const drawer = ref(false)

    const calcHeight = () =>{
      const header = document.getElementById("header")
      if (header) {
        const height =  document.documentElement.clientHeight - (header.offsetTop + header.offsetHeight) - 30
        detailStyle.value =  `height: ${height}px;`
      } else {
        detailStyle.value =  'height: 100%'
      }
    }
    window.onresize = calcHeight

    const closeDrawer = () => drawer.value = false
    const openDrawer = () => drawer.value = true

    return {
      detailStyle,
      drawer,
      calcHeight,
      closeDrawer,
      openDrawer
    }
  }
})
</script>

<style scoped>
div.parent {
  overflow-y: hidden;
}
div.left {
  top: 0px;
  z-index: 1;
  width:250px;
  overflow-y: scroll;
  overflow-x: hidden;
}
div.right {
  right: 0px;
  width: 100%;
  bottom: 0px;
  z-index: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}

.drawer {
  position: static;
  left: 0%;
}
.components {
  position: static;
  left: -90%;
}

</style>