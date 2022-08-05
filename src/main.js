import Vue                  from 'vue'
import App from             './App.vue'
import VueRouter            from 'vue-router'
import { router }           from './router/router'
import store                from './store'
import dotenv from 'dotenv'

dotenv.config()

Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.config.devtools = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
 