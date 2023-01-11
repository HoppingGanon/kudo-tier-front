<template>
  <v-menu v-model="menu">
    <template v-slot:activator="{ props }">
      <slot name="button" :open="open" :props="props">
        <v-btn color="primary" @click="open" v-bind="props">
          メニューを開く
        </v-btn>
      </slot>
    </template>

    <v-card>
      <v-list>
        <v-list-item v-for="item,index in items" :key="index" @click="selectItem(index)">
          <v-icon v-if="getIcon(index)" small class="mr-2">{{ getIcon(index) }}</v-icon>{{ getTitle(index) }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'MenuButton',
  components: {},
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemTitle: {
      type: String as PropType<string | number>
    },
    itemValue: {
      type: String as PropType<string | number>
    },
    itemIcon: {
      type: String as PropType<string | number>
    },
    returnObject: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    select: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      v: any) => true
  },
  setup (props, { emit }) {
    const menu = ref(false)

    const getValue = (index: number) => {
      if (props.itemValue !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.items[index] as { [name: string | number]: any})[props.itemValue]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.items[index] as { [name: string | number]: any}).value
      }
    }

    const getTitle = (index: number) => {
      if (props.itemTitle !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.items[index] as { [name: string | number]: any})[props.itemTitle]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.items[index] as { [name: string | number]: any}).text
      }
    }

    const getIcon = (index: number) => {
      if (props.itemIcon !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.items[index] as { [name: string | number]: any})[props.itemIcon]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.items[index] as { [name: string | number]: any}).icon
      }
    }

    const selectItem = (index: number) => {
      if (props.returnObject) {
        emit('select', props.items[index])
      } else {
        emit('select', getValue(index))
      }
    }
    return {
      menu,
      open: () => {
        menu.value = true
      },
      getValue,
      getTitle,
      getIcon,
      selectItem
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
