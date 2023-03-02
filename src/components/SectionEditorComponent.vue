<template>
  <v-container class="ma-0 pa-0" fulid>
    <v-row>
      <v-col>
        <editor-tools :floatingStyle="$vuetify.display.mobile" />
      </v-col>
    </v-row>
    <v-row v-for="section, i of sections" :key="i">
      <v-col>
        <div class="bordered-box" :class="selSection === i ? 'bordered-box-focus' : 'bordered-box-no-focus'">
          <auto-text-area
            :model-value="section.title"
            @update:model-value="(v) => $emit('updateSectionTitle', v, i)"
            class="font-weight-bold"
            :multi-lines="false"
            title="説明の見出し"
            :no-outline="true"
            @focusin="() => focusinProxy(i, -1)"
            @focusout="() => focusoutProxy(i, -1)"
          />
          <v-divider></v-divider>
          <parags-editor-component
            :parags="section.parags"
            @update:parags="(v) => $emit('update:parags', v, i)"
            @update-parag-body="(v, j) => $emit('updateParagBody', v, i, j)"
            @add-parag="(v, j) => $emit('updateParagBody', v, i, j)"
            @del-parag="(j) => $emit('delParag', i, j)"
            @focusin="(j) => focusinProxy(i, j)"
            @focusout="(j) => focusoutProxy(i, j)"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewParagraph, ReviewParagraphType, ReviewSection } from '@/common/review'
import { defineComponent, PropType, ref } from 'vue'
import ParagsEditorComponent from '@/components/ParagsEditorComponent.vue'
import AutoTextArea from '@/components/AutoTextArea.vue'
import EditorTools from '@/components/EditorTools.vue'

export default defineComponent({
  name: 'SectionEditorComponent',
  components: {
    ParagsEditorComponent,
    AutoTextArea,
    EditorTools
  },
  props: {
    sections: {
      type: Object as PropType<ReviewSection[]>,
      required: true
    }
  },
  emits: {
    updateSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewSection, sectionIndex: number) => true,
    updateSectionTitle: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, sectionIndex: number) => true,
    'update:parags': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: ReviewParagraph[], sectionIndex: number) => true,
    updateParagBody: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string, sectionIndex: number, paragIndex: number) => true,
    addSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number) => true, //, paragIndex: number
    addParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paragType: ReviewParagraphType, sectionIndex: number, paragIndex: number) => true,
    delParag: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    delSection: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number) => true,
    focusin: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true,
    focusout: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sectionIndex: number, paragIndex: number) => true
  },
  setup () {
    const selSection = ref(-1)
    const selParag = ref(-1)
    const focusinProxy = (sectionIndex: number, paragIndex: number) => {
      selSection.value = sectionIndex
      selParag.value = paragIndex
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const focusoutProxy = (sectionIndex: number, paragIndex: number) => {
      selSection.value = -1
      selParag.value = -1
    }

    return {
      selSection,
      selParag,
      focusinProxy,
      focusoutProxy
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.bordered-box {
  outline: none;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  padding: 4px;
  transition: all 0.25s;
}
.bordered-box-focus {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-thirdry));
}
.bordered-box-no-focus {
  border-color: #CCC;
  background-color: rgba(var(--v-theme-thirdry), 0.5);
}

</style>
