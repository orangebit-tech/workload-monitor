<template>
    <div class="display-block">
        <div class="widget">
            <div class="filters">
                <input placeholder="Search" v-model="query" class="filter-option" />
                <div class="filter-options">
                    <span v-click-outside="closeDropdown" class="filter-option">
                        <!-- Sort By -->
                        <div style="display: inline-block; " >
                            <label for="pet-select">Group by:</label>
                            <select v-model="groupBy" name="Group by">
                                <option value="assignee">Assignee</option>
                                <option value="team" style="margin-right: 20px;">Team</option>
                            </select>
                        </div>
                        <!-- Sort By -->
                        <div style="display: inline-block; " >
                            <label style="margin-left: 30px;" for="pet-select">Sort by:</label>
                            <select v-model="sortBy" name="Sort by">
                                <option value="date">Date</option>
                                <option value="priority" style="margin-right: 20px;">Priority</option>
                            </select>
                        </div>
                        <!-- SELECT ASSIGNEES -->
                        <div v-if="getGroupBy == 'assignee'" style="margin-left: 30px;"  class="filter-button" >
                            <!-- Assigneer Filter -->
                            <div @click="openDropdown('assignees')">
                                <span style="margin-right: 20px;">Select Assignees</span>
                                
                            </div>
                            <div  style="min-width: 166px;" v-if="assigneesDropdown == true" class="dropdown">
                                <div>
                                    <div class="assignee">
                                        <span style="color: #757575;">All</span>
                                        <span style="float: right; opacity: 0.8" class="undo">
                                            <input style="" type="checkbox" v-model="all"/> </span>
                                    </div>
                                    <div @click="singleUpdate = true" class="assignee" v-for="(assignee, index) in getAssigneesList" :key="index">
                                        <span style="color: #757575;">{{assignee}}</span>
                                        <span style="float: right; opacity: 0.8" class="undo">
                                            <input style="" type="checkbox" v-model="assigneesList[index]"/> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </span>
                </div>
            </div>
            <Workload :items="getItems()" />
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import FUNCTIONS                from '../functions.js'
import Workload                 from './Workload.vue'
import ClickOutside             from 'vue-click-outside'


export default {
    name: 'Settings',
    components: {
        Workload,
    },
    directives: {
        ClickOutside
    },
    watch: {
        groupBy(n){
            if(n == 'assignee' || n == 'team'){
                this.setGroupBy(n)
            }
        },
        sortBy(n){
            if(n == 'priority' || n == 'date'){
                this.applyFilter(n)
            }
        },
        all(n){
            this.singleUpdate = false
            this.setAll(this.assignees, n)        
        },
        assigneesList(n)  {
            console.log('assignees list updated: ' + n)
            if(n.length >0){
                n.map((a, index) => {
                    if(n[index] == false 
                        && !this.hiddenAssignees.includes(this.getAssigneesList[index])){
                            this.addToBlacklistLocal({name: this.getAssigneesList[index], skipRefresh: this.getAssigneesList.length == index+1 ? 'false' : this.singleUpdate == true ? 'false' : 'true'})
                    }
                    if(n[index] == true 
                        && this.hiddenAssignees.includes(this.getAssigneesList[index])){
                            this.removeFromBlacklist({name: this.getAssigneesList[index], skipRefresh: this.getAssigneesList.length == index+1 ? 'false' : this.singleUpdate == true ? 'false' : 'true'})
                    }
                })
            }
            this.refreshAssigneesList()
        } 
    },
    computed: {
        ...mapGetters({
            getAllIssues:       'getAllIssues',
            getTimePeriod:      'getTimePeriod',
            getSortedIssues:    'getSortedIssues',
            getFilters :        'getFilters',
            hiddenAssignees:    'hiddenAssignees',
            getAssigneesList:   'getAssigneesList',
            getGroupBy:         'getGroupBy',
            getSortedTeams:     'getSortedTeams'
        }),
        assignees: function() { return  this.assigneesList},
        functions: () => FUNCTIONS
    },
    data(){
        return {
            groupBy:                'assignee',
            singleUpdate:           true,
            assigneesDropdown:      false,
            assigneesList:          [],
            query:                  '',
            sortBy:                 '',
            sortByAssignee:         'All',
            allTrueCheck: false,
            all: this.assigneesList && !this.assigneesList.includes('false') ? true: false,
            priorities : [
                {
                    id: 1,
                    priority: 'Emengency',
                    priority_id: '7',
                    color: '#d53e1a',
                },
                {
                    id: 2,
                    priority: 'Immediate',
                    priority_id: '6',
                    color: '#ff9800',
                },
                {
                    id: 3,
                    priority: 'High',
                    priority_id: '3',
                    color: 'yellow',
                },
                {
                    id: 4,
                    priority: 'Normal',
                    priority_id: '4',
                    color: '#5fb037',
                },
                {
                    id: 5,
                    priority: 'Low',
                    priority_id: '5',
                    color: '#E0F0FF',
                }
            ],
        }
    },
    methods: {
        ...mapActions([
            'addAToBlacklist',
            'removeFromBlacklist',
            'sortIssues',
            'setGroupBy',
        ]),
        getItems(){
            console.log(this.getGroupBy)
            console.log(this.functions.searchFilter(this.getSortedIssues, this.query))
            console.log(this.getSortedTeams)
            if(this.getGroupBy && this.getGroupBy == 'assignee'){
                return this.functions.searchFilter(this.getSortedIssues, this.query)
            }
            if(this.getGroupBy && this.getGroupBy == 'team'){
                return this.getSortedTeams
            }
        },
        applyFilter(filter){
            this.sortIssues({items: this.getAllIssues, filters: {sortBy: filter}})
        },
        closeDropdown(){
            this.assigneesDropdown = false
        },
        setAll(lst, bool){
            var list = [...lst]
            if(list){
                if(bool == true){
                    for(var i = 0; i < list.length; i ++){
                        list[i] = true
                    }
                }
                if(bool == false) {
                    for(var j = 0; j < list.length; j ++){
                        list[j] = false
                    }
                }
            }
            if(this.assigneesList !== list){
                this.assigneesList = [...list]
            }
           
        },
        ifAllTrue(lst){
            this.allTrueCheck = true
            var list = [...lst]
            if(!list.includes(false)){
                return true
            }
            return false
        },
        addToBlacklistLocal({name, skipRefresh}){
            this.addAToBlacklist({name, skipRefresh})
        },
        openDropdown(type){
            if(type == 'assignees'){
                this.assigneesDropdown = !this.assigneesDropdown
            }
            this.refreshAssigneesList()
        },
        refreshAssigneesList(){
            console.log('refreshing assignees')
            if(this.getSortedIssues){
                var assignees = this.getAssigneesList
                assignees.map((a, index) => {
                    if(this.hiddenAssignees.includes(a)){
                        this.assigneesList[index] = false
                    }
                    else {
                        this.assigneesList[index] = true
                    }
                })
            }
            if(this.ifAllTrue(this.assigneesList)){
                this.all = true
            }
        }
    },
    created(){
        console.log(this.getSortedTeams)
    }
}
</script>

