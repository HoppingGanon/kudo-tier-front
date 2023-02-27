<template>
  <v-col cols="6" sm="6" md="3" lg="3" xl="2">
    <v-card flat>
      <div class="image-block">
        <slot name="image"></slot>
      </div>
      <div style="bottom: 0px;">
        <span class="text-h6 font-weigft-bold" v-text="title">
        </span><br />
        <span v-text="subtitle">
        </span><br />
        <span v-text="text">
        </span>
      </div>
      <slot name="append"></slot>
      <v-card-actions v-if="license">
        <v-btn flat width="100%" @click="dialog = true">
          LICENSEを開く
        </v-btn>

        <simple-dialog v-model="dialog" title="LICENSE" :fullscreen="$vuetify.display.mobile">
          <div style="overflow-y: scroll;height:480px;" class="d-flex justify-center">
            <div>
              <span v-for="c, i of license.split('\n')" :key="i">
                <span v-text="c"></span>
                <br />
              </span>
            </div>
          </div>
        </simple-dialog>

      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SimpleDialog from '@/components/SimpleDialog.vue'

export default defineComponent({
  name: 'ServiceColmun',
  components: {
    SimpleDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    license: {
      type: String
    }
  },
  setup () {
    return {
      dialog: ref(false)
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
.image-block {
  width: 100%;
  height: 50px;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
