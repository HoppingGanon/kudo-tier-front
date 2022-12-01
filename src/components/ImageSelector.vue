<template>
  <v-container>
    <v-row>
      <v-col cols="10" sm="11" md="11" lg="11" xl="11">
        <v-file-input
          :modelValue="imgFiles"
          @update:modelValue="updateFile"
          :label="label"
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg"
        />
      </v-col>
      <v-col cols="2" sm="1" md="1" lg="1" xl="1">
        <v-dialog v-model="cropMenu" persistent>
          <template v-slot:activator="{ isActive, props}">
            <v-btn :disabled="imageUrl === ''" icon flat @click="cropMenu = true" v-on="isActive" v-bind="props">
              <v-icon>
                mdi-crop
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-toolbar color="secondary" dark>
              <v-card-title>
                画像のクリッピング
              </v-card-title>
              <v-spacer />
              <v-btn icon flat>
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col>
                  <vue-cropper
                    v-if="imageUrl !== ''"
                    class="ba-5"
                    ref="cropper"
                    :aspect-ratio="16 / 9"
                    :fixedBox="true"
                    :src="imageUrl"
                    containerStyle="height:75vh"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import base64api from '@/common/base64api'

export default defineComponent({
  name: 'ImageSelector',
  components: {
    VueCropper
  },
  props: {
    aspectRatio: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: '画像ファイルを選択してください'
    }
  },
  emits: {
    updateBase64: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () {
    const cropMenu = ref(false)
    const imgFiles = ref([] as File[])
    const imageUrl = ref('')

    const updateFile = (v: File[]) => {
      imgFiles.value = v
      if (v.length > 0) {
        // 入力されたファイルをBase64変換する
        imageUrl.value = base64api.getFileUrl(v[0])
        cropMenu.value = true
      }
    }

    return {
      cropMenu,
      imgFiles,
      imageUrl,
      updateFile
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
