import { Tier, Review } from './review'

export const tier: Tier = {
  tierId: 'aaa',
  userName: 'usernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  userId: 'b15857216ec62d4f322a1dfa15df526a764d174ceddd0bff',
  userIconUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
  pointType: 'stars',
  name: '映画ランキング',
  factors: [
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
      weight: 0
    },
    {
      name: 'アクション要素',
      isPoint: true,
      weight: 3
    },
    {
      name: 'コメディ要素',
      isPoint: true,
      weight: 3
    },
    {
      name: '主人公の魅力',
      isPoint: true,
      weight: 3
    },
    {
      name: '敵対組織の魅力',
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

export const reviews: Review[] = [
  {
    reviewId: 'aaa',
    userName: 'usernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    userId: 'b15857216ec62d4f322a1dfa15df526a764d174ceddd0bff',
    userIconUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    title: 'このテスト映画は素晴らしいです',
    name: 'テストムービー',
    reviewFactorParams: tier.reviewFactorParams,
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
    reviewId: 'bbb',
    userName: 'username',
    userId: 'userid',
    userIconUrl: '',
    title: 'review2',
    name: 'bbb',
    reviewFactorParams: tier.reviewFactorParams,
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
    createAt: new Date('2022/07/10'),
    updateAt: new Date('2022/07/10')
  }
]

tier.reviews = reviews

export const tiers = [
  tier,
  tier,
  tier
]
