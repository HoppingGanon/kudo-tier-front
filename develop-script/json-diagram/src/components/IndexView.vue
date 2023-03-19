<!-- 新規にコンポーネントを追加する際のテンプレート -->

<template>
  <v-card color="secondary">
    <v-card-title>
      くどくどTier フロントエンド コンポーネント設計書
    </v-card-title>
    <div class="text-end">
      最終更新: v0.5.1 時点
    </div>
    <v-card color="thirdry" class="pa-5">
      このドキュメントは、くどくどTierのフロントエンドで使用されるコンポーネントの説明、親子関係、プロパティ、イベント等を纏めたものです。<br />
      ソースコードはlintで構文を制限されているのでPowershellでコメントや定義を吸い上げてjsonや定義ファイルに変換します。<br /><br />

      変換スクリプトはdevelop-scipt/vue-to-svg.cmdを使用してください。
    </v-card>
  </v-card>
  <v-expansion-panels :model-value="panels" @update:model-value="updatePannels">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div style="height:40px;">コンポーネント関係図</div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          Powershellとnomnomlにより自動生成されています。恐ろしく見づらいので改良予定。
        </div>
        <div id="map" style="width: 100%;height: 600px;overflow: scroll scroll;">
          <img
            src="@/assets/components-list.svg"
            alt="components-list.svgが表示できません"
            style="width: 8000px;"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div style="height:40px;">コンポーネント一覧表</div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          各コンポーネントの説明はPowershellにより自動生成されています。<br />
          vueseを使用してもうまく吸い上げられなかったため、苦肉の策です。
        </div>
        <v-container>
          <v-expansion-panels :model-value="componentPanel" @update:model-value="updateComponentPanel">
            <v-expansion-panel
              v-for="item,i in list"
              :key="i"
              :title="item.name"
              :id="`COMP${item.name}`"
            >
              <v-expansion-panel-text class="text-start">
                <v-row dense>
                  <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                    <v-card flat color="primary" height="100%">説明</v-card>
                  </v-col>
                  <v-col>
                    <v-card flat color="secondary" height="100%" v-text="item.description"></v-card>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                    <v-card flat color="primary" height="100%">プロパティ</v-card>
                  </v-col>
                  <v-col v-if="item.props.length > 0">
                    <v-row v-for="item2, j in item.props" :key="j" dense>
                      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                        <v-card flat color="secondary" height="100%" v-text="item2.name"></v-card>
                      </v-col>
                      <v-col>
                        <v-row v-if="item2.comment" dense>
                          <v-col><v-card flat color="thirdry" height="100%">説明: {{ item2.comment }}</v-card></v-col>
                        </v-row>
                        <v-row v-if="item2.type" dense>
                          <v-col><v-card flat color="thirdry" height="100%">型: {{ item2.type }}</v-card></v-col>
                        </v-row>
                        <v-row v-if="item2.default" dense>
                          <v-col><v-card flat color="thirdry" height="100%">規定値: {{ item2.default }}</v-card></v-col>
                        </v-row>
                        <v-row v-if="item2.required === 'true'" dense>
                          <v-col>
                            <v-card flat color="thirdry" height="100%">必須: 〇</v-card>
                          </v-col>
                        </v-row>
                        <v-row v-else dense>
                          <v-col>
                            <v-card flat color="thirdry" height="100%">必須: -</v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-else>
                    <v-card flat color="secondary" height="100%">プロパティ無し</v-card>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                    <v-card flat color="primary" height="100%">イベント</v-card>
                  </v-col>
                  <v-col v-if="item.emits.length > 0">
                    <v-row v-for="item2, j in item.emits" :key="j" dense>
                      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                        <v-card flat color="secondary" height="100%" v-text="item2.name"></v-card>
                      </v-col>
                      <v-col>
                        <v-row dense>
                          <v-col><v-card flat color="thirdry" height="100%">説明: {{ item2.comment }}</v-card></v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <v-row v-for="item3, k in item2.params" :key="k">
                              <v-col cols="12">
                                <v-card flat color="thirdry" height="100%" v-if="item2.params"> {{ item3.name }}
                                </v-card>
                              </v-col>
                              <v-col cols="12">
                                <v-card flat color="thirdry" height="100%" v-if="item2.params"> {{ item3.comment }}
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-else>
                    <v-card flat color="secondary" height="100%">イベント無し</v-card>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                    <v-card flat color="primary" height="100%">子コンポーネント</v-card>
                  </v-col>
                  <v-col v-if="item.components.length > 0">
                    <v-row v-for="item2, j in item.components" :key="j" dense>
                      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                        <v-card flat color="secondary" height="100%" v-text="item2"></v-card>
                      </v-col>
                      <v-col>
                          <v-btn @click="goComponent(item2)"> コンポーネントへ移動 </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-else>
                    <v-card flat color="secondary" height="100%">子コンポーネント無し</v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import list from '@/assets/components-list.json'

export default defineComponent({
  name: 'TemplateView',
  setup () {
    const panels = ref<number | undefined>(undefined)
    const componentPanel = ref<number | undefined>(undefined)
  
    const updatePannels = (v: unknown) => {
      if (typeof v === 'number' && v === 0) {
        setTimeout(() => {
          const map = document.getElementById('map')
          if (map) {
            map.scrollTo({
              left: 4000,
              top: 0,
              behavior: 'smooth'
            })
          }
        }, 350)
      }
      if (typeof v === 'number' || v === undefined) {
        panels.value = v
      }
    }
    const updateComponentPanel = (v: unknown) => {
      if (typeof v === 'number' || v === undefined) {
        componentPanel.value = v
      }
    }

    const goComponent = (v: string) => {
      const index = list.findIndex((item) => item.name === v)
      if (index >= 0) {
        updateComponentPanel(index)
      }
      setTimeout(() => {
        window.location.href = `#COMP${v}`
      }, 500)
      
    }

    return {
      list,
      panels,
      componentPanel,
      updatePannels,
      updateComponentPanel,
      goComponent
    }
  }
})
</script>

<style scoped>
</style>

