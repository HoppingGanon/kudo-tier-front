<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row v-if="!noHeader" class="align-center">
      <v-col class="d-flex">
        <div style="width: 100%">
          <review-header
            :icon-url="tier.userIconUrl"
            :disp-name="tier.userName"
            :user-id="tier.userId"
            :last-write-time="lastWriteTime"
          />
        </div>
        <div v-if="isSelf && displayType === 'summary' || displayType === 'list'">
          <menu-button :items="menuItems" @select="goThere($event)">
            <template v-slot:button="{ open, props }">
              <v-btn icon flat @click="open" v-bind="props">
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
            </template>
          </menu-button>
        </div>
      </v-col>
    </v-row>

    <v-row><v-col><v-container fluid class="ma-0 pa-0" :class="isLink ? 'cursor-pointer' : ''" @click="goTier">
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-h6" :class="displayType === 'summary' ? 'no-break' : ''"><b><span v-text="tier.name"></span></b></p>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="tier.imageUrl">
        <v-col>
          <v-img :src="imageUrl" width="100%" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <section-component
            :section="section"
            :display-type="displayType"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <v-card flat>
            <v-divider />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <tier-ranking
            :tier="tier"
            :reviews="tier.reviews"
            :params="tier.reviewFactorParams"
            :point-type="pointType"
            :no-menu-icon="noMenuIcon"
            @updatePointType="$emit('updatePointType', $event)"
            v-model:theme="theme"
            v-model:icon-size="iconSize"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <review-list
            :reviews="tier.reviews"
            :review-factor-params="tier.reviewFactorParams"
            :is-sample="isSample"
            :is-link="!isSample"
            :no-header="true"
            :no-change-point="true"
            :point-types="pointTypes"
            display-type="list"
          />
        </v-col>
      </v-row>
    </v-container></v-col></v-row>
  </v-container>

  <simple-dialog
    v-model="delDialog"
    title="Tierの削除"
    text="本当にTierを削除しますか？"
    submit-button-text="削除"
    @submit="deleteTier"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { IconSize, RankingTheme, ReviewDisplayType, ReviewFactorParam, ReviewPointType, ReviewSection, Tier } from '@/common/review'
import RestApi, { getImgSource, toastError } from '@/common/restapi'
import CommonApi from '@/common/commonapi'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierRanking from '@/components/TierRanking.vue'
import SectionComponent from '@/components/SectionComponent.vue'
import MenuButton from '@/components/MenuButton.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import router from '@/router'
import store from '@/store'
import { useToast } from 'vue-toast-notification'
import { iconSizeList, SelectObject } from '@/common/page'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export default defineComponent({
  name: 'TierComponent',
  components: {
    ReviewHeader,
    ReviewList,
    TierRanking,
    SectionComponent,
    MenuButton,
    SimpleDialog
  },
  props: {
    tier: {
      type: Object as PropType<Tier>,
      required: true
    },
    isSample: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    noHeader: {
      type: Boolean,
      default: false as boolean
    },
    noMenuIcon: {
      type: Boolean,
      default: false as boolean
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true,
    reload: () => true
  },
  setup (props, { emit }) {
    const toast = useToast()
    const display = useDisplay()

    const iconSize = ref('48px' as IconSize)

    onMounted(() => {
      if (display.xl.value) {
        iconSize.value = iconSizeList[1].value
      } else if (display.lg.value) {
        iconSize.value = iconSizeList[1].value
      } else if (display.md.value) {
        iconSize.value = iconSizeList[1].value
      } else if (display.sm.value) {
        iconSize.value = iconSizeList[2].value
      } else if (display.xs.value) {
        iconSize.value = iconSizeList[2].value
      }
    })

    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.tier.updatedAt, true)
    })
    const pointTypes = computed(() => {
      const objs: ReviewPointType[] = []
      props.tier.reviews.forEach(() => {
        objs.push(props.pointType)
      })
      return objs
    })

    const reviewFactorParamsList = computed(() => {
      const objs: ReviewFactorParam[][] = []
      props.tier.reviews.forEach(() => {
        objs.push(props.tier.reviewFactorParams)
      })
      return objs
    })

    const section = computed(() => {
      return {
        title: '',
        parags: props.tier.parags
      } as ReviewSection
    })

    const goTier = () => {
      if (props.isLink) {
        router.push(`/tier/${props.tier.tierId}`)
      }
    }

    const menuItems: SelectObject[] = [
      {
        value: 'add-review',
        text: 'レビューを追加',
        icon: 'mdi-book-plus-outline'
      },
      {
        value: 'edit',
        text: 'Tierを編集',
        icon: 'mdi-pencil-box-outline'
      },
      {
        value: 'add',
        text: '新しいTierを追加',
        icon: 'mdi-table-plus'
      },
      {
        value: 'delete',
        text: 'Tierを削除',
        icon: 'mdi-trash-can'
      }
    ]

    const deleteTier = () => {
      RestApi.deleteTier(props.tier.tierId).then(() => {
        toast.success('Tierを削除しました')
        emit('reload')
      }).catch((e) => {
        toastError(e, toast)
      })
    }

    const delDialog = ref(false)
    const goThere = (page: string) => {
      switch (page) {
        case 'add-review':
          router.push(`/review-settings-new/${props.tier.tierId}`)
          break
        case 'edit':
          router.push(`/tier-settings/${props.tier.tierId}`)
          break
        case 'add':
          router.push('/tier-settings-new')
          break
        case 'delete':
          delDialog.value = true
          break
      }
    }

    // 親コンポーネントからユーザーIDが来るため、再計算が必要
    const isSelf = computed(() => {
      return store.state.userId === props.tier.userId
    })

    const imageUrl = computed(() => getImgSource(props.tier.imageUrl))

    const theme = ref('light' as RankingTheme)

    return {
      iconSize,
      getImgSource,
      lastWriteTime,
      pointTypes,
      reviewFactorParamsList,
      section,
      goTier,
      menuItems,
      deleteTier,
      delDialog,
      goThere,
      isSelf,
      imageUrl,
      theme
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
