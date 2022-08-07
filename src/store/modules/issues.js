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
    sortedTeams: {},
    groupBy: 'assignee',
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
    getDepartments:     (state) => state.customers,
    getTimePeriod:      (state) => state.timePeriod,
    getAllIssues:       (state) => state.allIssues,
    getAssigneesList:   (state) => state.assignees,
    getStats:           (state) => state.stats,
    getIssuesLoading:   (state) => state.issuesLoading,
    getSortedIssues:    (state) => state.sorted,
    getGroupBy:         (state) => state.groupBy,
    getSortedTeams:     (state) => state.sortedTeams
}

// actions
const actions = {
    setGroupBy({commit}, groupBy){
        commit('GROUP_BY', groupBy)
    },
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
            // url: `${process.env.VUE_APP_JIRA_API}/issues/${'CRM-2305'}`,
            url: `${'https://a3i3.dev:8443'}/jira/`,
            // url: `${'https://americor.atlassian.net/rest/api/latest/search?jql=project=CRM&maxResults=10000'}`,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': `application/json`,
            },
        }).then( async (response) => {
            console.log('received response', response)
            issues = response.data?.issues ? response.data.issues : []
            console.log("ISSUES:", issues)
            await store.dispatch('sortIssues', {items: issues, filters: {hiddenAssignees: getters.hiddenAssignees}})
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
        var teams = []
        var assignees = []
        var customers = []
        var desiredStatusList = [
            'tech review',
            'development plan',
            'in development',
            'code review',
            'testing',
            'paused'
        ]
        var all = []
        var sorted = {}
        var sortedTeams = {}
        if(localitems){
            console.log("LOCALITEMS", localitems)
            localitems.map(item => {
                var name = item.fields.assignee?.displayName ? item.fields.assignee.displayName : "Unassigned"
                var status = item.fields.status.name.toLowerCase()
                var team = item.fields.customfield_10102?.value ? item.fields.customfield_10102.value : "Unassigned"
                if(!teams.includes(team) && team !=='Unassigned'){
                    teams.push(team)
                }
                if(!assignees.includes(name) && name !=='Unassigned'){
                    assignees.push(name)
                }
                if(!assignees.includes(name) && name =='Unassigned'){
                    assignees.unshift(name)
                }
                if(!assigneesBlackList.includes(name)){
                    // CUSTOMERS
                    if(!customers.includes(item.fields.creator.displayName)){
                        customers.push(item.fields.creator.displayName)
                    }
                    // TEAMS
                    if(!sortedTeams[team]){
                        sortedTeams[team] = {}
                    }
                    if(!sortedTeams[team][name]){
                        sortedTeams[team][name] = {}
                    }
                    if(!sortedTeams[team][name][status]){
                        sortedTeams[team][name][status] = []
                    }
                    // SORTED
                    if(!sorted[name]){
                        sorted[name] = {}
                    }
                    if(!sorted[name][status]){
                        sorted[name][status] = []
                    }
                    // sort filter statuses
                    if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                        all.push(item)
                        sorted[name][status].push(item)  
                        sortedTeams[team][name][status].push(item)                
                    }
                }
            })
        }
        if(filters.sortBy == 'priority'){
            assignees.map((assignee) => {
                Object.keys(sorted[assignee]).map((status) => {
                    sorted[assignee][status] = sorted[assignee][status].sort((a, b) => {
                        return parseInt(a.fields.priority.id) - parseInt(b.fields.priority.id)
                    })
                })
            })
        }
        commit('SET_CUSTOMERS', customers)
        commit('SET_ASSIGNEES', assignees)
        commit('SET_SORTED_ISSUES', sorted)
        commit('SET_TEAMS_ISSUES', sortedTeams)
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
    flushErrors({commit}){
        commit('FLUSH_ERRORS')
    }
}

// mutations
const mutations = {
    GROUP_BY(state, groupBy){
        state.groupBy = groupBy
    },
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
    SET_TEAMS_ISSUES(state, sortedTeams){
        state.sortedTeams = sortedTeams
        console.log("sorted teams items ", sortedTeams)
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
    },
    FLUSH_ERRORS(state){
        state.error = ''
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}