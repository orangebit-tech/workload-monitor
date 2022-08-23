<template>
    <div v-if="!getIssuesLoading" class="display-block items-widget">
        <div class="filters">
            <input placeholder="Search" v-model="query" class="filter-option" />
        </div>
        <div class="column-names">
            <div class="item">
            <div style="width: 11%;" class="column">
                <div :class="{active: ifActiveOption('Priority')}" @click="setFilter('Priority')"  class="priority-circle" :style="{backgroundColor: 'transparent'}"></div>
                <a :class="{active: ifActiveOption('ID')}" @click="setFilter('ID')" style="display: inline-block;"> Key </a>
            </div>
            <div style="width: 29%; margin-right: 1%; max-width: 350px" class="column">
                <a  :class="{active: ifActiveOption('Subject')}" @click="setFilter('Subject')">Subject</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Assignee')}" @click="setFilter('Assignee')">Assignee</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Assignee')}" @click="setFilter('Department')">Department</a>
            </div>
            <div style="width: 7%;" class="column">
                <a :class="{active: ifActiveOption('Tracker')}" @click="setFilter('Tracker')">Tracker</a>
            </div>
            <div style="width: 8%" class="column">
                <a :class="{active: ifActiveOption('Status')}" @click="setFilter('Status')">Status</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Date Created')}" @click="setFilter('Date Created')">Date Created</a>
            </div>
            </div>
        </div>
       <div v-for="(issue, index) in sortItems(functions.searchFilter(getAllIssues, query, 'assignee'), filters)" :key="index">
           <div class="item" >
                <div style="display: inline-block;vertical-align: -webkit-baseline-middle;">{{index+1}}</div>

               <div style="width: 11%; whitespace: nowrap" class="column">
                   <div class="priority-circle" :style="{backgroundColor: functions.getPriority(issue.fields.priority.id).color}"></div>
                   <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+issue.key"> {{issue.key}} </a>
               </div>
                <div style="width: 29%; margin-right: 1%; max-width: 350px" class="column">
                   {{issue.fields.summary}}
               </div>
               <div class="column">
                   {{issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned'}}
               </div>
               <div class="column">
                   {{issue.fields.customfield10115 ? issue.fields.customfield10115.value : ''}}
               </div>
               <div style="width: 7%" class="column">
                   {{issue.fields.issuetype.name}}
               </div>
               <div style="width: 8%" class="column">
                   {{issue.fields.status.name}}
               </div>
               <div class="column">
                   {{functions.howLongAgo(issue.fields.created)}}
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
            query: ''
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
            if(filterBy[0] == 'Assignee'){
                if(filterBy[1] == 'Assignee'){
                    return result.sort((a,b) => b.fields.assignee?.displayName.localeCompare(a.fields.assignee?.displayName))
                }
                return result.sort((a,b) => a.fields.assignee?.displayName.localeCompare(b.fields.assignee?.displayName))
            }
            if(filterBy[0] == 'Department'){
                if(filterBy[1] == 'Department'){
                    return result.sort((a,b) => b.fields.customfield10115?.value.localeCompare(a.fields.customfield10115?.value))
                }
                return result.sort((a,b) => a.fields.customfield10115?.value.localeCompare(b.fields.customfield10115?.value))
            }
            if(filterBy[0] == 'Tracker'){
                if(filterBy[1] == 'Tracker'){
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
            if(filterBy[0] == 'Date Created'){
                if(filterBy[1] == 'Date Created'){
                    return result.sort((a,b) => {
                    return new Date(a.fields.created).getTime() - new Date(b.fields.created).getTime()
                })
                }
                return result.sort((a,b) => {
                    return new Date(b.fields.created).getTime() - new Date(a.fields.created).getTime()
                })
            }
            if(result.length < 1){
                return items
            }
            return result
        },
        setFilter(option){
            console.log('existing filters: ', this.filters)
            console.log('option: ', option)
            var dups = []
            if(this.filters.length == 0){
                this.filters.unshift(option)
                console.log('adding option to empty array')
            }
            else if(this.filters.length <2){
                for (var i = 0; i< this.filters.length; i++){
                    if(this.filters[i] == option){
                        dups.unshift(option)
                    }
                }
                if(dups.length < 2) {
                    console.log()
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
                    // this.filters.unshift(option)
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
            // else {
            //     this.filters.pop()
            // }
            console.log("UPDATED FILTERS", this.filters, this.filters.length)
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
            'getSortedIssues'
        ]),
        functions: () => FUNCTIONS
    }
}
</script>

<style>
.filters {
    text-align: left;
    padding: 18px 0px;
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
    margin-bottom: 16px;
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