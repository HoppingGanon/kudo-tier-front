<template>
  <div v-if="loading">
    <v-dialog :model-value="loading" :persistent="true" :fullscreen="true">
      <v-card class="d-flex align-center justify-center">
        <div style="width: 100%;" class="d-flex justify-center">
          <v-img src="@/assets/logo.png" width="128px" height="128px"></v-img><br />
        </div>
      </v-card>
    </v-dialog>
    <!-- 先に読み込んでキャッシュさせるという超ゴリ押しムーブを実行-->
    <v-img src="@/assets/welcome/mobile.png" @load="onLoad('mobile')" style="opacity: 0;"></v-img>
    <v-img src="@/assets/welcome/tierBg.png" @load="onLoad('tierBg')" style="opacity: 0;"></v-img>
    <v-img src="@/assets/welcome/pc.png" @load="onLoad('pc')" style="opacity: 0;"></v-img>
    <v-img src="@/assets/welcome/reviewBg.png" @load="onLoad('reviewBg')" style="opacity: 0;"></v-img>
    <v-img src="@/assets/welcome/share.png" @load="onLoad('share')" style="opacity: 0;"></v-img>
    <v-img src="@/assets/welcome/shareBg.jpg" @load="onLoad('shareBg')" style="opacity: 0;"></v-img>
  </div>
  <v-carousel
    :height="carouselHeight"
    :width="carouselHeight"
    :hide-delimiter-background="true"
    :show-arrows="false"
    :cycle="true"
    :interval="10000"
  >
    <v-carousel-item>
      <div class="carousel-item-1-frame">
        <div class="carousel-item-1-image" :style="carouselImage1Width">
          <v-img
            src="@/assets/welcome/mobile.png"
            height="100%"
          ></v-img>
        </div>
        <div class="carousel-item-1-text">
          <div class="pa-5" style="width: 70%;">
            <p :class="titleClass">
              <span>
                独断と偏見のTierを作ろう
              </span>
            </p>
            <br />
            <p :class="textClass">
              <span>
                ようこそ、TierReviewsへ。
              </span>
              <br />
              <span>
                TierReviewsはスマホやパソコンからレビューを投稿して、その情報をTierとして共有できるサービスです。
              </span>
            </p>
          </div>
        </div>
      </div>
    </v-carousel-item>
    <v-carousel-item>
      <div class="carousel-item-2-frame">
        <div class="carousel-item-2-image pc" :style="carouselImage2Width">
          <v-img
            src="@/assets/welcome/pc.png"
          ></v-img>
        </div>
        <div class="carousel-item-2-text d-flex justify-end">
          <div class="pa-5" style="width: 70%;">
            <p :class="titleClass">
              <span>
                マニアックなレビューを書こう
              </span>
            </p>
            <br />
            <p :class="textClass">
              <span>
                TierReviewsは数値化された情報をグラフィカルなインターフェースで共有できます。
              </span>
              <br />
              <span>
                文章だけでは表せない評価や画像だけでは伝えられない情報を表現してみましょう。
              </span>
            </p>
          </div>
        </div>
      </div>
    </v-carousel-item>
    <v-carousel-item>
      <div class="carousel-item-3-frame">
        <div class="carousel-item-3-image" :style="carouselImage3Width">
          <v-img
            src="@/assets/welcome/share.png"
          ></v-img>
        </div>
        <div class="carousel-item-3-text">
          <div class="pa-5" style="width: 70%;">
            <p :class="titleClass">
              <span>
                評価をシェアしよう
              </span>
            </p>
            <br />
            <p :class="textClass">
              <span>
                TierReviewsで作成したTierは他のサービスにシェアできます。
              </span>
              <br />
              <span>
                投稿はTierReviewsに登録していない人でもシェア・閲覧ができるので、より多くの人に投稿を見てもらいましょう。
              </span>
            </p>
          </div>
        </div>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from 'vue'
