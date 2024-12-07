import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
    components,
    directives,
})
import router from "./router/index.js";

// Pinia
import { createPinia } from 'pinia'

const pinia = createPinia()

//const api_endpoint = 'https://api.comicmap.top'
 const api_endpoint = 'http://localhost:3000'
const app = createApp(App)
app.provide('api_endpoint', api_endpoint)
app.use(vuetify).use(router).use(pinia).mount('#app')
