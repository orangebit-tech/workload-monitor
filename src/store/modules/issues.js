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
    pmTasks: {},
    groupBy: 'team',
    issuesLoading: false,
    error: '',
    filters: [],
    blacklistedAssignees: [],
    mode: 'teams',
    route: null,
}

// getters

const getters = {
    getPmTasks:         (state) => state.pmTasks,
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
    getSortedTeams:     (state) => state.sortedTeams,
    getMode:            (state) => state.mode,
    getRoute            (state) {
        return state.route;
    }
}

// actions
const actions = {
    setPmTasks({commit}, tasks) {
        commit('SET_PM_TASKS', tasks)
    },
    setMode({commit}, mode){
        commit('SET_MODE', mode)
    },
    setGroupBy({commit}, groupBy){
        commit('GROUP_BY', groupBy)
    },
    setFilter({commit}, filter){
        console.log("SET_FILTER RECEIVED ", filter)
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
    async fetchAllIssues({commit}){
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
            commit('RECORD_ISSUES', issues)
            // await store.dispatch('fetchPmTasks')
            // await store.dispatch('sortIssues', {items: issues, filters: {hiddenAssignees: getters.hiddenAssignees}, orderBy: 'team'})
            // await store.dispatch('sortIssues', {items: getters.getAllIssues, filters: {hiddenAssignees: getters.hiddenAssignees}, orderBy: getters.getRoute.name == 'PMBoard' ? 'pm':'team'})
            // var customfields_10106 = []
            // issues.map(itm => {
            //     if(!itm.fields.customfield_10106){
            //         customfields_10106.push(itm)
            //     }
            // })
            // console.log('RECEIVED MISSING custom_field_10106 ', customfields_10106.length)
            // console.log('fetch issues response: ', issues)
            // commit("SET_ISSUES_LOADING", false)
        }, (error) => {
            commit('SET_ERROR', error.message ? error.message : error)
            console.log(error)
            // commit("SET_ISSUES_LOADING", false)
        })
    },
    async fetchPmTasks({commit, getters}){
        var issues = []
        console.log(getters)
        commit("SET_ISSUES_LOADING", true)
        console.log('PM TASKS fetch started')
        await axios({
            // Cores?
            // url: `${process.env.VUE_APP_JIRA_API}/issues/${'CRM-2305'}`,
            url: `${'https://a3i3.dev:8443'}/jira/pm`,
            // url: `${'https://americor.atlassian.net/rest/api/latest/search?jql=project=CRM&maxResults=10000'}`,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': `application/json`,
            },
        }).then( async (response) => {
            console.log('PM RESPONSE', response)
            issues = response.data?.issues ? response.data.issues : []
            commit('RECORD_ISSUES', issues)
            // commit('SET_PM_TASKS', issues)
            // commit('APPEND_ISSUES', issues)
            // console.log('APPENDING')

            // var customfields_10106 = []
            // getters.getAllIssues.map(itm => {
            //     if(!itm.fields.customfield_10106){
            //         customfields_10106.push(itm)
            //     }
            // })
            // console.log('FROM GETTERS ALL ISSUES ', getters.getAllIssues)
            // console.log('RECEIVED MISSING custom_field_10106 ', customfields_10106.length)

            // await store.dispatch('sortIssues', {items: getters.getAllIssues, filters: {hiddenAssignees: getters.hiddenAssignees}, orderBy: getters.getRoute.name == 'PMBoard' ? 'pm':'team'})
            
            // console.log('fetch issues response: ', issues)
            commit("SET_ISSUES_LOADING", false)
        }, (error) => {
            commit('SET_PM_TASKS', {})
            commit('SET_ERROR', error.message ? error.message : error)
            console.log(error)
            commit("SET_ISSUES_LOADING", false)
        })
    },
    sortIssues({commit, getters}, {items, filters, orderBy}){
        console.log("SORT STARTED, items: ", items, ' order by: ', orderBy)
        var customfields_10106 = []
        console.log(customfields_10106)
        var localitems = [...items]
        console.log('localitems: ', localitems)
        console.log("STORE.GETTERS HERE IN SORT ", store.getters.getPmTasks)
        // store.getters.getPmTasks.map((it) => {
        //     if(!it.fields.customfield_10106){
        //        customfields_10106.push(it) 
        //     }
        // })
        console.log('missing customfields_10106 in pmTasks', customfields_10106)
        var result = []
        var teams = []
        var pms = []
        var assignees = []
        var customers = []
        var developers = []
        var desiredStatusList = [
            'tech review',
            'development plan',
            'in development',
            'code review',
            'testing',
            'paused',
        ] 
        var desiredStatusPM = [
            'team code review',
            'released to production',
            'waiting for release',
            'writing documentation',
            'to document',
            'backlog',
            'qa research'
        ]
        var all = []
        
        if(orderBy == 'assignee'){
            var assigneesBlackList = []
            if(localitems){
                console.log("ASSIGNEES SORT STARTED", localitems)
                localitems.map(item => {
                    var assignee = item.fields.assignee?.displayName ? item.fields.assignee.displayName : "Unassigned"
                    var status = item.fields.status.name.toLowerCase()
                    if(!assignees.includes(assignee) && assignee !=='Unassigned'){
                        assignees.push(assignee)
                    }
                    if(!assignees.includes(assignee) && assignee =='Unassigned'){
                        assignees.unshift(assignee)
                    }
                    if(!assigneesBlackList.includes(assignee)){
                        if(item.fields.customfield_10115 && !customers.includes(item.fields.customfield_10115.value)){
                            customers.push(item.fields.customfield_10115.value)
                        }
                        // SORTED
                        if(!result[assignee]){
                            result[assignee] = {}
                        }
                        if(!result[assignee][status]){
                            result[assignee][status] = []
                        }
                        // sort filter statuses
                        if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                            all.push(item)
                            result[assignee][status].push(item)  
                        }
                    }
                })
            }
            commit('RECORD_ALL_ISSUES', all)
        }
        if(orderBy == 'developer' ){
            var developersBlackList = []
            if(localitems){
                console.log("DEVS SORT STARTED", localitems)
                localitems.map(item => {
                    var developer = item.fields.customfield_10107?.displayName ? item.fields.customfield_10107.displayName : "Unassigned"
                    var status = item.fields.status.name.toLowerCase()
                    if(!developers.includes(developer) && developer !=='Unassigned'){
                        developers.push(developer)
                    }
                    if(!developers.includes(developer) && developer =='Unassigned'){
                        developers.unshift(developer)
                    }
                    if(!developersBlackList.includes(developer)){
                        // CUSTOMERS
                        if(item.fields.customfield_10115 && !customers.includes(item.fields.customfield_10115.value)){
                            customers.push(item.fields.customfield_10115.value)
                        }
                        // TEAMS
                        if(!result[developer]){
                            result[developer] = {}
                        }
                        if(!result[developer][status]){
                            result[developer][status] = []
                        }
                        // sort filter statuses
                        if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                            all.push(item)
                            result[developer][status].push(item)                
                        }
                    }
                })
            }
            commit('RECORD_ALL_ISSUES', all)
        }
        if(orderBy == 'team' || !orderBy){
            store.dispatch('setGroupBy', 'team')
            var teamsBlackList = []
            if(localitems){
                console.log("TEAMS SORT STARTED", localitems)
                localitems.map(item => {
                    var status = item.fields.status.name.toLowerCase()
                    var team = item.fields.customfield_10102?.value ? item.fields.customfield_10102.value : "Unassigned"
                    if(!teams.includes(team) && team !=='Unassigned'){
                        teams.push(team)
                    }
                    if(!teams.includes(team) && team =='Unassigned'){
                        teams.unshift(team)
                    }
                    if(!teamsBlackList.includes(team)){
                        if(item.fields.customfield_10115 && !customers.includes(item.fields.customfield_10115.value)){
                            customers.push(item.fields.customfield_10115.value)
                        }
                        // TEAMS
                        if(!result[team]){
                            result[team] = {}
                        }
                        if(!result[team][status]){
                            result[team][status] = []
                        }
                        // sort filter statuses
                        if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                            all.push(item)
                            result[team][status].push(item)                
                        }
                    }
                })
            }
            console.log("GETTERS ", getters.getAllIssues.length)
            if(getters.getAllIssues.length == 0){
                commit('RECORD_ALL_ISSUES', all)
            }
        }
        if(orderBy == 'pm'){
            store.dispatch('setGroupBy', 'pm')
            var pmsBlackList = []
            if(localitems){
                console.log("PM SORT STARTED", localitems)
                console.log("LOCAL ITEMS", localitems)
                localitems.map(item => {
                    // var status = item.fields.status.name.toLowerCase()
                    var status = ''
                    function itemStatus (status) {
                        item.fields.status.name.toLowerCase()
                        return    status == 'released to production'    ? 'done' 
                                : status == 'to document'               ? 'done' 
                                : status == 'tech review'               ? 'review' 
                                : status == 'development plan'          ? 'review' 
                                : status == 'in development'            ? 'in progress' 
                                : status == 'team code review'          ? 'qc' 
                                : status == 'code review'               ? 'qc' 
                                : status == 'qa'                        ? 'qc' 
                                : status == 'qa research'               ? 'qc' 
                                : status == 'testing'                   ? 'qc'
                                : status
                    }
                    status = itemStatus(item.fields.status.name.toLowerCase())
                    
                    var pm = item.fields.customfield_10106 && item.fields.customfield_10106.displayName ? item.fields.customfield_10106.displayName : "Unassigned"
                    pms.push(pm)

                    if(!pmsBlackList.includes(pm)){

                        
                        if(item.fields.customfield_10106 && !customers.includes(item.fields.customfield_10106.displayName)){
                            customers.push(item.fields.customfield_10106.displayName)
                        }
                        // pms
                        if(!result[pm]){
                            result[pm] = {}
                        }
                        if(!result[pm][status]){
                            result[pm][status] = []
                        }

                        // sort filter statuses
                        if( item.fields.status &&  
                            (desiredStatusPM.includes(item.fields.status.name.toLowerCase()) 
                            || desiredStatusList.includes(item.fields.status.name.toLowerCase())
                            )){
                            all.push(item)
                            result[pm][status].push(item)                
                        }
                    }
                })
            }
        }
        if(filters){
            if(filters.hiddenAssignees && typeof(filters.hiddenAssignees == 'object')){
                assigneesBlackList = [...filters.hiddenAssignees]
            }
        }
        if(filters.sortBy == 'priority'){
            var keys = Object.keys(result)
            keys.map((item) => {
                Object.keys(result[item]).map((status) => {
                    result[item][status] = result[item][status].sort((a, b) => {
                        return parseInt(a.fields.priority.id) - parseInt(b.fields.priority.id)
                    })
                })
            })
        }
        console.log("FINAL RESULT", result)
        commit('SET_CUSTOMERS', customers)
        commit('SET_SORTED_ISSUES', result)
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
    },
    clearData({commit}){
        commit('CLEAR_DATA')
    }
}

