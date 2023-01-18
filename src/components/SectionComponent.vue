<template>
  <v-card v-if="editable" flat>
    <v-container flat class="ma-0 pa-0">
      <v-row v-if="!hideSectionTitle">
        <v-col cols="10" sm="10" md="10" lg="10" xl="10">
          <v-text-field
            v-model="title"
            label="説明文の見出し"
            hint="レビュー説明の見出しを設定してください"
            class="font-weight-bold"
            :rules="[rulesFunc.maxLen(sectionValidation.sectionTitleLen)]"
          />
        </v-col>
        <v-col class="ma-0 pa-0" cols="2" sm="2" md="2" lg="2" xl="2">
          <menu-button :items="additionalItems" @select="(v) => $emit('addObject', v, 0)">
            <template v-slot:button="{ open, props }">
              <v-btn @click="open" v-bind="props" icon flat>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </menu-button>
          <v-btn icon flat @click="$emit('delSection')">
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
          <tweet-embedder
            v-else-if="parag.type === 'twitterLink'"
            :model-value="parag.body"
            @update="$emit('updateParagBody', $event, index)"
            :rules="[rulesFunc.maxLen(sectionValidation.paragLinkLenMax)]"
          />
        </v-col>
        <v-col cols="2" sm="2" md="2" lg="2" xl="2" class="d-flex">
          <v-container fluid class="ma-0 pa-0">
            <v-row>
              <v-col class="ma-0 pa-0" cols="12" sm="12" md="6" lg="3" xl="2">
                <menu-button :items="hideSectionTitle ? additionalItems2 : additionalItems" @select="(v) => $emit('addObject', v, index + 1)">
                  <template v-slot:button="{ open, props }">
                    <v-btn @click="open" v-bind="props" icon flat>
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </menu-button>
              </v-col>
              <v-col class="ma-0 pa-0">
                <v-btn icon flat @click="$emit('delParag', index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
      <span v-if="parag.type === 'twitterLink'">
        <twitter-component :link="parag.body" />
      </span>
    </div>
  </v-card>
  <v-card v-else-if="displayType === 'summary'" class="no-break" flat>
    <span v-if="section.title" class="text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br v-if="section.title" />
    <span v-if="section.parags.length > 0">
      <span v-if="section.parags[0].type === 'text'" v-text="section.parags[0].body"></span>
      <span v-if="section.parags[0].type === 'twitterLink'">
        <twitter-component :link="section.parags[0].body" />
      </span>
    </span>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ReviewDisplayType, ReviewParagraphType, ReviewSection, reviewValidation, sectionValidation } from '@/common/review'
import TwitterComponent from '@/components/TwitterComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import TweetEmbedder from '@/components/TweetEmbedder.vue'
import { SelectObject } from '@/common/page'
import rules from '@/common/rules'

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
    text: 'Twitterリンク',
    value: 'twitterLink'
  }
]

export const additionalItems2: SelectObject<ReviewParagraphType | 'section', string>[] = [
  {
    text: '説明文',
    value: 'text'
  },
  {
    text: 'Twitterリンク',
    value: 'twitterLink'
  }
]

export default defineComponent({
  name: 'SectionComponent',
  components: {
    TwitterComponent,
    MenuButton,
    TweetEmbedder
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
  setup () {
    return {
      sectionValidation,
      rulesFunc: rules,
      reviewValidation,
      additionalItems,
      additionalItems2
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
