import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import less from 'less'
Vue.use(less)

//引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//请求封装
import ajax from '@/ajax/index.js'
Vue.prototype.$ajax = ajax
import Cookies from 'js-cookie'
import { getCookieKey, getCookie } from '@/assets/utils.js'
Vue.prototype.$getCookieKey = getCookieKey
Vue.prototype.$getCookie = getCookie
Vue.prototype.$Cookies = Cookies

const sysTitle = '资信共享门户系统'
Vue.prototype.$sysTitle = sysTitle

//事件总线
import Bus from '@/assets/bus.js'
Vue.prototype.$Bus = Bus
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
