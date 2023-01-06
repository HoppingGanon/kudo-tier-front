<template>
  <v-container class="ma-0 pa-1" fluid>
    <v-row>
      <v-col v-if="!$vuetify.display.xs && !$vuetify.display.sm && !$vuetify.display.md" cols="0" sm="0" md="0" lg="3" xl="3">
        <v-container fluid class="ma-0 pa-0">
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar class="pl-2">
                  ユーザーの情報
                </v-toolbar>
                <v-list>
                  <v-list-item>
                    投稿
                    <v-list-item>
                      a
                    </v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" sm="12" md="9" lg="6" xl="5">
        <slot>
          コンポーネントがありません
        </slot>
      </v-col>
      <v-col v-if="!$vuetify.display.xs && !$vuetify.display.sm" cols="0" sm="0" md="3" lg="3" xl="2">
        <v-container fluid class="ma-0 pa-0">
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar class="pl-2">
                  このユーザーの他の投稿を見る
                </v-toolbar>
                <v-list>
                  <v-list-item>
                    レビュー
                    <v-list-item>
                      ここにレビュー一覧を10件表示
                    </v-list-item>
                  </v-list-item>
                </v-list>
                <v-list>
                  <v-list-item>
                    Tier
                    <v-list-item>
                      ここにTier一覧を10件表示
                    </v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PaddingComponent'
})
</script>

<style scoped>
</style>
