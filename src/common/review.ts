/** レビュー構成要素のタイプ */
export type ReviewFactorType = 'text' | 'twitterLink' | 'imageLink'

/**
 * セクションの構成要素
 */
export interface ReviewFactor {
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
  /** 名称 */
  name: string
  /** このセクションの構成要素 */
  subsections: ReviewFactor[]
}

/** レビュー全体 */
export interface Review {
  title: string
  sections: ReviewSection[]
  createAt: Date
}

/** レビューグループの構成要素 */
export interface ReviewGroupFactor {
  review: Review
  comments: ReviewFactor[]
}

/** レビューポイントの表示方法 */
export type ReviewPointType = 'stars5' | 'rank7' | 'rank13' | 'point10' | 'point100'

/** レビューポイントの表示方法 */
export type ReviewDisplayType = 'summary' | 'simple'

/** レビュー評点 */
export interface ReviewPoint {
  /** レビュー評点の名称 */
  name: string
  /** 評点の重み */
  weight: number
}

/** 複数のレビューをまとめたグループ */
export interface ReviewGroup {
  /** レビューグループのタイトル */
  title: string
  /** レビューグループの構成要素 */
  reviews: ReviewGroupFactor[]
  /** レビューポイントの表示方法 */
  reviewPointType :ReviewPointType
  /** レビュー評点 */
  reviewPoints: ReviewPoint []
  createAt: Date

}

export class ReviewFunc {
  static getReviewDisp (point: number, type :ReviewPointType) : string {
    switch (type) {
      case 'stars5':
        if (point <= 0) {
          return ''
        } else if (point < 20) {
          return '★'
        } else if (point < 40) {
          return '★★'
        } else if (point < 60) {
          return '★★★'
        } else if (point < 80) {
          return '★★★★'
        } else {
          return '★★★★★'
        }
      case 'rank7':
        if (point <= 0) {
          return 'E'
        } else if (point < 20) {
          return 'D'
        } else if (point < 40) {
          return 'C'
        } else if (point < 60) {
          return 'B'
        } else if (point < 80) {
          return 'A'
        } else if (point < 80) {
          return 'S'
        } else {
          return 'SS'
        }
      case 'rank13':
        if (point <= 0) {
          return 'E'
        } else if (point < 20) {
          return 'E+'
        } else if (point < 40) {
          return 'D'
        } else if (point < 60) {
          return 'D+'
        } else if (point < 80) {
          return 'C'
        } else if (point < 80) {
          return 'C+'
        } else if (point < 80) {
          return 'B'
        } else if (point < 80) {
          return 'B+'
        } else if (point < 80) {
          return 'A'
        } else if (point < 80) {
          return 'A+'
        } else if (point < 80) {
          return 'S'
        } else if (point < 80) {
          return 'S+'
        } else {
          return 'SS'
        }
      case 'point10':
        if (point <= 0) {
          return '0'
        } else if (point >= 100) {
          return '10'
        } else {
          return Math.floor(point / 10).toString()
        }
      case 'point100':
        if (point <= 0) {
          return '0'
        } else if (point >= 10) {
          return '100'
        } else {
          return Math.floor(point).toString()
        }
    }
  }
}
