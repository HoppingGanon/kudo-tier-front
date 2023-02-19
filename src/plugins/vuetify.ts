// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#E91E63',
    secondary: '#FFC0F0',
    thirdry: '#FFF0F7',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme
    }
  },
  options: {
    customProperties: true
  }
})
