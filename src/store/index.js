import Vue                  from 'vue'
import Vuex from 'vuex';
import issues from './modules/issues.js'
import createPersist from 'vuex-localstorage'
import user from './modules/user.js'


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

let localStorage = createPersist({
    namespace: 'redmine_monitor',
    initialState: {},
    expires: 3.156e+10 // One Year
    // expires: 1.21e+9 // Two Weeks
})

export default new Vuex.Store({
    modules: {
        user,
        issues
    },
    strict: debug,
    plugins: [localStorage]

})