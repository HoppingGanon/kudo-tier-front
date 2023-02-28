import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import vuetoast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import VueScrollTo from 'vue-scrollto'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(vuetoast)
  .use(VueScrollTo)
  .component('EasyDataTable', vue3EasyDataTable)
  .mount('#app')
