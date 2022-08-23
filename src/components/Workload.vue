<template>
    <div v-if="!getIssuesLoading">
        <div v-if="items && $route.name == 'Dashboard'">
            <div v-for="(item, index) in Object.keys(items).sort((a, b) => a.localeCompare(b))" :key="index" class="list-row">
                <div style="overflow: hidden; position: relative; text-align: center; width: 11.5%;" class="column ">
                    <div class="name">
                        {{item}}
                    </div>
                    <div v-if="getGroupBy == 'team'" class="occupation">
                        {{getOccupation(item)}}
                    </div>
                    <div>
                        <span style="">Tasks </span> <span style="color: #4773BA; font-weight: 600; text-decoration: underline;">{{functions.countTasks(items[item])}}</span> 
                    </div>
                    <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: item, skipRefresh: 'false'})">Hide</span>
                </div>
                <div class="column">
                    <div class="title" style="text-align: center">Tech Review <span class="number">{{items[item]['tech review'] ? items[item]['tech review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['tech review']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>

                                <div v-if="task.progress">

                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>

                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="100"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="text-align: left;" class="column">
                    <div class="title" style="text-align: center">Development Plan <span class="number">{{items[item]['development plan'] ? items[item]['development plan'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['development plan']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="title" style="text-align: center">In Development <span class="number">{{items[item]['in development'] ? items[item]['in development'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['in development']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    :aria-valuemax="task.fields.progress.total"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="title" style="text-align: center">Paused <span class="number">{{items[item]['paused'] ? items[item]['paused'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['paused']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
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
                    <div class="title" style="text-align: center">Code Review <span class="number">{{items[item]['code review'] ? items[item]['code review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['code review']" :key="index+item">
                           <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
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
                    <div class="title" style="text-align: center">Testing <span class="number">{{items[item]['testing'] ? items[item]['testing'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['testing']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
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
        <div v-if="items && $route.name == 'PMBoard'">
            <div v-for="(item, index) in Object.keys(items).sort((a, b) => a.localeCompare(b))" :key="index" class="list-row">
                <div style="overflow: hidden; position: relative; text-align: center; width: 11.5%;" class="column ">
                    <div class="name">
                        {{item}}
                    </div>
                    <div>
                        <span style="">Tasks </span> <span style="color: #4773BA; font-weight: 600; text-decoration: underline;">{{functions.countTasks(items[item])}}</span> 
                    </div>
                    <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: item, skipRefresh: 'false'})">Hide</span>
                </div>
                <!-- BACKLOG -->
                <div class="column">
                    <div class="title" style="text-align: center">Backlog <span class="number">{{items[item]['backlog'] ? items[item]['backlog'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['backlog']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="100"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- REVIEW -->
                <div style="text-align: left;" class="column">
                    <div class="title" style="text-align: center">Review <span class="number">{{items[item]['review'] ? items[item]['review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['review']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- IN PROGRESS -->
                <div class="column">
                    <div class="title" style="text-align: center">In Progress <span class="number">{{items[item]['in progress'] ? items[item]['in progress'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['in progress']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    :aria-valuemax="task.fields.progress.total"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- PAUSED -->
                <div class="column">
                    <div class="title" style="text-align: center">Paused <span class="number">{{items[item]['paused'] ? items[item]['paused'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['paused']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="100"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- QC -->
                <div class="column">
                    <div class="title" style="text-align: center">QC <span class="number">{{items[item]['qc'] ? items[item]['qc'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['qc']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="100"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- DONE -->
                <div class="column">
                    <div class="title" style="text-align: center">Done <span class="number">{{items[item]['done'] ? items[item]['done'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['done']" :key="index+item">
                           <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                        <div v-if="task.fields.parent">
                                            <span style="font-weight: bold;">Epic: </span>
                                            <a target="_blank" :href="'https://americor.atlassian.net/browse/'+task.fields.parent.key"  style="color: #4773ba" @click="viewTask(task)">{{task.fields.parent ? task.fields.parent.fields.summary : ''}}</a>
                                        </div>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: 0}"
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
    props: ['items', 'groupBy'],
    components: {
        Spinner
    },
    computed: {
        ...mapGetters([
            'getGroupBy',
            'getAssigneesList',
            'getAllIssues',
            'getIssuesLoading',
            'getRoute'
        ]),
        functions: () => FUNCTIONS
    },
    methods: {
        ...mapActions([
            'addAToBlacklist',
            'setGroupBy',
        ]),
        viewTask(task){
            console.log(task)
        },
        getMode(){
            return this.$route.name
        },
        itemsKeys(items){
            var keys = []
            if(items){
                keys = Object.keys(items).filter(item => item !== 'Unassigned')
                keys.push('Unassigned')
            }
            return keys

        },
        addToBlacklistLocal({name, skipRefresh}){
            this.addAToBlacklist({name: name, skipRefresh: skipRefresh})
            console.log(name, ' added to blacklist')
            this.$forceUpdate()
        },
        getOccupation(team){
            console.log("GOT TEAM ", team)
            if(team.toLowerCase() == 'damdinov team'){
                return '(Debt Settlement / Payments)'
            }
            if(team.toLowerCase() == 'andreev team'){
                return '(Sales / LOS)'
            }
            if(team.toLowerCase() == 'plotnikov team'){
                return ' (Communications / Loans)'
            }
        }
    },
    updated(){
        console.log('UPDATED')
    },
    created(){
    }
}
</script>

<style scoped>
h1 {
    color: #4773ba;
    padding-top: 10px;
}
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
    color: #757575;
    font-weight: bold;
    font-size: 14px;
    height: 33px;
    padding-top: 10px;
    position: sticky;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: white;
    z-index: 2;
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
    background-color: #ffffff;
    border-radius: 4px;
    padding-bottom: 10px;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 15%);
}
.team-row {
    border-radius: 3px;
    /* background-color: #3F79B9; */
    margin-bottom: 15px;
}
.list-row {
    text-align: center;
    min-height: 100px;
    padding: 1% 1%;
    border-radius: 6px;
}
.name {
    font-size: 22px;
    margin-bottom: 10px;
    padding-top: 10px;
    /* color: #4773ba; */
    font-weight: bold;
}
.tasks {
    color: #757575;
}
.task {
    font-size: 14px;
    margin-bottom: 5px;
    padding-top: 3px;
    padding-left: 1px;
    overflow: hidden;
}
.number {
    text-decoration: underline;
}
.priority-circle {
    margin-right: 5px;
    margin-left: 3px;
    display: inline-block;
    vertical-align: -webkit-baseline-middle;
}
.occupation {
    margin-bottom: 25px;
}
.subject {
   
    margin-top: 4px;
    margin-bottom: 2px;
    display: inline-block;
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
a {
        text-decoration: none;
        color: #757575;
}
a:hover {
    color: #4773BA;
}
.progress-bar{
    background-color: #4773BA;
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