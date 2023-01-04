import axios            from 'axios'
import store            from '..'
import _                from 'lodash'
// import {router}         from '../../router/router.js'
// import SETTINGS         from '../../settings'

// initial state

const state = {
    dataLoaded: false,
    customers: [],
    allIssues: [],
    assignees: [],
    epics:     [],
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
    epicsLoaded: false,
    pmsLoaded: false,
    teamsLoaded: false,
    allModulesLoaded: 'false',
    ganttTable: [],
    modulesLoaded: [],
    allData: {},
    requestAttempts: '',
    newsLetter: [],
    newsLetterLoaded: false,
}

// getters

const getters = {
    getDataLoaded:      (state) => state.dataLoaded,
    getAllData:         (state) => state.allData,
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
    getEpics:           (state) => state.epics,
    getTeamsLoaded:     (state) => state.teamsLoaded,
    getPmsLoaded:       (state) => state.pmsLoaded,
    getEpicsLoaded:     (state) => state.epicsLoaded,
    getModulesLoaded:   (state) => state.modulesLoaded,
    getAllModulesLoaded:(state) => state.allModulesLoaded,
    getGanttTable:      (state) => state.ganttTable,
    getRequestAttempts: (state) => state.requestAttempts,
    getNewsLetter:      (state) => state.newsLetter,
    getNewsLetterLoaded:(state) => state.newsLetterLoaded,
    getRoute:           (state) => {
        return state.route;
    }
}

