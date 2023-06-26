import Vue                  from 'vue'
import App from             './App.vue'
import store                from './store'
import VueRouter            from 'vue-router'
import { router }           from './router/router'
import dotenv               from 'dotenv'
import ViewCompact          from 'vue-material-design-icons/ViewCompact'
import ClipboardCheck       from 'vue-material-design-icons/ClipboardCheck'
import Cog                  from 'vue-material-design-icons/Cog'
import ChevronDown          from 'vue-material-design-icons/ChevronDown'
import VueFullscreen        from 'vue-fullscreen'
import vuetify from './plugins/vuetify'



dotenv.config()

Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.config.devtools = false;
Vue.use(ViewCompact)
Vue.use(ClipboardCheck)
Vue.use(Cog)
Vue.use(ChevronDown)
Vue.use(VueFullscreen)
Vue.config.warnHandler = function () {
  return null
}
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
 