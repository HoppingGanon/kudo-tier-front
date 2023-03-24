export interface ComponentItem {
  props: {
      comment: string
      default: string
      name: string
      type: string
      required: string
  }[];
  description: string
  components: string[]
  emits: {
      params: {
          name: string
          comment: string
      }[];
      comment: string
      name: string
  }[];
  name: string
}