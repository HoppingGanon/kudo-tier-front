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

export const TierTableTypeArray = [
  'ranking', 'pivot'
] as const

/** レビューポイントの表現方法 */
export type TierTableType = typeof TierTableTypeArray[number]

/** レビューの表示方法 */
export type ReviewDisplayType = 'summary' | 'all'

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

/** レビュー評点の表示サイズ */
export type PointDisplaySize = 'smaller' | 'normal' | 'larger'

/** レビュー全体 */
export interface Review {
  /** review識別ID */
  reviewId: string

  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  /** レビューの表示タイトル */
  title: string
  /** 作品名や商品名 */
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

/** 複数のレビューをまとめたグループ */
export interface Tier {
  /** Tier識別ID */
  tierId: string

  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  /** Tierの名称 */
  name: string

  /** 本文 */
  factors: ReviewParagraph[]

  /** Tierの構成要素 */
  reviews: Review[]
  /** レビューポイントの表示方法->Get時にのみこのプロパティを含める */
  // reviewPointType :ReviewPointType
  /** レビュー評点に対する情報 */
  reviewFactorParams: ReviewFactorParam[]

  pointType: ReviewPointType
  createAt: Date
  updateAt: Date

}

// 連想配列、辞書てきなもの
export type Dictionary<T> = { [name: string]: T }

// v-data-tableのヘッダ
export interface DataTableHeader {
  text: string
  value: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  filterable?: boolean
  groupable?: boolean
  divider?: boolean
  class?: string | string[]
  cellClass?: string | string[]
  width?: string | number
  filter?: (value: any, search: string, item: any) => boolean
  sort?: (a: any, b: any) => number
}

/** Tierにおけるレビュー評点の表示についての分割数 */
export const poitnTypeTierCountDic = {
  stars: 6,
  rank7: 7,
  rank14: 14,
  score: 10,
  point: 10,
  unlimited: 100
}

export class ReviewFunc {
  static getReviewDisp (point: number, type :ReviewPointType) : number {
    let p = 100
    switch (type) {
      case 'stars':
        p = 100 / 5
        break
      case 'rank7':
        p = 100 / 6
        break
      case 'rank14':
        p = 100 / 13
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
        } else if (point >= 100) {
          return 100
        } else {
          return Math.floor(point)
        }
      case 'unlimited':
        return Math.floor(point)
    }
    return Math.ceil(point / p)
  }

  static calcAaverage (review: Review) {
    let ave = 0
    let sumWeight = 0

    // 重みの合計を算出
    review.reviewFactorParams.forEach((param, index) => {
      if (param.isPoint && index < review.reviewFactors.length) {
        sumWeight += param.weight
      }
    })
    review.reviewFactorParams.forEach((param, index) => {
      if (param.isPoint && index < review.reviewFactors.length) {
        const factor = review.reviewFactors[index]
        if (factor.point !== undefined) {
          ave += factor.point * param.weight / sumWeight
        }
      }
    })
    return ave
  }

  static calcSum (review: Review) {
    let sum = 0
    review.reviewFactorParams.forEach((param, index) => {
      if (param.isPoint && index < review.reviewFactors.length) {
        const factor = review.reviewFactors[index]
        if (factor.point !== undefined) {
          sum += factor.point
        }
      }
    })
    return sum
  }

  static getPointTypes (reviews: Review[]) : ReviewPointType[] {
    const pointTypes: ReviewPointType[] = []
    reviews.forEach((review) => {
      pointTypes.push(review.pointType)
    })
    return pointTypes
  }
}
