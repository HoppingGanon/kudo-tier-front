<template>
  <div style="display: none;">
    <v-file-input
      ref="fileInputRef"
      :modelValue="imgFiles"
      @update:modelValue="updateFile"
      :label="label"
      prepend-icon="mdi-camera"
      accept="image/png, image/jpeg"
    />
  </div>

  <div v-if="croppedUrl" class="d-flex">
    <div class="image-style" :style="imgMaxHeight ? `max-height: ${imgMaxHeight};` : ''">
      <slot name="image">
        <v-img :src="croppedUrlProxy">
        </v-img>
      </slot>
    </div>
    <div class="d-flex flex-column">
      <v-btn flat icon @click="clearFile" color="#FFF0">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <v-btn flat icon @click="inputFile" color="#FFF0">
        <v-icon>
          mdi-folder-open-outline
        </v-icon>
      </v-btn>
      <v-btn icon flat @click="openCropMenu" color="#FFF0">
        <v-icon>
          mdi-crop
        </v-icon>
      </v-btn>
    </div>
  </div>
  <div v-else class="dahed-box pa-5">
    <div>
      <v-btn flat icon @click="clearFile" color="#FFF0">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </div>
    <div>
      <span v-text="label"></span>
    </div>
    <v-btn @click="inputFile" color="primary">画像を開く</v-btn>
  </div>

  <v-dialog v-model="cropMenu" persistent :fullscreen="true">
    <!-- 画像の切り取りダイアログ -->
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
            <div :style="canvasSize">
              <vue-cropper
                class="ba-5"
                ref="cropper"
                :aspect-ratio="(aspectRatio <= 0 ? NaN : aspectRatio)"
                :src="fileUrlProxy"
                dragMode="move"
                :class="canvasSize"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import base64api from '@/common/base64api'
import { computed } from '@vue/reactivity'
import { getImgSource } from '@/common/restapi'

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
    },
    croppedUrl: {
      type: String,
      default: ''
    },
    imgMaxHeight: {
      type: String,
      default: ''
    }
  },
  emits: {
    /** クロップ前のURL */
    updateFileUrl: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    /** クロップ後のURL */
    updateCroppedUrl: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    /** 画像のクリア後に呼ばれる処理 */
    clear: () => true
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props, { emit }) {
    const cropMenu = ref(false)
    /** Inpuut時の受け皿 */
    const imgFiles = ref([] as File[])
    /** Inpuutをキャンセルしたときに前回分に戻すための退避 */
    const preImgFiles = ref([] as File[])
    const cropper = ref()
    const fileInputRef = ref()
    const fileUrl = ref('')
    const croppedUrlProxy = computed(() => {
      if (props.croppedUrl !== '') {
        return getImgSource(props.croppedUrl)
      } else {
        return ''
      }
    })
    const fileUrlProxy = computed(() => {
      if (fileUrl.value !== '') {
        return getImgSource(fileUrl.value)
      } else {
        return getImgSource(props.croppedUrl)
      }
    })

    const openCropMenu = () => {
      if (!fileUrl.value) {
        // ファイルのURLが空ならcroppedUrlを入れる
        fileUrl.value = props.croppedUrl
      }
      cropMenu.value = true
    }

    /** ファイルを開くボタンをクリックした際にv-file-inputのクリックイベントを起こす */
    const inputFile = () => {
      if (fileInputRef.value) {
        fileInputRef.value.click()
      }
    }

    const updateFile = (v: File[]) => {
      if (v.length > 0) {
        preImgFiles.value.splice(0)
        preImgFiles.value = imgFiles.value
        imgFiles.value = v
        // 入力されたファイルをのURLを取得する
        fileUrl.value = base64api.getFileUrl(v[0])
        emit('updateFileUrl', base64api.getFileUrl(v[0]))
        openCropMenu()
      }
    }

    const clearFile = () => {
      preImgFiles.value.splice(0)
      imgFiles.value.splice(0)
      fileUrl.value = ''
      emit('updateFileUrl', '')
      emit('updateCroppedUrl', '')
      emit('clear')
    }

    const closeCrop = () => {
      imgFiles.value = preImgFiles.value
      cropMenu.value = false
      emit('updateCroppedUrl', props.croppedUrl)
    }

    const enterCrop = () => {
      cropMenu.value = false
      const canvas = cropper.value.getCroppedCanvas() as HTMLCanvasElement
      const dataurl = canvas.toDataURL('image/jpeg')
      emit('updateCroppedUrl', dataurl)
    }

    const canvasSize = computed(() => {
      if (window.innerWidth < window.innerHeight - 100) {
        return 'canvas-size-w'
      } else {
        return 'canvas-size-h'
      }
    })

    return {
      cropMenu,
      imgFiles,
      cropper,
      canvasSize,
      fileInputRef,
      croppedUrlProxy,
      fileUrlProxy,
      openCropMenu,
      inputFile,
      updateFile,
      clearFile,
      closeCrop,
      enterCrop
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

.image-style {
  width: 100%;
}

</style>
