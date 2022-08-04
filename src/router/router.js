import Vue              from 'vue/dist/vue.min'
import VueRouter        from 'vue-router'
import App              from '../App.vue'
import Home             from '../components/Home'
import Settings         from '../components/Settings'
import Dashboard        from '../components/Dashboard'
import Customers        from '../components/Customers'
import Items            from '../components/Items'

export const routes = [
    {
        path: "/",
        name: "App",
        component: App,
        redirect: 'home',
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
                        path: "/home/customers",
                        name: "Customers",
                        component: Customers,
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
    mode: 'hash',
    linkExactActiveClass: 'is-active',
    routes
})
