import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import vuetoast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(vuetoast)
  .mount('#app')