<style scoped>
.filter-button {
    display: inline-block;
    background-color: #fff;
    border: 1px solid #dedfe0;
    border-radius: 0.215rem;
    cursor: pointer;
    margin-left: 15px;
    min-width: 100px;
    padding-left: 1.072em;
    padding-right: 1.072em;
    line-height: 34px;
    font-size: 1rem;
    -webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%)
}
.select-option {
    padding: 5px;
    color: #757575;
   
}
select {
    border-radius: 0.215rem;
    padding-left: 1.072em;
    padding-right: 1.072em;
    height: 36px !important;
    font-size: 1rem;
    -webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%)
}
.select-option:hover {
     background-color: #136DB9;
}
.select-option:hover span {
     color: #fff;
}
.assignee {
    border-bottom: 1px solid #dedfe0;
    margin-left: 1.072em;
    margin-right: 1.072em;
        padding-top: 4px;
    padding-bottom: 4px;
}
.dropdown {
    position: absolute;
    border-radius: 3px;
    box-shadow: 1px 1px 1px #dedfe0;
    border: 1px solid #dedfe0;
    background-color: white;
    margin-left: -18px;
    margin-top: 5px;
    padding: 5px;
    z-index: 9999;
}
.filter-button span{
    color: #757575;
}
.filter-option select{
    outline: none;
    margin-left: 8px;
    height: 22px;
    border-color: #dedfe0;
    color: #757575;
    
}
.filter-options {
    display:inline-block;
    font-size: 14px;
    margin-left: 15px;
}
.dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #757575;
    display: inline-block;
    opacity: 0.9;
}
.pass {
    background-color: #5fb037;
    -webkit-box-shadow: 0 0 3px #5fb037;
        box-shadow: 0 0 3px #5fb037;
}
.fail {
    background-color: #F5F232;
        -webkit-box-shadow: 0 0 3px #F5F232;
        box-shadow: 0 0 3px #F5F232;
}
h4 {
    color: #757575;
    font-size: 20px;
    letter-spacing: 1px;
    font-weight: 500;
}
.img {
    display: inline-block;
}
img {
    width: 140px;
    border-radius: 6px;;
}
span {
    color: #4773BA;
}
.item {
    padding: 5px;
    display: block;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    text-align: left;
    padding-left: 15px;
}
.item .inner-block {
    vertical-align: top;
    width: 200px;
    display: inline-block;
    padding: 15px;
}
</style>