import vuetify from '@/plugins/vuetify'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export default defineComponent({
  name: 'WelcomeCarousel',
  setup () {
    const display = useDisplay()
    const primaryStyle = `background-color: ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary};`
    const secondaryStyle = `background-color: ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.secondary};`
    const thirdryStyle = `background-color: ${vuetify.theme.themes._rawValue.myCustomLightTheme.colors.thirdry};`

    const loadingsArrray = [
      'mobile',
      'tierBg',
      'pc',
      'reviewBg',
      'share',
      'shareBg'
    ]
    const loadings: Ref<{ [name: typeof loadingsArrray[number]]: boolean }> = ref({
      mobile: true,
      tierBg: true,
      pc: true,
      reviewBg: true,
      share: true,
      shareBg: true
    })
    const loading = ref(true)

    onMounted(() => {
      setTimeout(() => {
        // 時間内に読み込みが完了できなかった場合は強制的にロード終了
        loading.value = false
      }, 2000)
    })

    const onLoad = (v: typeof loadingsArrray[number]) => {
      loadings.value[v] = false
      if (Object.keys(loadings.value).filter((v) => loadings.value[v]).length === 0) {
        loading.value = false
      }
    }

    const carouselHeight = computed(() => {
      let height = 480
      if (display.xl.value) {
        height = 480
      } else if (display.lg.value) {
        height = 440
      } else if (display.md.value) {
        height = 400
      } else if (display.sm.value) {
        height = 360
      } else if (display.xs.value) {
        height = 320
      }
      return height
    })

    return {
      primaryStyle,
      secondaryStyle,
      thirdryStyle,
      carouselHeight,
      loadings,
      loading,
      onLoad,
      carouselImage1Width: computed(() => `width: ${carouselHeight.value * 1.2}px`),
      carouselImage2Width: computed(() => `width: ${carouselHeight.value * 1.2}px`),
      carouselImage3Width: computed(() => `width: ${carouselHeight.value * 1.1}px`),
      titleClass: computed(() => (display.smAndDown.value ? 'text-h6' : display.md.value ? 'text-h5' : 'text-h4') + ' white--text'),
      textClass: computed(() => (display.smAndDown.value ? 'text-subtitle-2' : display.md.value ? 'text-subtitle-1' : 'text-h6') + ' white--text')
    }
  }
})
</script>

<style scoped>

.white--text {
  color: white;
}

