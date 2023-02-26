<template>
  <v-container>

    <v-row>
      <v-col class="d-flex justify-center">
        <v-card flat width="180px">
          <v-img src="@/assets/logo.png" />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-h5">
        TierReviewsについて
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        TierReviewsは、開発者である<span v-text="myName"></span>が「一度はゼロからwebシステム作って運用してみたいな～」という欲求のために作成したサイトです。
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-h6">
        contributors
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        このサイトを作成するにあたってご協力いただいている皆様のお名前です。
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <table>
          <tr :style="bgStyle">
            <th>
              担当
            </th>
            <th>
              名前
            </th>
          </tr>
          <tr v-for="c, i of contributors" :key="i" :style="i % 2 == 1 ? bgStyle : ''">
            <td class="pl-1 pt-1 pb-1 pr-5">
              <span v-text="c.charge"></span>
            </td>
            <td class="pl-1 pt-1 pb-1 pr-5">
              <span v-for="n, j of c.names" :key="j" v-text="n"></span>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-h6">
        採用技術
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        このサイトを作成するにあたって
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <table>
          <tr :style="bgStyle">
            <th>
              担当
            </th>
            <th>
              名前
            </th>
          </tr>
          <tr v-for="c, i of contributors" :key="i" :style="i % 2 == 1 ? bgStyle : ''">
            <td class="pl-1 pt-1 pb-1 pr-5">
              <span v-text="c.charge"></span>
            </td>
            <td class="pl-1 pt-1 pb-1 pr-5">
              <span v-for="n, j of c.names" :key="j" v-text="n"></span>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Names, { myName } from '@/common/names'
import vuetify from '@/plugins/vuetify'

export default defineComponent({
  name: 'AboutView',
  components: {},
  setup () {
    const bgStyle = `
background-color: ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};
border: 10px solid ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};
`

    return {
      myName,
      contributors: Names.contributors,
      bgStyle
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
