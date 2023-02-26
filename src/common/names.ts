interface Names {
  contributors: {
    charge: string
    names: string[]
  }[]
}

export const myName = 'R.Tanaka'

const names: Names = {
  contributors: [
    {
      charge: '企画',
      names: [myName]
    },
    {
      charge: 'システム設計',
      names: [myName]
    },
    {
      charge: '製造',
      names: [myName]
    },
    {
      charge: 'テスト',
      names: [myName]
    },
    {
      charge: 'サーバー設計',
      names: [myName]
    },
    {
      charge: '運用',
      names: [myName]
    }
  ]
}

export default names
