<template>
  <!-- セッション有効期限をチェックする -->
  <session-checker :is-going="false" />

  <error-card
    v-if="isNotFound"
    class="ma-3"
    comment="指定したIDのホーム画面は存在しません"
  />

  <v-container v-else>
    <v-row>
      <v-col>
        <profile-component
          :disp-name="dispName"
          :icon-url="iconUrl"
          :profile="profile"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-card>
          <v-toolbar color="primary">
            <v-card-title>
              <b>
                最新のReview
              </b>
            </v-card-title>
          </v-toolbar>
          <v-card
            class="scroll"
            flat
            min-height="360px"
            max-height="400px"
          >
            <review-list
              :reviews="reviews"
              :review-factor-params="group.reviewFactorParams"
              @update-point-type="updatePointType"
            />
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-toolbar color="primary">
            <v-card-title>
              <b>
                ピックアップTier
              </b>
            </v-card-title>
          </v-toolbar>
          <v-card
            class="scroll"
            flat
            min-height="360px"
            max-height="400px"
          >
            <tier-list
            />
          </v-card>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import restApi from '@/common/restapi'
import SessionChecker from '@/components/SessionChecker.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierList from '@/components/TierList.vue'
import ErrorCard from '@/components/ErrorCard.vue'
import { useRoute } from 'vue-router'
import { Review, ReviewGroup, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'HomeView',
  components: {
    ProfileComponent,
    SessionChecker,
    ErrorCard,
    ReviewList,
    TierList
  },
  setup () {
    const route = useRoute()

    const isNotFound = ref(false)
    const dispName = ref('')
    const profile = ref('')
    const iconUrl = ref('')

    onMounted(() => {
      if (route.params.id && typeof route.params.id === 'string') {
        // URIにIDが含まれている場合
        restApi.getUserData(route.params.id).then((res) => {
          dispName.value = res.data.name
          profile.value = res.data.profile
          iconUrl.value = res.data.iconUrl
        }).catch(() => {
          isNotFound.value = true
        })
      } else {
        // URIにIDが含まれていないうえ、セッションを持っていない場合
        isNotFound.value = true
      }
    })

    const groupOrg: ReviewGroup = {
      title: '',
      reviews: [],
      reviewPointType: 'score',
      reviewFactorParams: [
        {
          name: '年代',
          isPoint: false,
          weight: 0
        },
        {
          name: '100',
          isPoint: true,
          weight: 3
        },
        {
          name: '90',
          isPoint: true,
          weight: 3
        },
        {
          name: '80',
          isPoint: true,
          weight: 3
        },
        {
          name: '70',
          isPoint: true,
          weight: 3
        },
        {
          name: '60',
          isPoint: true,
          weight: 3
        },
        {
          name: '50',
          isPoint: true,
          weight: 3
        },
        {
          name: '40',
          isPoint: true,
          weight: 3
        },
        {
          name: '30',
          isPoint: true,
          weight: 3
        },
        {
          name: '20',
          isPoint: true,
          weight: 3
        },
        {
          name: '10',
          isPoint: true,
          weight: 3
        },
        {
          name: '0',
          isPoint: true,
          weight: 3
        },
        {
          name: '備考',
          isPoint: false,
          weight: 0
        }
      ],
      createAt: new Date(),
      updateAt: new Date()
    }

    const reviewsOrg: Review[] = [
      {
        userName: 'usernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        userId: 'b15857216ec62d4f322a1dfa15df526a764d174ceddd0bff',
        userIconUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
        title: 'このテスト映画は素晴らしいです',
        nameName: '作品名',
        name: 'テストムービー',
        reviewFactorParams: groupOrg.reviewFactorParams,
        reviewFactors: [
          {
            info: '1990年'
          },
          {
            point: 100
          },
          {
            point: 90
          },
          {
            point: 80
          },
          {
            point: 70
          },
          {
            point: 60
          },
          {
            point: 50
          },
          {
            point: 40
          },
          {
            point: 30
          },
          {
            point: 20
          },
          {
            point: 10
          },
          {
            point: 0
          },
          {
            info: '備考あああああああああ'
          }
        ],
        pointType: groupOrg.reviewPointType,
        sections: [
          {
            title: '最高のシーン',
            factors: [
              {
                type: 'text',
                body: '冒頭30秒からすでに最高の一言ですあああああああああああああああああああああああああああああああああ'
              },
              {
                type: 'twitterLink',
                body: 'https://twitter.com/hoppingganonapp/status/1589775062546415618'
              }
            ]
          },
          {
            title: 'セクション2',
            factors: [
              {
                type: 'text',
                body: 'body1'
              },
              {
                type: 'text',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaasdfgsdfgafgadsfgadsfgdfgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
              },
              {
                type: 'text',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaasdfgsdfgafgadsfgadsfgdfgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
              }
            ]
          }
        ],
        createAt: new Date('2022/07/10'),
        updateAt: new Date('2022/07/10')
      },
      {
        userName: 'username',
        userId: 'userid',
        userIconUrl: '',
        title: 'review2',
        nameName: '作品名',
        name: 'bbb',
        reviewFactorParams: groupOrg.reviewFactorParams,
        reviewFactors: [],
        pointType: groupOrg.reviewPointType,
        sections: [],
        createAt: new Date('2022/07/10'),
        updateAt: new Date('2022/07/10')
      }
    ]

    const reviews = ref(reviewsOrg)
    const group = ref(groupOrg)

    const updatePointType = (value: ReviewPointType, index: number) => {
      if (index >= 0 && index < reviews.value.length) {
        reviews.value[index].pointType = value
      }
    }

    return {
      isNotFound,
      dispName,
      profile,
      iconUrl,
      reviews,
      group,
      updatePointType
    }
  }
})
</script>

<style Modules>
.scroll {
  overflow-y: scroll;
}
</style>
