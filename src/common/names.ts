interface Names {
  contributors: {
    charge: string
    names: string[]
  }[]
}

export const appName = 'くどくどTier'
export const myName = 'Tanaka'
export const version = '0.5.0-beta'
export const buildDate = '2023'

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
