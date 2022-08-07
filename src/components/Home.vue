<template>
    <div>
    <div class="header">
      <Header class="wide"/>
            <!-- <NavbarMob :buttons="buttons"/> -->
      </div>
        <div class="main-frame">
            <!-- <div class="time-period-switch">
                <select :value="timePeriod" class="select" v-model="timePeriod">
                    <option  v-for="(option, index) in timeOoptions" :key="index">
                        {{option.name}}
                    </option>
                </select>
            </div> -->
        </div>
        <div class="buttons">
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
        </div>
        <!-- <div class="display-block filters">
            <span class="title-small">Filters</span>
        </div> -->
        <div class="router-2">
            <router-view></router-view>
        </div>

    </div>
</template>

<script>
import Header from './Header.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Home',
    components: {
        
        Header
    },
    watch: {
        timePeriod(n){
            console.log('timeperiod v-model: ', n)
            this.setTimePeriod(this.convertTime(n, this.timeOoptions))
        }
    },
    computed: {
        ...mapGetters([
            'getIssuesLoading',
            'getTimePeriod'
        ])
    },
    data(){
        return {
            timePeriod: 'Last Week',
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
                name: 'Tasks',
                url: '/home/items',
                icon: 'ClipboardCheck'
                },
                {
                name: 'Departments',
                url: '/home/departments',
                icon: 'ViewCompact'
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
            'fetchAllIssues'
        ]),
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
    created(){
         this.fetchAllIssues(this.getTimePeriod)
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
    /* background-color: #4773BA; */
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
    padding-left:0px;
}
.title-small {
    color: #757575;
}
</style>