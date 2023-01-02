<template>
  <v-container>
    <v-row>
      <v-col cols="10" sm="11" md="11" lg="11" xl="11">
        <v-file-input
          :modelValue="imgFiles"
          @update:modelValue="updateFile"
          @click:clear="clearFile"
          :label="label"
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg"
        />
      </v-col>
      <v-col cols="2" sm="1" md="1" lg="1" xl="1">
        <v-dialog v-model="cropMenu" persistent :fullscreen="$vuetify.display.mobile">
          <template v-slot:activator>
            <v-btn :disabled="imageUrl === ''" icon flat @click="cropMenu = true">
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
              <v-btn icon flat @click="(cropMenu = false)">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
              <v-btn icon flat @click="enterCrop">
                <v-icon>
                  mdi-check
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
                    :aspect-ratio="(aspectRatio <= 0 ? NaN : aspectRatio)"
                    :src="imageUrl"
                    dragMode="move"
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
    updateFileUrl: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    updateCroppedUrl: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const cropMenu = ref(false)
    const imgFiles = ref([] as File[])
    const imageUrl = ref('')

    const updateFile = (v: File[]) => {
      if (v.length > 0) {
        imgFiles.value = v
        // 入力されたファイルをのURLを取得する
        imageUrl.value = base64api.getFileUrl(v[0])
        emit('updateFileUrl', imageUrl.value)
        cropMenu.value = true
      }
    }

    const clearFile = () => {
      imgFiles.value.splice(0)
      imageUrl.value = ''
      emit('updateFileUrl', '')
      emit('updateCroppedUrl', '')
    }

    const cropper = ref()

    const enterCrop = () => {
      cropMenu.value = false
      const canvas = cropper.value.getCroppedCanvas() as HTMLCanvasElement
      const url = canvas.toDataURL('image/jpeg')
      emit('updateCroppedUrl', url)
    }

    return {
      cropMenu,
      imgFiles,
      imageUrl,
      updateFile,
      clearFile,
      enterCrop,
      cropper
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
