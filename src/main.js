import Vue from 'vue'
import App from './App.vue'
//路由
import router from './router/router.js'

// 导入全局初始化样式
import '@/style/style.scss';

//图标组件
import IconSvg from '../src/iconfont/icon-components.vue'
Vue.component('icon-svg', IconSvg)
//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//全局过滤器
import * as filters from './utils/method.js'
Object.keys(filters).forEach(key=>{
  Vue.filter(key,filters[key])
})
import lyric from './utils/lyric.js'
Vue.prototype.lyric=lyric;


Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
