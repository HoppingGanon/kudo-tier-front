<template>
  <v-file-input
    :modelValue="imgFiles"
    @update:modelValue="updateFile"
    @click:clear="clearFile"
    :label="label"
    prepend-icon="mdi-camera"
    accept="image/png, image/jpeg"
  >
    <template>
      aaa
    </template>
    <template v-slot:append>
      <v-dialog v-model="cropMenu" persistent :fullscreen="true">
        <template v-slot:activator>
          <v-btn :disabled="imageUrl === ''" icon flat @click="openCropMenu">
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
            <v-btn icon flat @click="closeCrop">
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
              <v-col class="d-flex justify-center">
                <div :style="getCanvasSize()">
                  <vue-cropper
                    v-if="imageUrl !== ''"
                    class="ba-5"
                    ref="cropper"
                    :aspect-ratio="(aspectRatio <= 0 ? NaN : aspectRatio)"
                    :src="imageUrl"
                    dragMode="move"
                    :class="getCanvasSize()"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </template>
  </v-file-input>
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
    const preImgFiles = ref([] as File[])
    const imageUrl = ref('')

    const cropper = ref()

    const openCropMenu = () => {
      cropMenu.value = true
    }

    const updateFile = (v: File[]) => {
      if (v.length > 0) {
        preImgFiles.value = imgFiles.value
        imgFiles.value = v
        // 入力されたファイルをのURLを取得する
        imageUrl.value = base64api.getFileUrl(v[0])
        emit('updateFileUrl', imageUrl.value)
        openCropMenu()
      }
    }

    const clearFile = () => {
      preImgFiles.value.splice(0)
      imgFiles.value.splice(0)
      imageUrl.value = ''
      emit('updateFileUrl', '')
      emit('updateCroppedUrl', '')
    }

    const closeCrop = () => {
      imgFiles.value = preImgFiles.value
      cropMenu.value = false
    }

    const enterCrop = () => {
      cropMenu.value = false
      const canvas = cropper.value.getCroppedCanvas() as HTMLCanvasElement
      const url = canvas.toDataURL('image/jpeg')
      emit('updateCroppedUrl', url)
    }

    const getCanvasSize = () => {
      if (window.innerWidth < window.innerHeight - 100) {
        return 'canvas-size-w'
      } else {
        return 'canvas-size-h'
      }
    }

    return {
      cropMenu,
      imgFiles,
      imageUrl,
      openCropMenu,
      updateFile,
      clearFile,
      closeCrop,
      enterCrop,
      cropper,
      getCanvasSize
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");

.canvas-size-w {
  width: 100vw;
  height: 100vw;
}

.canvas-size-h {
  width: -webkit-calc(100vh - 100px);
  height: -webkit-calc(100vh - 100px);
}

</style>