// actions
const actions = {
    setRequestAttempts({commit}, attempts){
        commit('ADD_REQUEST_COUNT', attempts)
    },
    setMode({commit}, mode){
        commit('SET_MODE', mode)
    },
    setGroupBy({commit}, groupBy){
        //console.log('GROUP_BY', groupBy)
        commit('GROUP_BY', groupBy)
    },
    setFilter({commit}, filter){
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
        //console.log('issues fetch started')
        await axios({
            url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/jira/`,
            // url: `${'https://americor.atlassian.net/rest/api/latest/search?jql=project=CRM&maxResults=10000'}`,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': `application/json`,
            },
        }).then( async (response) => {
            //console.log('issues fetch, received response', response)
            issues = response.data?.issues ? response.data.issues : []
            commit('RECORD_ISSUES', issues)
            commit('ADD_TO_LOADED_MODULES', 'issues')
            commit('SET_MODULE_LOADED', 'teams')
        }, (error) => {
            commit('SET_ERROR', error.message ? error.message : error)
            console.log(error)
        })
    },
    async fetchPmTasks({commit}){
        var issues = []
        commit("SET_ISSUES_LOADING", true)
        //console.log('PM TASKS fetch started')
        await axios({
            url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/jira/pm`,
            // url: `${'https://americor.atlassian.net/rest/api/latest/search?jql=project=CRM&maxResults=10000'}`,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': `application/json`,
            },
        }).then( async (response) => {
            //console.log('PM RESPONSE', response)
            issues = response.data?.issues ? response.data.issues : []
            commit('RECORD_ISSUES', issues)
            commit("SET_ISSUES_LOADING", false)
            commit('ADD_TO_LOADED_MODULES', 'PmTasks')
            commit('SET_MODULE_LOADED', 'pms')
        }, (error) => {
            commit('SET_PM_TASKS', {})
            commit('SET_ERROR', error.message ? error.message : error)
            console.log(error)
            commit("SET_ISSUES_LOADING", false)
        })
    },
    createGanttTable({commit}, {issues, epics}){
        var localIssues      = _.cloneDeep(issues)
        var localEpics      = _.cloneDeep(epics)
        //console.log("GOT localIssues: ", localIssues)
        //console.log("GOT epicsTasks: ", localEpics)
        var depts = []
        var depIds = []
        var epicIds = []
        var result = []
        
        if(typeof(localIssues) == 'object' && typeof(localEpics) == 'object'){
            //console.log("HERE IS OK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            if(localEpics && localEpics.length > 0){
                localEpics.map((epic) => {
                    var dep = {id: epic.dep.id, text: epic.dep.value}
                    if(!depIds.includes(dep.id)){
                        depts.push(dep)
                        depIds.push(dep.id)
                    }
                    epicIds.push(epic.id)
                    epic.parent = epic.dep.id
                    
                })
            }
            result.push(...depts)
            result.push(...localEpics)

            localIssues.map((issue) => {
                issue.text = issue.fields.summary
                issue.parent = issue.fields.parent ? issue.fields.parent.id : 77777777
                issue.start_date = issue.fields.customfield_10105,
                issue.end_date = issue.fields.customfield_10145
                //issue.end_date = issue.fields.customfield_10117
                issue.duration = ''

            })
            result.push(...localIssues)
            result.push({id: 77777777, text: 'Uncategorized'})
            commit('SET_GANTT_TABLE', result)
            //console.log("GANTT TABLE", result)
            // var table = []
        }
    },
    async fetchEpics({commit}){
        commit("SET_EPICS_LOADING", false)
        //console.log("SENDING EPIC REQUEST")
        await axios({
            url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/jira/epics`,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': `application/json`,
            },
        }).then(res => {
            //console.log("RECEIVED RESPONSE FROM EPICS",res)
            var epics = res.data
            if(epics){
                commit("RECORD_EPICS", epics)
            }
            commit("SET_EPICS_LOADING", true)
            commit('ADD_TO_LOADED_MODULES', 'epics')
            commit('SET_MODULE_LOADED', 'epics')
        }).catch(err => {
            commit("SET_EPICS_LOADING", true)
            console.log(err)
        })
    },
    async fetchNewsLetter({commit}){
        commit("SET_NEWSLETTER_LOADED", false)
        //console.log("SENDING NEWSLETTER REQUEST")
        await axios({
            url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/jira/newsletter`,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': `application/json`,
            },
        }).then(res => {
            //console.log("RECEIVED RESPONSE FROM NEWSLETTER",res)
            var newsLetter = res.data
            if(newsLetter){
                commit("RECORD_NEWSLETTER", newsLetter)
            }
            commit("SET_NEWSLETTER_LOADED", true)
            commit('ADD_TO_LOADED_MODULES', 'newsletter')
            commit('SET_MODULE_LOADED', 'newsletter')
        }).catch(err => {
            commit("SET_NEWSLETTER_LOADED", true)
            console.log(err)
        })
    },
    async loadData(){
        // store.dispatch('fetchAllIssues')
        // store.dispatch('fetchPmTasks')
        // store.dispatch('fetchEpics')
        store.dispatch('fetchNewsLetter')
        store.dispatch('fetchAllData')
    },
    async fetchAllData({commit}){
            commit('ADD_REQUEST_COUNT', '1')
            await axios({
                url: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}/jira/all`,
                method: 'get',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': `application/json`,
                },
            }).then(res => {
                //console.log("RECEIVED RESPONSE FROM ALL DATA",res)
                var allIss = []
                //var issEpics = []
                allIss.push(...res.data.issues)
                //allIss.push(...res.data.pm)
                //allIss.push(...res.data.epics)
                //console.log(allIss.length)
                var checklist = {}
                var dupes = []
                allIss.map(iss => {
                    if(!checklist[iss.key]){
                        checklist[iss.key] = true
                    }
                    else {
                        dupes.push(iss.key)
                    }
                    
                })
                //console.log("dupes ", dupes)
                commit('RECORD_ISSUES', [...res.data.issues, ...res.data.pm])
                commit("RECORD_EPICS", res.data.epics)
                store.dispatch('createGanttTable', {issues: [...res.data.issues, ...res.data.pm], epics: res.data.epics})
                commit('SET_DATA_LOADED', true)
            }).catch(err => {
                commit("SET_EPICS_LOADING", true)
                // commit("SET_EPICS_LOADING", true)
                commit('SET_PM_TASKS', {})
                commit('SET_ERROR', err.message ? err.message : err)
                commit('SET_DATA_LOADED', true)
                console.log(err)
            })
        //commit("SET_EPICS_LOADING", false)
        ////console.log("SENDING EPIC REQUEST")
        
    },
    async setTimePeriod({commit}, period){
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
    },
    resetLoadedModules({commit}){
        commit('RESET_LOADED_MODULES')
    },
    clearNewsLetter({commit}){
        commit("CLEAR_NEWS_LETTER")
    }
}

// mutations
const mutations = {
    SET_DATA_LOADED(state, bool){
        state.dataLoaded = bool
    },
    CLEAR_NEWS_LETTER(state){
        state.newsLetter = []
        state.newsLetterLoaded = false
    },
    RECORD_NEWSLETTER(state, newsletter){
        state.newsLetter = newsletter
    },
    SET_GANTT_TABLE(state, table){
        state.ganttTable = table
    },
    SET_MODULE_LOADED(state, mod){
        if(mod == 'teams'){
            state.teamsLoaded = true
        }
        if(mod == 'pms'){
            state.pmsLoaded = true
        }
        if(mod == 'epics'){
            state.epicsLoaded = true
        }
    },
    ADD_REQUEST_COUNT(state, attempts){
        state.requestAttempts = attempts
    },
    SET_ALL_DATA(state, data){
        state.allData = data
    },
    ADD_TO_LOADED_MODULES(state, module){
        var modules = []
        if(typeof(state.modulesLoaded) == 'object'){
            modules = [...state.modulesLoaded]
        }
        if(typeof(state.modulesLoaded) == 'object' && state.modulesLoaded.length == 2){
            state.allModulesLoaded = 'true'
            //console.log('LOADED MODULES UPDATED ', state.allModulesLoaded)

        }
        if((typeof(modules) == 'object' && modules.length == 0) || (typeof(modules) == 'object' && modules.length == 1)) {
            modules.push(module)
            state.modulesLoaded = [...modules]
        }
    },
    RESET_LOADED_MODULES(state){
        state.allModulesLoaded = false
    },
    SET_EPICS_LOADING(state, bool){
        state.epicsLoaded = bool
    },
    SET_NEWSLETTER_LOADED(state, bool){
        state.newsLetterLoaded = bool
    },
    RECORD_EPICS(state, epics){
        state.epics = epics
    },
    SET_ROUTE(state, route) {
        state.route = route;
      },
    APPEND_ISSUES(state, issues){
        var all = [...state.allIssues]
        all.push(...issues)
        state.allIssues = all
        //console.log("PM ISSUES ADDED TO ALLISSUES ", all.length)
    },
    CLEAR_ALL(state){
        state.allIssues = []
    },
    RECORD_ISSUES(state, issues){
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
        //console.log("ISSUES ADDED TO ALLISSUES ", all.length)
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
    },
    SET_TEAMS_ISSUES(state, sortedTeams){
        state.sortedTeams = sortedTeams
    },
    CLEAR_DATA(state){
        state.dataLoaded = false
        state.epicsLoaded = false
        state.pmsLoaded = false
        state.teamsLoaded = false
        state.newsLetterLoaded = false
        state.sortedTeams = {}
        state.sorted = {}
        state.allIssues = []
        state.customers= []
        state.assignees = []
        state.pmTasks = {}
        state.newsLetter = []
        // state.groupBy =  'team'
        state.filters = []
        state.blacklistedAssignees = []
        state.mode = 'teams'
        state.route = null
    },
    SET_FILTER(state, filter){
        //console.log("GOT FILTER ", filter)
        var existingFilters = state.filters && state.filters.length > 0 ? [...state.filters] : []
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