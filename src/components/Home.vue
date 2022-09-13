<template>
    <div>
        <div class="header">
            <Header class="wide"/>
        </div>
        <fullscreen style="background-color: #F3F4F6; overflow-y: scroll; overflow-x: hidden" v-model="fullscreen">
        <div :style="[fullscreen ? {'margin-top': 0+'px'}:{}]" class="buttons">
            <router-link is-active="is-active" 
            :class="{'is-still-active': $route.path.includes(button.name.toLowerCase() + '/')}" 
            class="button top-button" v-for="(button, index) in buttons" 
            :key="index" :to="button.url" >
                <!-- ICON -->
                <ViewCompact v-if="button.icon == 'ViewCompact'" />
                <ClipboardCheck v-if="button.icon == 'ClipboardCheck'" />
                <Cog v-if="button.icon == 'Cog'" />
                <!-- TEXT -->
                {{button.name}}
            </router-link>
            <a style="float: right; margin-right: 40px; cursor: pointer" type="button" :class="{'is-active': fullscreen}" class="button top-button" @click="toggle" >Fullscreen</a>
        </div>
        <div class="router-2">
            <router-view></router-view>
        </div>
        </fullscreen>
    </div>
</template>

<script>
import Header from './Header.vue'
import FUNCTIONS from '../functions.js'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Home',
    components: {
        Header
    },
    watch: {
        timePeriod(n){
            this.setTimePeriod(this.convertTime(n, this.timeOoptions))
        }
    },
    computed: {
        ...mapGetters([
            'getIssuesLoading',
            'getTimePeriod',
            'getAllIssues',
            'getEpics',
        ]),
        functions: () => FUNCTIONS
    },
    data(){
        return {
            timePeriod: 'Last Week',
            fullscreen: false,
            timeOoptions: [
                {
                    name: 'Last year',
                    value: 31556926 * 1000,
                },
                {
                    name: 'Last 6 months',
                    value: 15778458 * 1000,
                },
                {
                    name: 'Last 3 months',
                    value: 7889229 * 1000,
                },
                {
                    name: 'Last month',
                    value: 2629743 *1000,
                },
                {
                    name: 'Last 2 weeks',
                    value: 1209600 *1000,
                },
                {
                    name: 'Last week',
                    value: 604800 *1000,
                },
                {
                    name: 'Last 3 days',
                    value: 259200 *1000,
                },
                {
                    name: 'Last 24 hours',
                    value: 86400 * 1000,
                },
            ],
            buttons: [
                {
                    name: 'Workload',
                    url: '/home/dashboard',
                    icon: 'ViewCompact'
                },
                {
                    name: 'PM Board',
                    url: '/home/pms',
                    icon: 'ViewCompact'
                },
                {
                    name: 'Departments',
                    url: '/home/departments',
                    icon: 'ViewCompact'
                },
                {
                    name: 'Roadmap',
                    url: '/home/roadmap',
                    icon: 'ViewCompact'
                },
                {
                    name: 'Tasks',
                    url: '/home/items',
                    icon: 'ClipboardCheck'
                },
                {
                    name: 'Settings',
                    url: '/home/settings',
                    icon: 'Cog'
                },
            ],
        }
    },
    methods: {
        ...mapActions([
            'setTimePeriod',
            'fetchAllIssues',
            'fetchPmTasks',
            'fetchEpics',
            'loadData',
            'resetLoadedModules'
        ]),
        toggle () {
            this.fullscreen = !this.fullscreen
        },
        toggleApi () {
            this.$fullscreen.toggle()
        },
        convertTime(time, options){
            var result = ''
            options.map(option => {
                if(option.name == time){
                    result = option.value
                }
            })
            return parseInt(result)
        }
    },
    beforeMount(){
        this.loadData(this.getTimePeriod)
    },
    destroyed(){
        this.resetLoadedModules()
    }
}
</script>

<style scoped>
.time-period-switch {
text-align: right;
}
.buttons {
    margin-top: 3.75rem;
    background-color: white;
    margin-left: -10px;
    margin-right: -10px;
    text-align: left;
    height: 4.286rem;
    padding-left:30px;
    -webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%)
}
.header {
    position: absolute;
    top:0px;
    right: 0px;
    left: 0px;
    background-image: linear-gradient(to bottom,#4683c7,#3367a1);
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 15%);
    padding: 0px 20px;
    text-align: left;
    height: 4.286rem;
}
.filters {
    height: 120px;
    border-radius: 6px;
    margin-top: 20px;
    padding: 2%;
    padding-top: 1%;
    padding-left:20px;
}
.title-small {
    color: #757575;
}
</style>