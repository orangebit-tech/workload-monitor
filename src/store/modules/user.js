// import axios            from 'axios'
// import store            from '..'
import {router}         from '../../router/router.js'
// import SETTINGS         from '../../settings'

// initial state

const state = {
    token: '',
    loggedIn: ''
}

// getters

const getters = {
    getLoggedIn:        (state) => state.loggedIn,
    getToken:           (state) => 
    {
        if(state.token && state.token !== ''){
            return state.token
        }
        else if (localStorage.j_token && localStorage.j_token !== ''){
            return localStorage.j_token
        }
        else {
            return ''
        }
    }
}

// actions
const actions = {
    setToken({commit}, token){
        if(process.env.VUE_APP_SUPER_SECURE_PASSWORD == token){
            commit('SET_TOKEN', token)
            router.push({path: '/'})
        }
        else {
            commit("SET_ERROR", 'Wrong Password')
        }
    },
    setLoggedIn({commit}, bool){
        commit('SET_LOGGED_IN', bool)
    },
    logout({commit}){
        commit('SET_TOKEN', '')
        router.push({path: '/login'})
    }
}

// mutations
const mutations = {
    SET_LOGGED_IN(state, bool){
        state.loggedIn = bool
    },
    SET_TOKEN(state, token){
        if(token == ''){
            state.token = ''
            localStorage.j_token = ''
        }
        else {
            if(!localStorage.j_token){
                localStorage.setItem('j_token', token)
            }
            state.token = token
        }
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}