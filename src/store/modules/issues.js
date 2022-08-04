import axios            from 'axios'
import store            from '..'
// import {router}         from '../../router/router.js'
// import SETTINGS         from '../../settings'

// initial state

const state = {
    customers: [],
    allIssues: [],
    assignees: [],
    timePeriod: 604800 * 1000, // 1 week
    stats: {},
    sorted: {},
    issuesLoading: false,
    error: '',
    filters: {},
    blacklistedAssignees: []
}

// getters

const getters = {
    hiddenAssignees:    (state) => state.blacklistedAssignees,
    getFilters:         (state) => state.filters,
    getError:           (state) => state.error,
    getCustomers:       (state) => state.customers,
    getTimePeriod:      (state) => state.timePeriod,
    getAllIssues:       (state) => state.allIssues,
    getAssigneesList:   (state) => state.assignees,
    getStats:           (state) => state.stats,
    getIssuesLoading:   (state) => state.issuesLoading,
    getSortedIssues:    (state) => state.sorted
}

// actions
const actions = {
    setFilter({commit}, {filter}){
        commit('SET_FILTER', filter)
    },
    setBlacklist({commit}, blacklist){
        commit('UPDATE_BLACKLIST', blacklist)
    },
    addAToBlacklist({commit}, {name, skipRefresh}){
        var blacklist = [...store.getters.hiddenAssignees]
        blacklist.push(name)
        commit('UPDATE_BLACKLIST', blacklist)
        if(skipRefresh == 'false'){
            store.dispatch('fetchAllIssues')
        }
    },
    removeFromBlacklist({commit}, {name, skipRefresh}){
        var blacklist = [...store.getters.hiddenAssignees]
        var index = blacklist.indexOf(name)
        if(index > -1){
            blacklist.splice(index, 1)
            commit('UPDATE_BLACKLIST', blacklist)
        }
        if(skipRefresh == 'false'){
            store.dispatch('fetchAllIssues')
        }
    },
    async fetchAllIssues({commit, getters}){
        var issues = []
        commit("SET_ISSUES_LOADING", true)
        console.log('issues fetch started')
        await axios({
            // Cores?
            url: '/redmine/redmines.php',
            method: 'get',
            headers: {
                'Content-Type': `application/json`,
            },
            // url: `${SETTINGS.SERVER_URL}?period=${period}`,
            // method: 'get',
            // headers: {
            //     'Content-Type': `application/json`,
            //     // 'Authorization': `Bearer ${}`
            // },
        }).then((response) => {
            issues = response.data ? response.data : []
            store.dispatch('sortIssues', {items: issues, filters: {hiddenAssignees: getters.hiddenAssignees}})
            // console.log('fetch issues response: ', issues)
            commit("SET_ISSUES_LOADING", false)
        }, (error) => {
            commit('SET_ERROR', error.message ? error.message : error)
            console.log(error)
            commit("SET_ISSUES_LOADING", false)
        })
    },
    sortIssues({commit}, {items, filters}){
        var assigneesBlackList = []
        var localitems = [...items]
        if(filters){
            if(filters.hiddenAssignees && typeof(filters.hiddenAssignees == 'object')){
                assigneesBlackList = [...filters.hiddenAssignees]
            }
        }
        var assignees = []
        var customers = []
        var desiredStatusList = [
            'new',
            'in progress',
            'details needed',
            'completed',
            'ready for testing',
            'paused'
        ]
        var all = []
        var sorted = {}
        if(localitems){
            localitems.map(item => {
                var name = item.firstName + ' ' + item.lastName
                var status = item.status.toLowerCase()
                if(!assignees.includes(name)){
                    assignees.push(name)
                }
                if(!assigneesBlackList.includes(name)){
                    if(!customers.includes(item.permitCustomer)){
                        customers.push(item.permitCustomer)
                    }
                    if(!sorted[name]){
                        sorted[name] = {}
                    }
                    if(!sorted[name][status]){
                        sorted[name][status] = []
                    }
                    // sort filter statuses
                    if(desiredStatusList.includes(item.status.toLowerCase())){
                        
                        all.push(item)
                        sorted[name][status].push(item)                
                    }
                }
            })
        }
        if(filters.sortBy == 'priority'){
            assignees.map((assignee) => {
                Object.keys(sorted[assignee]).map((status) => {
                    sorted[assignee][status] = sorted[assignee][status].sort((a, b) => {
                        return parseInt(a.priority.substring(0, a.priority.indexOf('-'))) - parseInt(b.priority.substring(0, b.priority.indexOf('-')))
                    })
                })
            })
        }
        commit('SET_CUSTOMERS', customers)
        commit('SET_ASSIGNEES', assignees)
        commit('SET_SORTED_ISSUES', sorted)
        commit('RECORD_ALL_ISSUES', all)
    },
    async setTimePeriod({commit}, period){
        console.log('setting time period')
        commit("SET_TIME_PERIOD", period)
        await store.dispatch('fetchAllIssues', parseInt(period))
    },
    setIssuesLoading({commit}, bool){
        commit('SET_ISSUES_LOADING', bool)
    },
}

// mutations
const mutations = {
    UPDATE_BLACKLIST(state, blacklist){
        localStorage.setItem('hideAssignees', JSON.stringify([...blacklist]))
        state.blacklistedAssignees = [...blacklist]
    },
    RECORD_ALL_ISSUES(state, issues){
        state.allIssues = [...issues]
    },
    SET_ASSIGNEES(state, list){
        state.assignees = list
    },
    SET_CUSTOMERS(state, list){
        state.customers = [...list]
    },
    SET_TIME_PERIOD(state, period){
        state.timePeriod = parseInt(period)
    },
    SET_ISSUES_LOADING(state, bool){
        state.issuesLoading = bool
    },
    SET_SORTED_ISSUES(state, sorted){
        state.sorted = sorted
        console.log("sorted items ", sorted)
    },
    SET_FILTER(state, {filter}){
        var existingFilters = state.filters
        var filterKey = Object.keys(filter)[0]
        var filterValue = Object.values(filter)[0]
        if(existingFilters && filterKey && filterValue){
            existingFilters[filterKey] = filterValue
        }
        state.filters = existingFilters
    },
    SET_ERROR(state, error){
        state.error = error
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}