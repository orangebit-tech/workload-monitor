<template>
    <div v-if="!getIssuesLoading" class="display-block items-widget">
        <div class="filters">
            <input placeholder="Search" v-model="query" class="filter-option" />
            <div class="filter-options">
                <span v-click-outside="closeDropdown" class="filter-option">
                    <!-- Sort By -->
                    <div style="display: inline-block; " >
                        <label style="margin-left: 30px;" for="pet-select">Show:</label>
                        <select v-model="mode" name="Sort by">
                            <option value="">All</option>
                            <option value="active" style="margin-right: 20px;">Active only</option>
                            <option value="pm" style="margin-right: 20px;">Active with missing target/due dates</option>
                        </select>
                    </div>
                </span>
            </div>
            <div style="float: right;margin-right: 15px;" class="tasks-count">
                <span style="color: #757575"> Showing <span style="font-weight: bold; font-size: 16px; color: #4773BA">{{tasksCount}}</span> {{tasksCount == 1 ? 'task':'tasks'}}</span>
            </div>
        </div>
        <div class="column-names">
            <div class="item">
            <div style="display: inline-block;vertical-align: -webkit-baseline-middle; width: 27px;">#</div>
            <div style="width: 11%;" class="column">
                <div :class="{active: ifActiveOption('Priority')}" @click="setFilter('Priority')"  class="priority-circle" :style="{backgroundColor: 'transparent'}"></div>
                <a :class="{active: ifActiveOption('ID')}" @click="setFilter('ID')" style="display: inline-block;"> Ticket # </a>
            </div>
            <div style="width: 26%; margin-right: 1%; max-width: 350px" class="column">
                <a  :class="{active: ifActiveOption('Subject')}" @click="setFilter('Subject')">Subject</a>
            </div>
            <div class="column" style="width: 7%" >
                <a :class="{active: ifActiveOption('Project Manager')}" @click="setFilter('Project Manager')">Project Manager</a>
            </div>
            <div style="width: 7%;" class="column">
                <a :class="{active: ifActiveOption('Task Type')}" @click="setFilter('Task Type')">Task Type</a>
            </div>
            <div style="width: 8%" class="column">
                <a :class="{active: ifActiveOption('Status')}" @click="setFilter('Status')">Status</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Start Date')}" @click="setFilter('Start Date')">Start Date</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Target Start')}" @click="setFilter('Target Start')">Target Start</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Target End')}" @click="setFilter('Target End')">Target End</a>
            </div>
            </div>
        </div>
       <div v-for="(issue, index) in sortForPM(sortItems(functions.searchFilter(getAllIssues, query, 'pm'), filters), mode)" :key="index">
           <div class="item" >
                <div style="display: inline-block;vertical-align: -webkit-baseline-middle; width: 27px;">{{index+1}}</div>

               <div style="width: 11%; whitespace: nowrap" class="column">
                   <div class="priority-circle" :style="{backgroundColor: functions.getPriority(issue.fields.priority.id).color}"></div>
                   <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+issue.key"> {{issue.key}} </a>
               </div>
                <div style="width: 26%; margin-right: 1%; max-width: 350px" class="column">
                   {{issue.fields.summary}}
               </div>
               <div style="width: 7%" class="column">
                   {{issue.fields.customfield_10106 ? issue.fields.customfield_10106.displayName : 'Unassigned'}}
               </div>
               <div style="width: 7%" class="column">
                   {{issue.fields.issuetype.name}}
               </div>
               <div style="width: 8%" class="column">
                   {{issue.fields.status.name}}
               </div>
               <div class="column">
                   {{functions.showNiceDate(issue.fields.created)}}
               </div>
               <!-- TARGET -->
               <div class="column">
                   {{issue.fields.customfield_10117 ? issue.fields.customfield_10117 : '-'}}
               </div>
               <!-- Target End -->
               <div class="column">
                   {{issue.fields.customfield_10118 ? issue.fields.customfield_10118 : '-'}}
               </div>
           </div>
       </div>
    </div>
    <div v-else>
        <Spinner />
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Spinner from './partials/Spinner.vue'
import FUNCTIONS from '../functions.js'
export default {
    name: 'Items',
    props: ['items'],
    components: {
        Spinner
    },
    data() {
        return {
            filters: [],
            query: '',
            mode: '',
            tasksCount: 0
        }
    },
    methods: {

        sortItems(items, filterBy){
            var result = [...items]
            if(filterBy[0] == 'ID'){
                if(filterBy[1] == 'ID'){
                    return result.sort((a,b) => parseInt(b.key.replace(/\D/g,'')) > parseInt(a.key.replace(/\D/g,'')))
                }
                return result.sort((a,b) => parseInt(a.key.replace(/\D/g,'')) > parseInt(b.key.replace(/\D/g,'')))
            }
            if(filterBy[0] == 'Subject'){
                if(filterBy[1] == 'Subject'){
                    return result.sort((a,b) => b.fields.summary.localeCompare(a.fields.summary))
                }
                return result.sort((a,b) => a.fields.summary.localeCompare(b.fields.summary))
            }
            if(filterBy[0] == 'Project Manager'){
                if(filterBy[1] == 'Project Manager'){
                    return result.sort((a,b) => b.fields.customfield_10106?.displayName.localeCompare(a.fields.customfield_10106?.displayName))
                }
                return result.sort((a,b) => a.fields.customfield_10106?.displayName.localeCompare(b.fields.customfield_10106?.displayName))
            }
            if(filterBy[0] == 'Department'){
                if(filterBy[1] == 'Department'){
                    return result.sort((a,b) => b.fields.customfield10115?.value.localeCompare(a.fields.customfield10115?.value))
                }
                return result.sort((a,b) => a.fields.customfield10115?.value.localeCompare(b.fields.customfield10115?.value))
            }
            if(filterBy[0] == 'Task Type'){
                if(filterBy[1] == 'Task Type'){
                    return result.sort((a,b) => b.fields.issuetype.name.localeCompare(a.fields.issuetype.name))
                }
                return result.sort((a,b) => a.fields.issuetype.name.localeCompare(b.fields.issuetype.name))
            }
            if(filterBy[0] == 'Status'){
                if(filterBy[1] == 'Status'){
                    return result.sort((a,b) => b.fields.status.name.localeCompare(a.fields.status.name))
                }
                return result.sort((a,b) => a.fields.status.name.localeCompare(b.fields.status.name))
            }
            if(filterBy[0] == 'Priority'){
                if(filterBy[1] == 'Priority'){
                    return result.sort((a,b) => parseInt(b.fields.priority.id) - parseInt(a.fields.priority.id))
                }
                return result.sort((a,b) => parseInt(a.fields.priority.id) - parseInt(b.fields.priority.id))
            }
            if(filterBy[0] == 'Start Date'){
                if(filterBy[1] == 'Start Date'){
                    return result.sort((a,b) => {
                        return new Date(a.fields.created).getTime() - new Date(b.fields.created).getTime()
                    })
                }
                return result.sort((a,b) => {
                    return new Date(b.fields.created).getTime() - new Date(a.fields.created).getTime()
                })
            }
            if(filterBy[0] == 'Target Start'){
                if(filterBy[1] == 'Target Start'){
                    return result.sort((a,b) => {
                    return new Date(a.fields.customfield_10117).getTime() - new Date(b.fields.customfield_10117).getTime()
                })
                }
                return result.sort((a,b) => {
                    return new Date(b.fields.customfield_10117).getTime() - new Date(a.fields.customfield_10117).getTime()
                })
            }
            if(filterBy[0] == 'Target End'){
                if(filterBy[1] == 'Target End'){
                    return result.sort((a,b) => {
                    return new Date(a.fields.customfield_10118).getTime() - new Date(b.fields.customfield_10118).getTime()
                })
                }
                return result.sort((a,b) => {
                    return new Date(b.fields.customfield_10118).getTime() - new Date(a.fields.customfield_10118).getTime()
                })
            }
            if(result.length < 1){
                return items
            }
            return result
        },
        sortForPM(items, mode){
            var result = []
            var statusesBlackList = [
                'backlog',
                'done',
                'tech review',
                'to document'
            ]
            var localItems = [...items]
            if(localItems && mode == 'pm'){
                localItems.map(task => {
                    if((!task.fields.customfield_10117 || !task.fields.customfield_10118) && !statusesBlackList.includes(task.fields.status.name.toLowerCase())){
                        if(!result.includes(task)){
                            result.push(task)
                        }
                       
                    }
                })
            }
            if(localItems && mode == 'active'){
                localItems.map(task => {
                    if(!statusesBlackList.includes(task.fields.status.name.toLowerCase())){
                        if(!result.includes(task)){
                            result.push(task)
                        }
                       
                    }
                })
            }
            else {
                result = items
            }
            this.tasksCount = result.length
            return result
        },
        setFilter(option){
            var dups = []
            if(this.filters.length == 0){
                this.filters.unshift(option)
            }
            else if(this.filters.length <2){
                for (var i = 0; i< this.filters.length; i++){
                    if(this.filters[i] == option){
                        dups.unshift(option)
                    }
                }
                if(dups.length < 2) {
                    this.filters.unshift(option)
                }
            }
            else if (this.filters.length == 2){
                for (var j = 0; j< this.filters.length; j++){
                    if(this.filters[j] == option){
                        dups.unshift(option)
                    }
                }
                if(dups.length == 2) {
                    this.filters.pop()
                }
                else {
                     this.filters.pop()
                    this.filters.unshift(option)
                }
            }
            else {
                    this.filters.pop()
                    this.filters.unshift(option)
                }
        },
        ifActiveOption(option){
            if(this.filters.includes(option)){
                return true
            }
            return false
        }
    },
    computed: {
        ...mapGetters([
            'getIssuesLoading',
            'getAllIssues',
        ]),
        functions: () => FUNCTIONS
    }
}
</script>

