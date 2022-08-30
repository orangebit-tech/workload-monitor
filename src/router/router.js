import Vue              from 'vue/dist/vue.min'
import VueRouter        from 'vue-router'
import App              from '../App.vue'
import Home             from '../components/Home'
import Settings         from '../components/Settings'
import Dashboard        from '../components/Dashboard'
import Departments      from '../components/Departments'
import Items            from '../components/Items'
import store            from '../store'
import Login            from '../components/Login.vue'

export const routes = [
    {
        path: '/login',
        name: "Login",
        component: Login,
        children: []
    },
    {
        path: "/",
        name: "App",
        component: App,
        redirect: 'home',
        meta: {
            requiresAuth: true
          },
        children: [
            {
                path: "home",
                name: "Home",
                component: Home,
                redirect: '/home/dashboard',
                children: [
                    {
                        path: "/home/dashboard",
                        name: "Dashboard",
                        component: Dashboard,
                        children: [
                        ]
                    },
                    {
                        path: "/home/items",
                        name: "Items",
                        component: Items,
                        children: [
                        ]
                    },
                    {
                        path: "/home/settings",
                        name: "Settings",
                        component: Settings,
                        children: [
                        ]
                    },
                    {
                        path: "/home/departments",
                        name: "Departments",
                        component: Departments,
                        children: [
                        ]
                    },
                    {
                        path: "/home/pms",
                        name: "PMBoard",
                        component: Dashboard,
                        children: [
                        ]
                    },
                ]
            },
        ]
    },  
]
Vue.use(VueRouter)

export const router = new VueRouter({
    // easier to host, otherwise need to write route rewrite
    mode: 'history',
    linkExactActiveClass: 'is-active',
    routes
})
router.beforeEach((to, from, next) => {
    store.commit('SET_ROUTE', to);
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Route requires auth, check if user is logged in
        // if not, redirect to login page.
        if (!localStorage.j_token || localStorage.j_token == '') {
            console.log('missing localstorage.user, redirecting to /SignIn')
            next({
            path: '/login',
            query: { redirect: to.fullPath }
            })
        }
        else if(localStorage.j_token == 'undefined'){
            console.log('received dead token ', localStorage.j_token)
        }
        else {
            console.log('token found in localStorage')
            // we have a state.user object but
            // we need to check if the token is still valid
            try{
                // store.dispatch('setToken', localStorage.j_token)
                if(to && to.name == 'PMBoard'){
                    store.dispatch('setGroupBy', 'pm')
                }
                else {
                    store.dispatch('setGroupBy', 'team')
                }
                console.log('valid token')
                // user is logged in with a valid token
                next()
            }catch(e){
                console.log('token did not go through for some reasons... deleting user from state')
                // the token is invalid so we will have the user login again
                // clear the token and user info
                next({
                    path: '/login',
                })
            }
        }
    } 
    else {
        if(to && to.name == 'PMBoard'){
            store.dispatch('setGroupBy', 'pm')
            // console.log("ROUTER GROUP BY IF PM")
        }
        else {
            // console.log("ROUTER GROUP BY ELSE")
            store.dispatch('setGroupBy', 'team')
        }
        next();
    }
    next()
  });
