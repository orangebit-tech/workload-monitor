<template>
    <div v-if="!getIssuesLoading" class="items-widget">
        <div class="filters">
            <input style="font-size: 14px;" placeholder="Search" v-model="query" class="filter-option" />
        </div>
        <div class="column-names">
            <div class="item">
            <div style="width: 8%;" class="column">
                <div :class="{active: ifActiveOption('Priority')}" @click="setFilter('Priority')"  class="priority-circle" :style="{backgroundColor: 'transparent'}"></div>
                <a :class="{active: ifActiveOption('ID')}" @click="setFilter('ID')" style="display: inline-block;"> ID </a>
            </div>
            <div style="width: 29%; margin-right: 1%; max-width: 350px" class="column">
                <a  :class="{active: ifActiveOption('Subject')}" @click="setFilter('Subject')">Subject</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Assignee')}" @click="setFilter('Assignee')">Assignee</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Assignee')}" @click="setFilter('Customer')">Customer</a>
            </div>
            <div style="width: 7%;" class="column">
                <a :class="{active: ifActiveOption('Tracker')}" @click="setFilter('Tracker')">Tracker</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Status')}" @click="setFilter('Status')">Status</a>
            </div>
            <div class="column">
                <a :class="{active: ifActiveOption('Date Created')}" @click="setFilter('Date Created')">Date Created</a>
            </div>
            </div>
        </div>
       <div v-for="(issue, index) in sortItems(functions.searchFilter(getAllIssues, query), filters[0])" :key="index">
           <div class="item" >
               <div style="width: 8%" class="column">
                   <div class="priority-circle" :style="{backgroundColor: functions.getPriority(issue.priority).color}"></div>
                   <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+issue.id"> {{issue.id}} </a>
               </div>
                <div style="width: 29%; margin-right: 1%; max-width: 350px" class="column">
                   {{issue.subject}}
               </div>
               <div class="column">
                   {{issue.firstName}} {{issue.lastName[0]}}
               </div>
               <div class="column">
                   {{issue.permitCustomer}}
               </div>
               <div style="width: 7%" class="column">
                   {{issue.tracker}}
               </div>
               <div class="column">
                   {{issue.status}}
               </div>
               <div class="column">
                   {{functions.howLongAgo(issue.created_on)}}
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
            filters: [
                'ID'
            ],
            query: ''
        }
    },
    methods: {
        sortItems(items, filterBy){
            var result = [...items]
            if(filterBy == 'ID'){
                return result.sort((a,b) => a.id > b.id)
            }
            if(filterBy == 'Subject'){
                return result.sort((a,b) => a.subject.localeCompare(b.subject))
            }
            if(filterBy == 'Assignee'){
                return result.sort((a,b) => a.firstName.localeCompare(b.firstName))
            }
            if(filterBy == 'Customer'){
                return result.sort((a,b) => a.permitCustomer.localeCompare(b.permitCustomer))
            }
            if(filterBy == 'Tracker'){
                return result.sort((a,b) => a.tracker.localeCompare(b.tracker))
            }
            if(filterBy == 'Status'){
                return result.sort((a,b) => a.status.localeCompare(b.status))
            }
            if(filterBy == 'Priority'){
                return result.sort((a,b) => a.priority.localeCompare(b.priority))
            }
            if(result.length < 1){
                return items
            }
            return result
        },
        setFilter(option){
            if(!this.filters.includes(option)){
                this.filters = []
                this.filters.push(option)
            }
            else {
                this.filters.splice(this.filters.indexOf(option), 1)
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
            'getSortedIssues'
        ]),
        functions: () => FUNCTIONS
    }
}
</script>

<style>
.filters {
    text-align: left;
    padding: 15px;
    border-bottom: 1px solid #F6FBFE;
    margin-bottom: 15px;
}
.filters input {
    border: 1px solid #CBD8E4;
    padding-left: 5px;
    padding-top:2px;
    padding-bottom: 2px;
    padding-right: 2px;
}
.active {
    color: #7bc143;
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
    border:1px solid #126db6;
    cursor: pointer;
}
.column-names .column .priority-circle:hover{
    background-color: #7bc143 !important;
}
.column-names .column .priority-circle.active {
    background-color: #7bc143 !important;
}
.item {
    font-size: 14px;
}
.column {
    padding-top: 7px;
    width: 10%;
    display: inline-block;
    border-right: 1px solid #F6FBFE;
    margin-right: 1%;
    vertical-align: middle;
    color: #6d6e71;
    padding-left: 5px;
    padding-right: 5px;
}
</style>