<style>
.filters {
    text-align: left;
    padding: 20px 0px;
    padding-top: 6px;
}
.filters input {
    border: 1px solid #dedfe0;
    padding-left: 1.072em;
    padding-right: 1.072em;
    line-height: 32px;
    font-size: 1rem;
    -webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
    width: 11%;
}
.filters input[type=checkbox] {
   width: 100%;
}
.active {
    color: #5fb037;
}
input:focus {
    outline: none;
}
.filter-option {
    margin-right: 15px;
}
.item {
    text-align: left;
    border: 1px solid #F6FBFE;
    min-height: 32px;
}
.priority-circle {
    margin-right: 15px;
    margin-left: 15px;
}
.column-names .column a{
    cursor: pointer;
}
.column-names .column .priority-circle{
    border:1px solid #4773BA;
    cursor: pointer;
}
.column-names .column .priority-circle:hover{
    background-color: #5fb037 !important;
}
.column-names .column .priority-circle.active {
    background-color: #5fb037 !important;
}
.item {
    font-size: 14px;
    background-color: white;
    border-radius: 3px;
    padding-left: 15px;
}
.column {
    width: 10%;
    display: inline-block;
    border-right: 1px solid #F6FBFE;
    margin-right: 1%;
    vertical-align: middle;
    color: #757575;
    padding-left: 5px;
    padding-right: 5px;
    overflow: hidden;
}
</style>
<style scoped>
.column {
    padding-top: 7px;
    padding-bottom: 7px;
    width: 10%;
    display: inline-block;
    border-right: 1px solid #F6FBFE;
    margin-right: 1%;
    vertical-align: middle;
    color: #757575;
    padding-left: 5px;
    padding-right: 5px;
    overflow: hidden;
}
</style>