<!-- あらかじめシェルで出力したjsonファイルを読み込んで、ライセンス一覧を表示するコンポーネント -->

<template>
  <table>
    <tr :style="bgStyle">
      <th>
        パッケージ名@バージョン
      </th>
      <th v-show="false">
        ライセンス
      </th>
      <th>
        LISENCEファイル
      </th>
    </tr>
    <tr v-for="l,i of licenses" :key="i" :style="i % 2 == 1 ? bgStyle : ''">
      <td>
        <span v-text="l.fullName"></span>
      </td>
      <td v-show="false">
        <span v-text="l.license"></span>
      </td>
      <td class="centering-x">
        <v-btn v-if="l.licenseName" flat @click="openLicense(i)" :color="i % 2 == 1 ? 'thirdry' : ''" width="100%">
          開く
        </v-btn>
        <span class="text-caption" v-else>
          LICENSEファイルはありません
        </span>
      </td>
    </tr>
  </table>

  <simple-dialog v-model="dialog" :title="licenses[sel].licenseName" :fullscreen="$vuetify.display.mobile">
    <div style="overflow-y: scroll;height:480px;" class="d-flex justify-center">
      <div>
        <span v-for="c, i of licenses[sel].content.split('\n')" :key="i">
          <span v-text="c"></span>
          <br />
        </span>
      </div>
    </div>
  </simple-dialog>
</template>

<script lang="ts">
import vuetify from '@/plugins/vuetify'
import { defineComponent, PropType, ref } from 'vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import { LicenseData } from '@/common/page'

export default defineComponent({
  name: 'LicenseList',
  components: {
    SimpleDialog
  },
  props: {
    /**  ライセンスデータ(jsonから読み込んで渡す) */
    licenses: {
      type: Array as PropType<LicenseData[]>,
      required: true
    }
  },
  setup () {
    const bgStyle = `
background-color: ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};
border: 10px solid ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};
`

    const dialog = ref(false)
    const sel = ref(0)

    const openLicense = (index: number) => {
      sel.value = index
      dialog.value = true
    }

    return {
      bgStyle,
      dialog,
      sel,
      openLicense
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
