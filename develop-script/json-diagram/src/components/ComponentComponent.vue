<template>
  <div class="text-start">
    <v-row>
      <v-col>
        <span class="font-weight-bold text-h6" v-text="item.name" ></span>
      </v-col>
    </v-row>
    <v-row dense class="my-1">
      <v-col cols="12" sm="6" md="3" lg="2" xl="1">
        <v-card flat color="primary" height="100%">説明</v-card>
      </v-col>
      <v-col>
        <v-card flat color="secondary" height="100%" v-text="item.description"></v-card>
      </v-col>
    </v-row>
    <v-row dense class="my-1">
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
    <v-row dense class="my-1">
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
                <v-card flat color="thirdry" height="100%"> 
                  <div v-for="item3, k in item2.params" :key="k">
                    引数{{ k+1 }}: {{ item3.name }} {{ item3.comment }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else>
        <v-card flat color="secondary" height="100%">イベント無し</v-card>
      </v-col>
    </v-row>
    <v-row dense class="my-1">
      <v-col cols="12" sm="6" md="3" lg="2" xl="1">
        <v-card flat color="primary" height="100%">子コンポーネント</v-card>
      </v-col>
      <v-col v-if="item.components.length > 0">
        <v-row v-for="item2, j in item.components" :key="j" dense>
          <v-col cols="12" sm="12" md="4" lg="4" xl="4">
            <v-card flat color="secondary" height="100%" v-text="item2"></v-card>
          </v-col>
          <v-col>
              <v-btn @click="$emit('goComponent', item2)"> コンポーネントへ移動 </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else>
        <v-card flat color="secondary" height="100%">子コンポーネント無し</v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue'
import list from '@/assets/components-list.json'
import licenses from '@/assets/licenses-diagram.json'
import { ComponentItem } from '@/common/types'

export default defineComponent({
  name: 'IndexView',
  props: {
    item: {
      type: Object as PropType<ComponentItem>,
        required: true
    }
  },
  emits: {
    mounted: () => true,
    goComponent: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      name: string) => true
  },
  setup (_, { emit }) {

    onMounted(() => {
      emit('mounted')
    })

    return {
      list,
      licenses
    }
  }
})
</script>