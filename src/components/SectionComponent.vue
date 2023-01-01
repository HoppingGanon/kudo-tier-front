<template>
  <v-card v-if="editable" flat>
    <v-container flat class="ma-0 pa-0">
      <v-row>
        <v-col cols="8" sm="9" md="10" lg="10" xl="10">
          <v-text-field
            v-model="title"
            label="見出し"
            hint="レビュー説明の見出しを設定してください"
            class="font-weight-bold"
          />
        </v-col>
        <v-col cols="4" sm="3" md="2" lg="2" xl="2">
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
        <v-col cols="7" sm="8" md="9" lg="9" xl="9">
          <v-textarea
            v-if="parag.type === 'text'"
            :model-value="parag.body"
            @update:model-value="$emit('updateParagBody', $event, index)"
            label="説明文"
            hint="Tierの説明文を入力してください"
          />
          <tweet-embedder
            v-else-if="parag.type === 'twitterLink'"
            :model-value="parag.body"
            @update="$emit('updateParagBody', $event, index)"
            :rules="[rulesFunc.required(' 埋め込みツイートが不要な場合は、空白のままにせず右側の×マークで削除してください'), rulesFunc.maxLen(reviewRules.paragLinkLenMax)]"
          />
        </v-col>
        <v-col cols="4" sm="3" md="2" lg="2" xl="2">
          <menu-button :items="additionalItems" @select="(v) => $emit('addObject', v, index + 1)">
            <template v-slot:button="{ open, props }">
              <v-btn @click="open" v-bind="props" icon flat>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </menu-button>
          <v-btn icon flat @click="$emit('delParag', index)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-card v-else-if="displayType === 'all'" flat>
    <span v-if="section.title" class="break-word text-subtitle-1">
      <span v-text="section.title"></span>
    </span>
    <br v-if="section.title" />
    <span class="break-word" v-for="factor,index in section.parags" :key="index">
      <span v-if="factor.type === 'text'" v-text="factor.body"></span>
      <span v-if="factor.type === 'twitterLink'">
        <twitter-component :link="factor.body" />
      </span>
      <br v-if="index !== (section.parags.length - 1)" />
    </span>
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
import { ReviewDisplayType, ReviewParagraphType, ReviewSection, reviewRules } from '@/common/review'
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
      additionalItems,
      rulesFunc: rules,
      reviewRules: reviewRules
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
