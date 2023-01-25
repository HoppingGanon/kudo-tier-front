<template>
  <v-card v-if="editable" flat>
    <v-container flat class="ma-0 pa-0">
      <v-row>
        <v-col cols="10" sm="10" md="10" lg="10" xl="10">
          <v-text-field
            v-if="!hideSectionTitle"
            v-model="title"
            label="説明文の見出し"
            hint="レビュー説明の見出しを設定してください"
            class="font-weight-bold"
            :rules="[rulesFunc.maxLen(sectionValidation.sectionTitleLen)]"
          />
        </v-col>
        <v-col class="ma-0 pa-0" cols="2" sm="2" md="2" lg="2" xl="2">
          <menu-button :items="items" @select="(v) => $emit('addObject', v, 0)">
            <template v-slot:button="{ open, props }">
              <v-btn @click="open" v-bind="props" icon flat>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </menu-button>
          <v-btn v-if="!hideSectionTitle" icon flat @click="$emit('delSection')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        v-for="parag, index in section.parags"
        :key="index"
      >
        <v-col cols="1" sm="1" md="1" lg="1" xl="1">
        </v-col>
        <v-col cols="9" sm="9" md="9" lg="9" xl="9">
          <v-textarea
            v-if="parag.type === 'text'"
            :model-value="parag.body"
            @update:model-value="$emit('updateParagBody', $event, index)"
            label="説明文"
            hint="Tierの説明文を入力してください"
            :rules="[rulesFunc.maxLen(sectionValidation.paragTextLenMax)]"
          />
          <link-editor
            v-else-if="parag.type === 'serviceLink'"
            :model-value="parag.body"
            @update="$emit('updateParagBody', $event, index)"
            :rules="[rulesFunc.maxLen(sectionValidation.paragLinkLenMax)]"
          />
          <v-container v-else-if="parag.type === 'imageLink'">
            <v-row>
              <v-col cols="12" sm="12" md="8" lg="7" xl="6">
                <image-selector
                  label="画像ファイルを指定してください"
                  @update-cropped-url="$emit('updateParagBody', $event, index)"
                />
              </v-col>
              <v-col cols="8" sm="6" md="5" lg="4" xl="4">
                <v-img
                  v-if="parag.body"
                  :src="getImgSource(parag.body)"
                  :max-height="imgHeight"
                />
                <v-card v-else height="100%" class="dahed-box" flat>
                  画像を選択するとここに表示されます
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="2" sm="2" md="2" lg="2" xl="2" class="d-flex align-end">
          <v-container fluid class="ma-0 pa-0">
            <v-row>
              <v-col class="ma-0 pa-0" cols="12" sm="12" md="6" lg="3" xl="2">
                <menu-button :items="items" @select="(v) => $emit('addObject', v, index + 1)">
                  <template v-slot:button="{ open, props }">
                    <v-btn @click="open" v-bind="props" icon flat>
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </menu-button>
              </v-col>
              <v-col class="ma-0 pa-0"  cols="12" sm="12" md="6" lg="3" xl="2">
                <v-btn icon flat @click="$emit('delParag', index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
          <v-divider class="ml-5 mr-5" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-card v-else-if="displayType === 'list' || displayType === 'all'" flat>
    <span v-if="section.title" class="break-word text-subtitle-1 font-weight-bold" v-text="section.title">
    </span>
    <br v-if="section.title" />
    <div class="mt-1" v-for="parag,index in section.parags" :key="index">
      <span v-if="parag.type === 'text'">
        <span v-for="str, index2 of parag.body.split('\n')" :key="index2">
          <span class="break-word" v-text="str"></span>
          <br />
        </span>
      </span>
      <span v-if="parag.type === 'serviceLink'">
        <link-component :link="parag.body" />
      </span>
      <v-img
        v-if="parag.type === 'imageLink' && parag.body != ''"
        :src="getImgSource(parag.body)"
        :max-height="imgHeight"
      ></v-img>
    </div>
  </v-card>
  <v-card v-else-if="displayType === 'summary'" class="no-break" flat>
    <span v-if="section.title" class="text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br v-if="section.title" />
    <span v-if="section.parags.length > 0">
      <span v-if="section.parags[0].type === 'text'" v-text="section.parags[0].body"></span>
      <span v-if="section.parags[0].type === 'serviceLink'">
        <link-component :link="section.parags[0].body" />
      </span>
      <!--v-img
        v-if="section.parags[0].type === 'imageLink' && section.parags[0].body != ''"
        :src="getImgSource(section.parags[0].body)"
        :max-height="imgHeight"
      ></v-img-->
    </span>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ReviewDisplayType, ReviewParagraphType, ReviewSection, reviewValidation, sectionValidation } from '@/common/review'
import LinkComponent from '@/components/LinkComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import LinkEditor from '@/components/LinkEditor.vue'
import ImageSelector from '@/components/ImageSelector.vue'
import { SelectObject } from '@/common/page'
import rules from '@/common/rules'
import { getImgSource } from '@/common/restapi'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export const additionalItems: SelectObject<ReviewParagraphType | 'section', string>[] = [
  {
    text: '見出し',
    value: 'section'
  },
  {
    text: '説明文',
    value: 'text'
  },
  {
    text: '画像',
    value: 'imageLink'
  },
  {
    text: 'リンク',
    value: 'serviceLink'
  }
]

export const additionalItems2: SelectObject<ReviewParagraphType | 'section', string>[] = [
  {
    text: '説明文',
    value: 'text'
  },
  {
    text: '画像',
    value: 'imageLink'
  },
  {
    text: 'リンク',
    value: 'serviceLink'
  }
]

export default defineComponent({
  name: 'SectionComponent',
  components: {
    LinkComponent,
    MenuButton,
    LinkEditor,
    ImageSelector
  },
  props: {
    section: {
      type: Object as PropType<ReviewSection>,
      required: true
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      default: 'all'
    },
    editable: {
      type: Boolean,
      default: false
    },
    hideSectionTitle: {
      type: Boolean,
      dafault: false
    }
  },
  emits: {
    updateTitle: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, i: number) => true,
    addObject: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewParagraphType | 'section', i: number) => true,
    delParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      i: number) => true,
    delSection: () => true
  },
  computed: {
    title: {
      get () : string {
        return this.section.title
      },
      set (v: string) {
        this.$emit('updateTitle', v)
      }
    }
  },
  setup (props) {
    const display = useDisplay()
    return {
      sectionValidation,
      rulesFunc: rules,
      reviewValidation,
      items: computed(() => props.hideSectionTitle ? additionalItems2 : additionalItems),
      getImgSource,
      imgHeight: computed(() => {
        if (display.xs) {
          return Math.max(360, display.height.value / 2)
        } else if (display.sm) {
          return Math.max(360, display.height.value / 2)
        } else if (display.md) {
          return Math.max(360, display.height.value / 2)
        } else if (display.lg) {
          return Math.max(360, display.height.value / 2)
        } else if (display.xl) {
          return Math.max(360, display.height.value / 2)
        }
        return Math.max(360, display.height.value / 2)
      })
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
