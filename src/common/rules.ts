export default class Rules {
  static required = (additionalMessage?: string) => (v: string) => !!v || `必ず入力してください${additionalMessage || ''}`
  static maxLen = (max :number, additionalMessage?: string) => (v:string) => v.length <= max || `${max}文字以下の文字列である必要があります${additionalMessage || ''}`
  static minLen = (min :number, additionalMessage?: string) => (v:string) => v.length >= min || `${min}文字以上の文字列である必要があります${additionalMessage || ''}`
  static maxNum = (max :number, additionalMessage?: string) => (v:string) => Number.parseFloat(v) <= max || `${max}以下の数値である必要があります${additionalMessage || ''}`
  static minNum = (min :number, additionalMessage?: string) => (v:string) => Number.parseFloat(v) >= min || `${min}以上の数値である必要があります${additionalMessage || ''}`

  static isInteger = (additionalMessage?: string) => (v: string) => {
    return (Rules.isNumeric())(v) && (Number.isInteger(v) || `整数で入力する必要があります${additionalMessage || ''}`)
  }

  static isNumeric = (additionalMessage?: string) => (v: string) => !Number.isNaN(v) || `数値で入力する必要があります${additionalMessage || ''}`
}
