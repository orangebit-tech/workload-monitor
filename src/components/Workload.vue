<template>
    <div v-if="getDataLoaded == true" >
        <div v-if="items && $route.name == 'Dashboard'">
            <div v-for="(item, index) in Object.keys(items).sort((a, b) => a.localeCompare(b))" :key="index" class="list-row">
                <div class="column primary-column">
                    <!-- <div class="ava">
                        <img :src="" alt="">
                    </div> -->
                    <div class="name">
                        {{item}}
                    </div>
                    <div v-if="getGroupBy == 'team'" class="occupation">
                        {{getOccupation(item)}}
                    </div>
                    <div class="tasks-widget">
                        <div style="text-align: left; margin-bottom: 5px;">
                            <span style="font-weight: bold">Tasks</span> <span style="font-weight: 600; float: right;">{{functions.countTasks(items[item]).total}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(1).color}"></div>
                            <span>Highest</span> <span style="float: right;">{{functions.countTasks(items[item]).highest}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(2).color}"></div>
                            <span>High</span> <span style="float: right;">{{functions.countTasks(items[item]).high}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(3).color}"></div>
                            <span>Medium</span> <span style="float: right;">{{functions.countTasks(items[item]).medium}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(4).color}"></div>
                            <span>Low</span> <span style="float: right;">{{functions.countTasks(items[item]).low}}</span> 
                        </div>

                    </div>
                    <!-- <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: item, skipRefresh: 'false'})">Hide</span> -->
                </div>
                <!-- BACKLOG -->
                <!-- <div class="column">
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
                </div> -->
                <!-- Tech Review -->
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
                <!-- Development Plan -->
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
                <!-- In Development -->
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
                <!-- Paused -->
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
                <!-- Code Review -->
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
                <!-- Testing -->
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
                <div class="column primary-column">
                    <div class="name">
                        {{item}}
                    </div>
                    <div class="tasks-widget">
                        <div style="text-align: left; margin-bottom: 5px;">
                            <span style="font-weight: bold">Tasks</span> <span style="font-weight: 600; float: right;">{{functions.countTasks(items[item]).total}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(1).color}"></div>
                            <span>Highest</span> <span style="float: right;">{{functions.countTasks(items[item]).highest}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(2).color}"></div>
                            <span>High</span> <span style="float: right;">{{functions.countTasks(items[item]).high}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(3).color}"></div>
                            <span>Medium</span> <span style="float: right;">{{functions.countTasks(items[item]).medium}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(4).color}"></div>
                            <span>Low</span> <span style="float: right;">{{functions.countTasks(items[item]).low}}</span> 
                        </div>

                    </div>
                    <!-- <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: item, skipRefresh: 'false'})">Hide</span> -->
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
        <div v-if="items && $route.name == 'Departments'">
            <div v-for="(item, index) in Object.keys(items).sort((a, b) => a.localeCompare(b))" :key="index" class="list-row">
                <div class="column primary-column">
                    <div class="name">
                        {{item}}
                    </div>
                    <div class="tasks-widget">
                        <div style="text-align: left; margin-bottom: 5px;">
                            <span style="font-weight: bold">Tasks</span> <span style="font-weight: 600; float: right;">{{functions.countTasks(items[item]).total}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(1).color}"></div>
                            <span>Highest</span> <span style="float: right;">{{functions.countTasks(items[item]).highest}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(2).color}"></div>
                            <span>High</span> <span style="float: right;">{{functions.countTasks(items[item]).high}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(3).color}"></div>
                            <span>Medium</span> <span style="float: right;">{{functions.countTasks(items[item]).medium}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(4).color}"></div>
                            <span>Low</span> <span style="float: right;">{{functions.countTasks(items[item]).low}}</span> 
                        </div>

                    </div>
                    <!-- <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: item, skipRefresh: 'false'})">Hide</span> -->
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
                    <div class="title" style="text-align: center">Tech Review <span class="number">{{items[item]['tech review'] ? items[item]['tech review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['tech review']" :key="index+item">
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
                <!-- Development Plan -->
                <div class="column">
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
                <!-- In Development -->
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
                                    aria-valuemax="100"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Paused -->
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
                <!-- Team Code Review -->
                <div class="column">
                    <div class="title" style="text-align: center">Team Code Review <span class="number">{{items[item]['team code review'] ? items[item]['team code review'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['team code review']" :key="index+item">
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
                <!-- Code Review -->
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
                <!-- Testing -->
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
                <!-- Waiting for Release -->
                <div class="column">
                    <div class="title" style="text-align: center">Waiting for Release <span class="number">{{items[item]['waiting for release'] ? items[item]['waiting for release'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['waiting for release']" :key="index+item">
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
        <div v-if="items && $route.name == 'Release Plan'">
            <div v-for="(item, index) in Object.keys(items).sort((a, b) => parseInt(a.replace(/\D/g,'')) - parseInt(b.replace(/\D/g,'')))" :key="index" class="list-row">
                <div class="column primary-column">
                    <div class="name">
                        {{item}}
                    </div>
                    <div class="tasks-widget">
                        <div style="text-align: left; margin-bottom: 5px;">
                            <span style="font-weight: bold">Tasks</span> <span style="font-weight: 600; float: right;">{{functions.countTasks(items[item]).total}}</span> 
                        </div>
                        <!-- <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(1).color}"></div>
                            <span>Highest</span> <span style="float: right;">{{functions.countTasks(items[item]).highest}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(2).color}"></div>
                            <span>High</span> <span style="float: right;">{{functions.countTasks(items[item]).high}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(3).color}"></div>
                            <span>Medium</span> <span style="float: right;">{{functions.countTasks(items[item]).medium}}</span> 
                        </div>
                        <div style="text-align: left;">
                            <div class="priority-circle" style="margin-left: 0px;vertical-align: unset;" :style="{backgroundColor: functions.getPriority(4).color}"></div>
                            <span>Low</span> <span style="float: right;">{{functions.countTasks(items[item]).low}}</span> 
                        </div> -->

                    </div>
                    <!-- <span class="hide-button" style="position: absolute; left: 15px; bottom: 15px;" @click="addToBlacklistLocal({name: item, skipRefresh: 'false'})">Hide</span> -->
                </div>
                <!-- Sales -->
                <div class="column">
                    <div class="title" style="text-align: center">Sales <span class="number">{{items[item]['Sales'] ? items[item]['Sales'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['Sales']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: JSON.stringify(parseInt(task.progress)*10) + '%'}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="10"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Negotiators -->
                <div style="text-align: left;" class="column">
                    <div class="title" style="text-align: center">Negotiators <span class="number">{{items[item]['Negotiators'] ? items[item]['Negotiators'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['Negotiators']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: JSON.stringify(parseInt(task.progress)*10) + '%'}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="10"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Loans -->
                <div class="column">
                    <div class="title" style="text-align: center">Loans <span class="number">{{items[item]['Loans'] ? items[item]['Loans'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['Loans']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: JSON.stringify(parseInt(task.progress)*10) + '%'}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="10"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Payments -->
                <div class="column">
                    <div class="title" style="text-align: center">Payments <span class="number">{{items[item]['Payments'] ? items[item]['Payments'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['Payments']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: JSON.stringify(parseInt(task.progress)*10) + '%'}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="10"
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Marketing -->
                <div class="column">
                    <div class="title" style="text-align: center">Affiliates <span class="number">{{items[item]['Marketing'] ? items[item]['Marketing'].length : 0}}</span></div>
                    <div class="tasks">
                        <div class="task" v-for="(task, index) in items[item]['Marketing']" :key="index+item">
                            <div style="display: flex;">
                                <div style="display: inline-block; width: 20px;">
                                    <div class="priority-circle" :style="{backgroundColor: functions.getPriority(task.fields.priority.id).color}"></div>
                                    <span style="float: right;margin-right: 10px; color: #4773BA" class="task-type">{{task.taskType}}</span>
                                </div>
                                <div class="subject">
                                    <span style="display: inline-block;"> 
                                        <a  target="_blank" :href="'https://americor.atlassian.net/browse/'+task.key" @click="viewTask(task)">{{task.fields.summary}}</a>
                                    </span> 
                                    <span v-if="task.estimated_hours" style="font-style: italic">~{{task.estimated_hours}} hours</span>
                                </div>
                            </div>
                            <div class="progress">
                                <div
                                    class="progress-bar bg-succsess"
                                    role="progressbar"
                                    :style="{ width: JSON.stringify(parseInt(task.progress)*10) + '%'}"
                                    aria-valiemin="0"
                                    style="border-radius: 0px 6px 6px 0px;"
                                    aria-valuemax="10"
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
import FUNCTIONS                from '../functions.js'
import Spinner                  from './partials/Spinner.vue'


export default {
    name: 'Workload',
    props: ['items', 'groupBy'],
    components: {
        Spinner
    },
    computed: {
        ...mapGetters([
            'getGroupBy',
            'getIssuesLoading',
            'getEpics',
            'getDataLoaded'
        ]),
        functions: () => FUNCTIONS
    },
    methods: {
        ...mapActions([
            'addAToBlacklist',
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
            //console.log(name, ' added to blacklist')
            this.$forceUpdate()
        },
        getOccupation(team){
            if(team.toLowerCase() == 'damdinov team'){
                return '(Debt Settlement / Payments)'
            }
            if(team.toLowerCase() == 'andreev team'){
                return '(Sales / LOS)'
            }
            if(team.toLowerCase() == 'plotnikov team'){
                return ' (Communications / Loans)'
            }
        },
        
    },
    created(){
        //console.log('EPICS ', this.getEpics)
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
    color: #4683c7;
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
    width: 100%;
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
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-top: 5px;
}
.name {
    font-size: 20px;
    margin-bottom: 2px;
    padding-top: 13px;
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
    /* text-decoration: underline; */
}
.priority-circle {
    margin-right: 5px;
    margin-left: 3px;
    display: inline-block;
    vertical-align: -webkit-baseline-middle;
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