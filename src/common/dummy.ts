import { UserData } from './restapi'
import { Tier, Review } from './review'

export const emptyTier: Tier = {
  tierId: '',
  userName: '',
  userId: '',
  userIconUrl: '',
  pointType: 'stars',
  name: '',
  imageUrl: '',
  parags: [],
  reviews: [],
  reviewFactorParams: [],
  createdAt: new Date(),
  updatedAt: new Date()
}

export const emptyReviwew: Review = {
  reviewId: '',
  tierId: '',
  userName: '',
  userId: '',
  userIconUrl: '',
  title: '',
  name: '',
  iconUrl: '',
  reviewFactors: [],
  pointType: 'stars',
  sections: [],
  createdAt: new Date(),
  updatedAt: new Date()
}

export const emptyUser: UserData = {
  userId: '',
  name: '',
  profile: '',
  iconUrl: '',
  twitterName: '',
  tierCount: 0,
  reviewCount: 0
}

export const tier: Tier = {
  tierId: 'bbb',
  userName: 'usernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  userId: 'b15857216ec62d4f322a1dfa15df526a764d174ceddd0bff',
  userIconUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
  pointType: 'stars',
  name: '映画ランキング',
  imageUrl: 'https://placehold.jp/800x240.png',
  parags: [
    {
      type: 'text',
      body: 'ティアの説明'
    }
  ],
  reviews: [],
  reviewFactorParams: [
    {
      name: '年代',
      isPoint: false,
      weight: 0,
      index: 1
    },
    {
      name: 'アクション要素',
      isPoint: true,
      weight: 3,
      index: 2
    },
    {
      name: 'コメディ要素',
      isPoint: true,
      weight: 3,
      index: 3
    },
    {
      name: '主人公の魅力',
      isPoint: true,
      weight: 3,
      index: 4
    },
    {
      name: '敵対組織の魅力',
      isPoint: true,
      weight: 3,
      index: 5
    },
    {
      name: '60',
      isPoint: true,
      weight: 3,
      index: 6
    },
    {
      name: '50',
      isPoint: true,
      weight: 3,
      index: 7
    },
    {
      name: '40',
      isPoint: true,
      weight: 3,
      index: 8
    },
    {
      name: '30',
      isPoint: true,
      weight: 3,
      index: 9
    },
    {
      name: '20',
      isPoint: true,
      weight: 3,
      index: 10
    },
    {
      name: '10',
      isPoint: true,
      weight: 3,
      index: 11
    },
    {
      name: '0',
      isPoint: true,
      weight: 3,
      index: 12
    },
    {
      name: '備考',
      isPoint: false,
      weight: 0,
      index: 13
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
}

export const reviews: Review[] = [
  {
    reviewId: 'aaa',
    tierId: 'bbb',
    userName: 'usernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    userId: 'b15857216ec62d4f322a1dfa15df526a764d174ceddd0bff',
    userIconUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    title: 'このテスト映画は素晴らしいです',
    name: 'テストムービー',
    iconUrl: 'https://placehold.jp/256x256.png',
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
    pointType: 'point',
    sections: [
      {
        title: '最高のシーン',
        parags: [
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
        parags: [
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
    createdAt: new Date('2022/07/10'),
    updatedAt: new Date('2022/07/10')
  },
  {
    reviewId: 'bbb',
    tierId: 'bbb',
    userName: 'username',
    userId: 'userid',
    userIconUrl: '',
    title: 'review2',
    name: 'bbb',
    iconUrl: 'https://placehold.jp/240x240.png',
    reviewFactors: [
      {
        info: '1991年'
      },
      {
        point: 0
      },
      {
        point: 10
      },
      {
        point: 20
      },
      {
        point: 30
      },
      {
        point: 40
      },
      {
        point: 50
      },
      {
        point: 60
      },
      {
        point: 70
      },
      {
        point: 80
      },
      {
        point: 90
      },
      {
        point: 100
      },
      {
        info: '備考あああああああああ'
      }
    ],
    pointType: 'point',
    sections: [],
    createdAt: new Date('2022/07/10'),
    updatedAt: new Date('2022/07/10')
  }
]

tier.reviews = reviews

export const tiers = [
  tier,
  tier,
  tier
]