// mutations
const mutations = {
    SET_ROUTE(state, route) {
        state.route = route;
      },
    APPEND_ISSUES(state, issues){
        var all = [...state.allIssues]
        all.push(...issues)
        state.allIssues = all
        console.log("PM ISSUES ADDED TO ALLISSUES ", all.length)
    },
    RECORD_ISSUES(state, issues){
        console.log("")
        var all = [...state.allIssues]
        if(all.length > 0 && issues.length > 0){
            for(var i = 0; i < issues.length; i++){
                if (!all.includes(issues[i])){
                    all.push(issues[i])
                }
            }
        }
        else {
            all = issues
        }
        state.allIssues = all
        console.log("ISSUES ADDED TO ALLISSUES ", all.length)
    },
    SET_PM_TASKS(state, tasks){
        state.pmTasks = tasks
    },
    SET_MODE(state, mode){
        state.mode = mode
    },
    GROUP_BY(state, groupBy){
        state.groupBy = groupBy
    },
    UPDATE_BLACKLIST(state, blacklist){
        localStorage.setItem('hideAssignees', JSON.stringify([...blacklist]))
        state.blacklistedAssignees = [...blacklist]
    },
    RECORD_ALL_ISSUES(state, issues){
        state.allIssues = [...issues]
        console.log('issues recorded: ', state.allIssues)
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
    CLEAR_DATA(state){
        state.sortedTeams = {}
        state.sorted = {}
        state.allIssues = []
        state.customers= []
        state.assignees = []
        state.pmTasks = {}
        state.groupBy =  'team'
        state.filters = []
        state.blacklistedAssignees = []
        state.mode = 'teams'
        state.route = null
    },
    SET_FILTER(state, filter){
        console.log("GOT FILTER ", filter)
        var existingFilters = state.filters && state.filters.length > 0 ? [...state.filters] : []
        console.log("EXISTING FILTERS", state.filters)
        // if(!existingFilters.includes(filter)){
        //     existingFilters.push(filter)
        // }
        existingFilters.push(filter)
        if(existingFilters.length > 1){
            existingFilters.shift()
        }
        state.filters = [...existingFilters]
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