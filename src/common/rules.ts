export default class Rules {
  static required = (additionalMessage?: string) => (v: string) => !!v || `必ず入力してください${additionalMessage || ''}`
  static maxLen = (max :number, additionalMessage?: string) => (v:string) => v.length <= max || `${max}文字以下の文字列である必要があります${additionalMessage || ''}`
  static minLen = (min :number, additionalMessage?: string) => (v:string) => v.length >= min || `${min}文字以上の文字列である必要があります${additionalMessage || ''}`
}
