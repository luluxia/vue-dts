import { createApp } from 'vue'
import App from './App.vue'
// import 'virtual:windi.css'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import router from './router'

createApp(App).use(router).mount('#app')
