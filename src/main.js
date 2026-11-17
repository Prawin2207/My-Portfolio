import { createApp } from 'vue'
import './style.css'
// New "Workflow Engine" design. The previous design is still in App.vue
// (and on the `main` branch / `v1-classic-design` tag).
import App from './AppCreative.vue'

createApp(App).mount('#app')
