export default class Rules {
  static required = () => (v: string) => !!v || '必ず入力してください'
  static maxLen = (max :number) => (v:string) => v.length <= max || `${max}文字以下の文字列である必要があります`
  static minLen = (min :number) => (v:string) => v.length >= min || `${min}文字以上の文字列である必要があります`
}
