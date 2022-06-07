<template>
  <v-app id="inspire">
    <v-avatar class="overlay anime baricon" color="pink" @click="clickHideBarIcon" :style="iconStyle">
      <v-icon v-if="isVisibleBar" dark>mdi-overscan</v-icon>
      <v-icon v-else dark>mdi-page-layout-header</v-icon>
    </v-avatar>

    <v-navigation-drawer
      v-model="drawer"
      class="grad"
      app
    >
      <template v-slot:prepend>
      </template>
      <v-container>
        <v-row style="min-height: 64px;">
          <v-icon color="gray darken-1" class="ml-5" @click="drawer = !drawer"> mdi-arrow-left-bold-outline </v-icon>
        </v-row>
        <v-row>
          <v-divider />
        </v-row>
        <v-row style="min-height: 100px;">
          <v-col cols="4">
            <v-avatar
              class="ma-3"
              size="56"
              color="purple"
            >
              <v-img src="https://placehold.jp/150x150.png" />
            </v-avatar>
          </v-col>
          <v-col cols="8">
            <span><b>炎獄少年がのんくん</b></span><br />
            <span>
              社会人だってあばれたい
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-divider />
        </v-row>
        <v-row style="min-height: 300px;">
          <v-list class="ma-3">
          </v-list>
        </v-row>
        <v-row>
          <v-divider />
        </v-row>
        <v-row>
          <p class="ma-3">
            made by ほっぴんぐがのん<br />
            2022.06.01
          </p>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar app class="pink lighten-4 anime" :style="barStyle" v-if="isVisibleBar">
      <v-app-bar-nav-icon @click="() => {drawer = !drawer}">
      </v-app-bar-nav-icon>
        abc
      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-main class="grad">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',

  setup () {
    const isVisibleBar = ref(true)
    const drawer = ref(false)
    const barHeight = ref(60)

    const clickHideBarIcon = () => {
      isVisibleBar.value = !isVisibleBar.value
      drawer.value = false
    }

    const iconStyle = computed(() => isVisibleBar.value ? `top:${barHeight.value + 8}px;` : 'top: 0px;')
    const barStyle = computed(() => isVisibleBar.value ? `height:${barHeight.value}px;` : 'height: 0px;')

    return {
      isVisibleBar,
      drawer,
      barHeight,
      iconStyle,
      barStyle,
      clickHideBarIcon
    }
  }
})
</script>

<style scoped>

.grad{
  background: linear-gradient(white, #FCE4EC);
}

.overlay {
  position: absolute;
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
