/** レビュー構成要素のタイプ */
export type ReviewFactorType = 'text' | 'twitterLink' | 'imageLink'

/**
 * セクションの構成要素
 */
export interface ReviewParagraph {
  /** 要素のタイプ */
  type: ReviewFactorType
  /** 構成要素の内容 */
  body: string
}

/**
 * レビューのセクション
 */
export interface ReviewSection {
  /** セクションの見出し */
  title: string
  /** このセクションの構成要素 */
  factors: ReviewParagraph[]
}
export const reviewPointTypeArray = [
  'stars', 'rank7', 'rank14', 'score', 'point', 'unlimited'
] as const

/** レビューポイントの表現方法 */
export type ReviewPointType = typeof reviewPointTypeArray[number]

/** レビューの表示方法 */
export type ReviewDisplayType = 'summary' | 'simple'

/** レビューポイントの表示方法 */
export type ReviewPointDisplayType = 'normal' | 'radar'

/** レビュー評点 */
export interface ReviewFactorParam {
  /** レビュー評点の名称 */
  name: string
  /** ポイントか情報かフラグ */
  isPoint: boolean
  /** 評点の重み */
  weight: number
}

/** レビュー評点や情報 どちらか一つを持つ */
export interface ReviewFactor {
  /** レビューが持つ情報 */
  info?: string
  /** レビュー評点 */
  point?: number
}

/** レビュー全体 */
export interface Review {
  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  title: string
  /** 「作品名」や「商品名」という名称の名称が入る */
  nameName: string
  name: string

  /** レビュー評点に対する情報 */
  reviewFactorParams: ReviewFactorParam[]
  /** レビュー評点 */
  reviewFactors: ReviewFactor []

  pointType: ReviewPointType
  sections: ReviewSection[]
  createAt: Date
  updateAt: Date
}

/** レビューグループの構成要素 */
export interface ReviewGroupFactor {
  review: Review
  comments: ReviewParagraph[]
}

/** 複数のレビューをまとめたグループ */
export interface ReviewGroup {
  /** レビューグループのタイトル */
  title: string
  /** レビューグループの構成要素 */
  reviews: Review[]
  /** レビューポイントの表示方法 */
  reviewPointType :ReviewPointType
  /** レビュー評点に対する情報 */
  reviewFactorParams: ReviewFactorParam[]
  createAt: Date
  updateAt: Date

}

export class ReviewFunc {
  static getReviewDisp (point: number, type :ReviewPointType) : number {
    let p = 100
    switch (type) {
      case 'stars':
        p = 100 / 5
        /*
        if (point <= 0) {
          return ''
        } else if (point < p) {
          return '★'
        } else if (point < p) {
          return '★★'
        } else if (point < 2 * p) {
          return '★★★'
        } else if (point < 3 * p) {
          return '★★★★'
        } else {
          return '★★★★★'
          break
        }
        */
        break
      case 'rank7':
        p = 100 / 6
        /*
        if (point <= 0) {
          return 'E'
        } else if (point < p * 1) {
          return 'D'
        } else if (point < p * 2) {
          return 'C'
        } else if (point < p * 3) {
          return 'B'
        } else if (point < p * 4) {
          return 'A'
        } else if (point < p * 5) {
          return 'S'
        } else {
          return 'SS'
        }
        */
        break
      case 'rank14':
        p = 100 / 13
        /*
        if (point <= 0) {
          return 'E'
        } else if (point < p * 1) {
          return 'E+'
        } else if (point < p * 2) {
          return 'D'
        } else if (point < p * 3) {
          return 'D+'
        } else if (point < p * 4) {
          return 'C'
        } else if (point < p * 5) {
          return 'C+'
        } else if (point < p * 6) {
          return 'B'
        } else if (point < p * 7) {
          return 'B+'
        } else if (point < p * 8) {
          return 'A'
        } else if (point < p * 9) {
          return 'A+'
        } else if (point < p * 10) {
          return 'S'
        } else if (point < p * 11) {
          return 'S+'
        } else {
          return 'SS'
        }
        */
        break
      case 'score':
        if (point <= 0) {
          return 0
        } else if (point >= 100) {
          return 10
        } else {
          return Math.floor(point / 10)
        }
      case 'point':
        if (point <= 0) {
          return 0
        } else if (point >= 10) {
          return 10
        } else {
          return Math.floor(point)
        }
      case 'unlimited':
        return Math.floor(point)
    }
    return Math.ceil(point / p)
  }
}
