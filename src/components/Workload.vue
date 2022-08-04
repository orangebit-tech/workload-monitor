<template>
    <div v-if="!getIssuesLoading">
        <div v-for="(name, index) in Object.keys(items)" :key="index" class="list-row">
            <div style="position: relative; width: 11%; text-align: center;" class="column ">
                <div class="name">
                    {{name}}
                </div>
                <div>
                    <span style="">Active tasks </span> <span style="color: #126db6; font-weight: 600; text-decoration: underline;">{{functions.countTasks(items[name])}}</span> 
                </div>
                <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: name, skipRefresh: 'false'})">Hide</span>
            </div>
            <div style="text-align: left;" class="column">
                <div class="title" style="text-align: center">New Tasks <span class="number">{{items[name]['new'] ? items[name]['new'].length : 0}}</span></div>
                <div class="tasks">
                    <div class="task" v-for="(task, index) in items[name]['new']" :key="index+name">
                        <div>
                            <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.priority).color}"></div>
                            <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+task.id"> {{task.id}} </a> 
                            <span style="float: right;margin-right: 10px; color: #126db6" class="task-type">{{task.taskType}}</span>
                        </div>
                        <div class="subject">
                           <span>{{task.subject}}</span> 
                           <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title" style="text-align: center">In Progress <span class="number">{{items[name]['in progress'] ? items[name]['in progress'].length : 0}}</span></div>
                <div class="tasks">
                    <div class="task" v-for="(task, index) in items[name]['in progress']" :key="index+name">
                        <div>
                            <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.priority).color}"></div>
                            <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+task.id"> {{task.id}} </a> 
                            <span style="float: right;margin-right: 10px; color: #126db6" class="task-type">{{task.taskType}}</span>
                        </div>
                        <div class="subject">
                           <span>{{task.subject}}</span>
                           <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                        </div>
                        <div class="progress">
                            <div
                                class="progress-bar bg-succsess"
                                role="progressbar"
                                :style="{ width: task.done_ratio + '%'}"
                                aria-valiemin="0"
                                style="border-radius: 0px 6px 6px 0px;"
                                aria-valuemax="100"
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title" style="text-align: center">Details / Assistance <span class="number">{{items[name]['details needed'] ? items[name]['details needed'].length : 0}}</span></div>
                <div class="tasks">
                    <div class="task" v-for="(task, index) in items[name]['details needed']" :key="index+name">
                        <div>
                            <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.priority).color}"></div>
                            <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+task.id"> {{task.id}} </a> 
                            <span style="float: right;margin-right: 10px; color: #126db6" class="task-type">{{task.taskType}}</span>
                        </div>
                        <div class="subject">
                           <span>{{task.subject}}</span>
                           <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                        </div>
                        <div class="progress">
                            <div
                                class="progress-bar bg-succsess"
                                role="progressbar"
                                :style="{ width: parseInt(task.done_ratio) + '%' || 0}"
                                aria-valiemin="0"
                                style="border-radius: 0px 6px 6px 0px;"
                                aria-valuemax="100"
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title" style="text-align: center">Paused <span class="number">{{items[name]['paused'] ? items[name]['paused'].length : 0}}</span></div>
                <div class="tasks">
                    <div class="task" v-for="(task, index) in items[name]['paused']" :key="index+name">
                        <div>
                            <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.priority).color}"></div>
                            <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+task.id"> {{task.id}} </a> 
                            <span style="float: right;margin-right: 10px; color: #126db6" class="task-type">{{task.taskType}}</span>
                        </div>
                        <div class="subject">
                           <span>{{task.subject}}</span>
                           <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                        </div>
                        <div class="progress">
                            <div
                                class="progress-bar bg-succsess"
                                role="progressbar"
                                :style="{ width: parseInt(task.done_ratio) + '%' || 0}"
                                aria-valiemin="0"
                                style="border-radius: 0px 6px 6px 0px;"
                                aria-valuemax="100"
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title" style="text-align: center">Completed <span class="number">{{items[name]['completed'] ? items[name]['completed'].length : 0}}</span></div>
                <div class="tasks">
                    <div class="task" v-for="(task, index) in items[name]['completed']" :key="index+name">
                        <div>
                            <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.priority).color}"></div>
                            <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+task.id"> {{task.id}} </a> 
                            <span style="float: right;margin-right: 10px; color: #126db6" class="task-type">{{task.taskType}}</span>
                        </div>
                        <div class="subject">
                           <span>{{task.subject}}</span>
                           <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                        </div>
                        <div class="progress">
                            <div
                                class="progress-bar bg-succsess"
                                role="progressbar"
                                :style="{ width: task.done_ratio + '%'}"
                                aria-valiemin="0"
                                style="border-radius: 0px 6px 6px 0px;"
                                aria-valuemax="100"
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="title" style="text-align: center">Ready for testing <span class="number">{{items[name]['ready for testing'] ? items[name]['ready for testing'].length : 0}}</span></div>
                <div class="tasks">
                    <div class="task" v-for="(task, index) in items[name]['ready for testing']" :key="index+name">
                        <div>
                           <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.priority).color}"></div>
                           <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+task.id"> {{task.id}} </a> 
                           <span style="float: right;margin-right: 10px; color: #126db6" class="task-type">{{task.taskType}}</span>
                        </div>
                        <div class="subject">
                           <span>{{task.subject}}</span>
                           <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                        </div>
                        <div class="progress">
                            <div
                                class="progress-bar bg-succsess"
                                role="progressbar"
                                :style="{ width: task.done_ratio + '%'}"
                                aria-valiemin="0"
                                style="border-radius: 0px 6px 6px 0px;"
                                aria-valuemax="100"
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <Spinner />
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Spinner                  from './partials/Spinner.vue'
import FUNCTIONS                from '../functions.js'

