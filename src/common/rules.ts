export default class Rules {
  /**
   * 必須チェック
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static required = (additionalMessage?: string) => (v: string) => !!v || `必ず入力してください${additionalMessage || ''}`

  /**
   * 最大文字数チェック
   * @param max 最大文字数
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static maxLen = (max :number, additionalMessage?: string) => (v:string) => v.length <= max || `${max}文字以下の文字列である必要があります${additionalMessage || ''}`

  /**
   * 最小文字数チェック
   * @param min 最小文字数
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static minLen = (min :number, additionalMessage?: string) => (v:string) => v.length >= min || `${min}文字以上の文字列である必要があります${additionalMessage || ''}`

  /**
   * 最大値チェック
   * @param max 最大値
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static maxNum = (max :number, additionalMessage?: string) => (v:string) => Number.parseFloat(v) <= max || `${max}以下の数値である必要があります${additionalMessage || ''}`

  /**
   * 最小値チェック
   * @param min 最小値
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static minNum = (min :number, additionalMessage?: string) => (v:string) => Number.parseFloat(v) >= min || `${min}以上の数値である必要があります${additionalMessage || ''}`

  /**
   * 整数チェック
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static isInteger = (additionalMessage?: string) => (v: string) => {
    return (Rules.isNumeric())(v) && (Number.isInteger(v) || `整数で入力する必要があります${additionalMessage || ''}`)
  }

  /**
   * 数値チェック
   * @param additionalMessage 追加メッセージ（省略可）
   * @returns ルール
   */
  static isNumeric = (additionalMessage?: string) => (v: string) => !Number.isNaN(v) || `数値で入力する必要があります${additionalMessage || ''}`
}
