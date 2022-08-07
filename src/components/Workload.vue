<template>
    <div v-if="!getIssuesLoading">
        <div v-if="getGroupBy == 'assignee' && items">
            <div v-for="(name, index) in Object.keys(items)" :key="index" class="list-row">
                <div style="overflow: hidden; position: relative; text-align: center;" class="column ">
                    <div class="name">
                        {{name}}
                    </div>
                    <div>
                        <span style="">Active tasks </span> <span style="color: #4773BA; font-weight: 600; text-decoration: underline;">{{functions.countTasks(items[name])}}</span> 
                    </div>
                    <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: name, skipRefresh: 'false'})">Hide</span>
                </div>
                <div class="column">
                    <div class="title" style="text-align: center">Tech Review <span class="number">{{items[name]['tech review'] ? items[name]['tech review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[name]['tech review']" :key="index+name">
                            <div>
                                <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                            </div>
                            <div class="subject">
                            <span>{{task.fields.summary}}</span>
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
                <div style="text-align: left;" class="column">
                    <div class="title" style="text-align: center">Development Plan <span class="number">{{items[name]['development plan'] ? items[name]['development plan'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[name]['development plan']" :key="index+name">
                            <div>
                                <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                            </div>
                            <div class="subject">
                            <span>{{task.fields.summary}}</span> 
                            <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="title" style="text-align: center">In Development <span class="number">{{items[name]['in development'] ? items[name]['in development'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[name]['in development']" :key="index+name">
                            <div>
                                <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                            </div>
                            <div class="subject">
                            <span>{{task.fields.summary}}</span>
                            <span v-if="task.fields.timeestimate" style="font-style: italic">~{{task.fields.timeestimate}} hours</span>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: task.fields.progress.progress + '%'}"
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
                    <div class="title" style="text-align: center">Paused <span class="number">{{items[name]['paused'] ? items[name]['paused'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[name]['paused']" :key="index+name">
                            <div>
                                <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                            </div>
                            <div class="subject">
                            <span>{{task.fields.summary}}</span>
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
                    <div class="title" style="text-align: center">Code Review <span class="number">{{items[name]['code review'] ? items[name]['code review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[name]['code review']" :key="index+name">
                            <div>
                                <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                            </div>
                            <div class="subject">
                            <span>{{task.fields.summary}}</span>
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
                    <div class="title" style="text-align: center">Testing <span class="number">{{items[name]['testing'] ? items[name]['testing'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[name]['testing']" :key="index+name">
                            <div>
                            <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                            <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                            <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                            </div>
                            <div class="subject">
                            <span>{{task.fields.summary}}</span>
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
        <div v-if="getGroupBy == 'team' && items">
            <div v-for="(team, team_index) in Object.keys(items)" :key="team_index" class="team-row">
                <div style="text-align: left; padding-left: 5px; padding-top: 5px;">
                    <h1 style="margin: 0px; margin-bottom: 10px; padding-left: 7px;">{{team}}</h1>
                </div>
                <div v-for="(name, index) in Object.keys(items[team])" :key="index" class="list-row">
                    <div style="overflow: hidden; position: relative; text-align: center;" class="column ">
                        <div class="name">
                            {{name}}
                        </div>
                        <div>
                            <span style="">Active tasks </span> <span style="color: #4773BA; font-weight: 600; text-decoration: underline;">{{functions.countTasks(items[team][name])}}</span> 
                        </div>
                        <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: name, skipRefresh: 'false'})">Hide</span>
                    </div>
                    <div class="column">
                        <div class="title" style="text-align: center">Tech Review <span class="number">{{items[team][name]['tech review'] ? items[team][name]['tech review'].length : 0}}</span></div>
                        <div class="tasks">
                            <div class="task" v-for="(task, index) in items[team][name]['tech review']" :key="index+name">
                                <div>
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                <span>{{task.fields.summary}}</span>
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
                    <div style="text-align: left;" class="column">
                        <div class="title" style="text-align: center">Development Plan <span class="number">{{items[team][name]['development plan'] ? items[team][name]['development plan'].length : 0}}</span></div>
                        <div class="tasks">
                            <div class="task" v-for="(task, index) in items[team][name]['development plan']" :key="index+name">
                                <div>
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                <span>{{task.fields.summary}}</span> 
                                <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="title" style="text-align: center">In Development <span class="number">{{items[team][name]['in development'] ? items[team][name]['in development'].length : 0}}</span></div>
                        <div class="tasks">
                            <div class="task" v-for="(task, index) in items[team][name]['in development']" :key="index+name">
                                <div>
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                <span>{{task.fields.summary}}</span>
                                <span v-if="task.fields.timeestimate" style="font-style: italic">~{{task.fields.timeestimate}} hours</span>
                                </div>
                                <div class="progress">
                                    <div
                                        class="progress-bar bg-succsess"
                                        role="progressbar"
                                        :style="{ width: task.fields.progress.progress + '%'}"
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
                        <div class="title" style="text-align: center">Paused <span class="number">{{items[team][name]['paused'] ? items[team][name]['paused'].length : 0}}</span></div>
                        <div class="tasks">
                            <div class="task" v-for="(task, index) in items[team][name]['paused']" :key="index+name">
                                <div>
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                <span>{{task.fields.summary}}</span>
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
                        <div class="title" style="text-align: center">Code Review <span class="number">{{items[team][name]['code review'] ? items[team][name]['code review'].length : 0}}</span></div>
                        <div class="tasks">
                            <div class="task" v-for="(task, index) in items[team][name]['code review']" :key="index+name">
                                <div>
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                <span>{{task.fields.summary}}</span>
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
                        <div class="title" style="text-align: center">Testing <span class="number">{{items[team][name]['testing'] ? items[team][name]['testing'].length : 0}}</span></div>
                        <div class="tasks">
                            <div class="task" v-for="(task, index) in items[team][name]['testing']" :key="index+name">
                                <div>
                                <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                <a style="display: inline-block;" target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key"> {{task.key}} </a> 
                                <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                <span>{{task.fields.summary}}</span>
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
            'getGroupBy',
            'getAssigneesList',
            'getAllIssues',
            'getIssuesLoading',
        ]),
        functions: () => FUNCTIONS
    },
    methods: {
        ...mapActions([
            'addAToBlacklist',
            'setGroupBy'
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
    margin-bottom: 5px;
    color: #757575;
    font-weight: bold;
    font-size: 14px;
    height: 16px;
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
    margin-bottom: 15px;
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