export default {
    name: 'Workload',
    props: ['items'],
    components: {
        Spinner
    },
    computed: {
        ...mapGetters([
            'getAssigneesList',
            'getAllIssues',
            'getIssuesLoading',
        ]),
        functions: () => FUNCTIONS
    },
    methods: {
        ...mapActions([
            'addAToBlacklist'
        ]),
        addToBlacklistLocal({name, skipRefresh}){
            this.addAToBlacklist({name: name, skipRefresh: skipRefresh})
            console.log(name, ' added to blacklist')
            this.$forceUpdate()
        }
    },
    created(){
        
         console.log(this.getAllIssues)
    }
}
</script>

<style scoped>
::-webkit-scrollbar
{
  display: block;
  width: 4px;  /* for vertical scrollbars */
  height: 12px; /* for horizontal scrollbars */
}
::-webkit-scrollbar-thumb
{
  background-color: #DDDDDD;
  border: 1px solid #DDDDDD;
}
.title {
    margin-bottom: 5px;
    color: #126db6;
    font-weight: bold;
    font-size: 14px;
}
.column {
    overflow-x: hidden !important;
    text-align: left;
    vertical-align: top;
    display: inline-block;
    margin-right: 0.8%;
    width: 12.5%;
    height: 200px;
    max-height: 200px;
    overflow: scroll;
    padding-top: 10px;
    background-color: #F5F5F5;
}
.list-row {
    text-align: center;
    min-height: 100px;
    border-bottom: 1px solid #F5F5F5;
    margin-bottom: 15px;
    padding: 1% 0%;
    border-radius: 6px;
}
.name {
    font-size: 22px;
    margin-bottom: 15px;
    color: #6d6e71;
}
.tasks {
    color: #6d6e71;
}
.task {
    font-size: 14px;
    margin-bottom: 5px;
    padding-top: 3px;
    padding-left: 3px;
}
.number {
    text-decoration: underline;
}
.priority-circle {
    margin-right: 5px;
    margin-left: 3px;
}
.subject {
    margin-left: 5px;
    margin-top: 4px;
    margin-bottom: 2px;
}
.progress {
    border: 1px solid #DDDDDD;
    position: relative;
    margin-left: 4px;
    margin-top: 2px;
    margin-bottom: 2px;
    margin-right: 6px;
    opacity: 0.7;
    margin-top:3px;
    background-color: #EBEAEA;
}
.progress-bar{
    background-color: #126db6;
    transition: 0.3s;
    height: 6px;
}
.hide-button {
    font-size: 12px;
    cursor: pointer;
}
.hide-button:hover {
    color: #FF0000;
}
</style>