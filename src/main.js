import Vue                  from 'vue'
import App from             './App.vue'
import VueRouter            from 'vue-router'
import { router }           from './router/router'
import store                from './store'
import dotenv from 'dotenv'
import ViewCompact          from 'vue-material-design-icons/ViewCompact'
import ClipboardCheck       from 'vue-material-design-icons/ClipboardCheck'
import Cog                  from 'vue-material-design-icons/Cog'
import ChevronDown          from 'vue-material-design-icons/ChevronDown'



dotenv.config()

Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.config.devtools = false;
Vue.use(ViewCompact)
Vue.use(ClipboardCheck)
Vue.use(Cog)
Vue.use(ChevronDown)
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
 