@keyframes carousel-item-1-frame-anime {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.carousel-item-1-frame {
  background-image: url("@/assets/welcome/tierBg.png");
  background-size: cover;
  overflow: hidden;
  backdrop-filter: blur(5px);

  animation:carousel-item-1-frame-anime 32s infinite;

  background-color: white;

  width: 100%;
  height: 100%;
}

.carousel-item-1-frame:before {
  /**
  参考 CSSで背景画像だけにブラー(ぼかし)エフェクトを加える方法
  https://designcolor-web.com/css-blur-effects-background/
   */
  content: '';
  background: inherit;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}

@keyframes carousel-item-1-image-anime {
  0% {
    margin-top: 30px;
    opacity: 0%;
  }
  15% {
    margin-top: 30px;
    opacity: 0%;
  }
  90% {
    opacity: 50%;
  }
  100% {
    margin-top: 0px;
    opacity: 100%;
  }
}

.carousel-item-1-image {
  position: absolute;
  display: block;
  height: 100%;
  width: 100%;
  animation:carousel-item-1-image-anime 0.5s linear;
  right: 0%;
  bottom: 0px;
  filter: drop-shadow(5px 5px 5px #FFF0F7);
}

@keyframes carousel-item-1-text-anime {
  0% {
    opacity: 0%;
  }
  66.7% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}

.carousel-item-1-text {
  position: absolute;
  display: block;
  height: 100%;
  min-width: 400px;
  width: 70%;
  animation:carousel-item-1-text-anime 2s linear;
  left: 0%;
  margin-top: 0%;

  background: linear-gradient(to right, rgb(240, 150, 200, 0.9), rgb(240, 150, 200, 0.65) 60%, rgb(240, 150, 200, 0) 90%, rgb(0, 0, 0, 0) 100%);
}

@keyframes carousel-item-2-frame-anime {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.carousel-item-2-frame {
  background-image: url("@/assets/welcome/reviewBg.png");
  background-size: cover;
  overflow: hidden;
  backdrop-filter: blur(5px);

  animation:carousel-item-2-frame-anime 32s infinite;

  background-color: white;

  width: 100%;
  height: 100%;
}

.carousel-item-2-frame:before {
  /**
  参考 CSSで背景画像だけにブラー(ぼかし)エフェクトを加える方法
  https://designcolor-web.com/css-blur-effects-background/
   */
  content: '';
  background: inherit;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}

@keyframes carousel-item-2-image-anime {
  0% {
  margin-top: 80px;
    opacity: 0%;
  }
  15% {
  margin-top: 80px;
    opacity: 0%;
  }
  90% {
    opacity: 50%;
  }
  100% {
  margin-top: 30px;
    opacity: 100%;
  }
}

.carousel-item-2-image {
  position: absolute;
  display: block;
  height: 120%;
  animation:carousel-item-2-image-anime 0.5s linear;
  left: 5%;
  margin-top: 30px;
  filter: drop-shadow(5px 5px 5px #FFF0F7);
}

@keyframes carousel-item-2-text-anime {
  0% {
    opacity: 0%;
  }
  66.7% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}

.carousel-item-2-text {
  position: absolute;
  display: block;
  height: 100%;
  min-width: 400px;
  width: 70%;
  animation:carousel-item-2-text-anime 2s linear;
  right: 0%;
  margin-top: 0%;

  background: linear-gradient(to left, rgb(240, 150, 200, 0.9), rgb(240, 150, 200, 0.65) 60%, rgb(240, 150, 200, 0) 90%, rgb(0, 0, 0, 0) 100%);
}

@keyframes carousel-item-3-frame-anime {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.carousel-item-3-frame {
  background-image: url("@/assets/welcome/shareBg.jpg");
  background-size: cover;
  overflow: hidden;
  backdrop-filter: blur(5px);

  animation:carousel-item-3-frame-anime 32s infinite;

  background-color: white;

  width: 100%;
  height: 100%;
}

.carousel-item-3-frame:before {
  /**
  参考 CSSで背景画像だけにブラー(ぼかし)エフェクトを加える方法
  https://designcolor-web.com/css-blur-effects-background/
   */
  content: '';
  background: inherit;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}

@keyframes carousel-item-3-image-anime {
  0% {
    margin-top: 30px;
    opacity: 0%;
  }
  15% {
    margin-top: 30px;
    opacity: 0%;
  }
  90% {
    opacity: 50%;
  }
  100% {
    margin-top: 0px;
    opacity: 100%;
  }
}

.carousel-item-3-image {
  position: absolute;
  display: block;
  height: 200%;
  animation:carousel-item-3-image-anime 0.5s linear;
  right: 5%;
  image-rendering: crisp-edges;
  filter: drop-shadow(5px 5px 5px #FFF0F7);
}

@keyframes carousel-item-3-text-anime {
  0% {
    opacity: 0%;
  }
  66.7% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}

.carousel-item-3-text {
  position: absolute;
  display: block;
  height: 100%;
  min-width: 400px;
  width: 70%;
  animation:carousel-item-3-text-anime 2s linear;
  left: 0%;
  margin-top: 0%;

  background: linear-gradient(to right, rgb(240, 150, 200, 0.9), rgb(240, 150, 200, 0.65) 60%, rgb(240, 150, 200, 0) 90%, rgb(0, 0, 0, 0) 100%);
}
</style>
