import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
const pinia = createPinia()
// import zhCn from "element-plus/lib/locale/lang/zh-cn";//国际化

const app = createApp(App);

app.use(ElementPlus).use(pinia).mount('#app')

//全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
