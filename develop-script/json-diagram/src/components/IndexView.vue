<!-- 新規にコンポーネントを追加する際のテンプレート -->

<template>
  <v-card id="header" color="primary" flat>
    <v-card-title class="text-h4 font-weight-bold">
      くどくどTier フロントエンド コンポーネント設計書
    </v-card-title>

    <div class="text-end">
      最終更新: v0.5.5-beta 時点
    </div>

    <v-tabs v-model="tab" fixed-tabs bg-color="secondary">
      <v-tab>この設計書について</v-tab>
      <v-tab>コンポーネント一覧表</v-tab>
      <v-tab>コンポーネント関係図</v-tab>
      <v-tab>ライセンス</v-tab>
    </v-tabs>
  </v-card>

  <div>
    <v-row>
      <v-col>
        <v-card class="pa-0" flat>
          <v-window v-model="tab">
            <v-window-item>
              <div class="mt-5 text-h5 font-weight-bold" style="height:40px;">この設計書について</div>
              <div class="ma-5">
                このドキュメントは、くどくどTierのフロントエンドで使用されるコンポーネントの説明、親子関係、プロパティ、イベント等を纏めたものです。<br /><br />
              </div>
              
            </v-window-item>
            
            <v-window-item>

              <component-picker>
                <template v-slot:left="{ props }">
                  <v-list>
                    <v-list-item v-for="item,i in list" :key="i" class="text-start" @click="selectComponent(i);props && props.openDrawer && props.openDrawer()">
                      <v-list-item-title v-text="item.name" :class="selectedComponent === i ? 'font-weight-bold' : ''"></v-list-item-title>
                    </v-list-item>
                  </v-list>
                </template>
                <template v-slot:right="{ props }">
                  <div class="mt-5 text-h5 font-weight-bold" style="height:40px;">コンポーネント一覧表</div>
                  <div>
                    くどくどTierを構成するコンポーネントの設計一覧です<br />
                  </div>
                  <v-divider class="my-2" />
                  <component-component v-if="selectedComponent < list.length" :item="list[selectedComponent]" @mounted="props.calcHeight" @go-component="goComponent" />
                </template>
              </component-picker>
              
            </v-window-item>

            <v-window-item>
              <div class="mt-5 text-h5 font-weight-bold" style="height:40px;">コンポーネント関係図</div>
              <div>
                Powershellとnomnomlにより自動生成されています。恐ろしく見づらいので改良予定。
              </div>
              <relation-component />
            </v-window-item>

            <v-window-item>
              <div class="mt-5 text-h5 font-weight-bold" style="height:40px;">ライセンス</div>
                
              <div>本ドキュメントの作成に使用したパッケージについて、ライセンスは以下の通りです。</div>
              <v-divider class="my-5" />
              <v-row v-for="item, i in licenses" :key="i">
                <v-col cols="12" class="font-weight-bold">
                  {{  item.fullName }}
                </v-col>
                <v-col cols="12">
                  <span v-for="str, j in item.content.split('\n')" :key="j">
                    {{ str }}<br />
                  </span>
                </v-col>
                <v-col cols="12">
                  <v-divider />
                </v-col>
              </v-row>
            </v-window-item>

          </v-window>

        </v-card>
      </v-col>
    </v-row>
  </div>


</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import list from '@/assets/components-list.json'
import licenses from '@/assets/licenses-diagram.json'
import RelationComponent from '@/components/RelationComponent.vue'
import ComponentPicker from '@/components/ComponentPicker.vue'
import ComponentComponent from '@/components/ComponentComponent.vue'

export default defineComponent({
  name: 'IndexView',
  components: {
    RelationComponent,
    ComponentPicker,
    ComponentComponent
  },
  setup () {
    const tab = ref(0)
    const selectedComponent = ref(0)

    const selectComponent = (index: number) => {
      selectedComponent.value = index
    }

    const goComponent = (name: string) => {
      let hit = -1
      list.forEach((v, i) => {
        if (v.name === name) {
          hit = i
        }
      })
      if (hit === -1) {
        alert(`コンポーネント'${name}'の設計はありません`)
        return
      }
      selectedComponent.value = hit
    }

    return {
      list,
      licenses,
      tab,
      selectedComponent,
      goComponent,
      selectComponent
    }
  }
})
</script>
