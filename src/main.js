import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from "pinia";
import '@mdi/font/css/materialdesignicons.css';  // Ensure this is correctly imported
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
    components,
    directives,
  })
  
const app = createApp(App);
app.use(router);
app.use(createPinia())
app.use(vuetify);
app.use(PrimeVue, {
  theme: {
      preset: Aura
  }
});
app.mount('#app');



