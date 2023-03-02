<template>
  <textarea
    v-model="content"
    class="text-field anime"
    :style="customStyle"
    :class="customClass"
    ref="tRef"
    :placeholder="title"
    spellcheck="false"
    @focusin="focusinProxy()"
    @focusout="$emit('focusout')"
    @click="moveCursorProxy()"
    @keyup="moveCursorProxy()"
  ></textarea>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch, nextTick, onMounted } from 'vue'

export default defineComponent({
  name: 'AutoTextArea',
  components: {},
  computed: {
    content: {
      set (v: string) : void {
        this.$emit('update:model-value', v)
        // 複数行入力禁止ならDOMの変更後に再度改行文字を削除する
        if (!this.multiLines && v.includes('\n')) {
          nextTick(() => this.$emit('update:model-value', v.replace('\n', '')))
        }
      },
      get () : string {
        return this.modelValue
      }
    }
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    class: {
      type: String,
      default: ''
    },
    style: {
      type: String,
      default: ''
    },
    multiLines: {
      type: Boolean,
      default: false
    },
    noOutline: {
      type: Boolean,
      default: false
    },
    noFill: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:model-value': (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      v: string) => true,
    focusin: () => true,
    focusout: () => true,
    moveCursor: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index: number) => true
  },
  setup (props, { emit }) {
    const tRef = ref<HTMLTextAreaElement>()

    onMounted(() => {
      if (tRef.value) {
        tRef.value.style.height = 'auto'
      }
      adjust()
    })

    // テキストフィールドの高さを入力ごとに自動調整する
    const adjust = () => {
      if (tRef.value) {
        new Promise((resolve) => {
          if (tRef.value) {
            resolve(tRef.value.style.height = 'auto')
          }
        }).then(() => {
          if (tRef.value) {
            tRef.value.style.height = `${tRef.value.scrollHeight + 6}px`
          }
        })
      }
    }

    // 入力値を監視して、変更があれば調整
    const { modelValue } = toRefs(props)
    watch(modelValue, adjust)

    const focusinProxy = () => {
      moveCursorProxy()
      emit('focusin')
    }

    const moveCursorProxy = () => {
      if (tRef.value) {
        emit('moveCursor', tRef.value.selectionStart)
      }
    }

    return {
      tRef,
      customClass: computed(() => {
        const cls = `${props.class} `
        const outline = props.noOutline ? 'no-outline ' : 'outlined '
        const fill = props.noFill ? '' : 'filled '
        return `${cls}${outline}${fill}`
      }),
      customStyle: computed(() =>
        `${props.style}`
      ),
      focusinProxy,
      moveCursorProxy
    }
  }
})
</script>

<style scoped>
.textarea {
  width: 100%;
  resize: none;
}

.text-field {
  width: 100%;
  resize: none;
}

.outlined:focus {
  outline: none;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  border-color: rgb(var(--v-theme-primary));
  padding: 2px;
}

.outlined {
  outline: none;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  border-color: #CCC;
  padding: 2px;
}

.no-outline {
  border: none;
  outline: none;
}

.filled {
}

.filled:focus {
  background-color: white;
}

.anime {
  transition: all 0.25s;
}
</style>
