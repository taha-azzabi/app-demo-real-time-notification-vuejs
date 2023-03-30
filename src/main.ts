// Components
import App from '@/App.vue'

import { createApp } from 'vue'
// Styles
import '@/assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
registerPlugins(app)
app.mount('#app')
