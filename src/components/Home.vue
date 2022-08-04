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
            class="button" v-for="(button, index) in buttons" 
            :key="index" :to="button.url" >{{button.name}}
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
                name: 'Dashboard',
                url: '/home/dashboard'
                },
                {
                name: 'All Tasks',
                url: '/home/items'
                },
                {
                name: 'Customers',
                url: '/home/customers'
                },
                {
                name: 'Settings',
                url: '/home/settings'
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
    margin-top: 34px;
    background-color: #06487d;
    margin-left: -10px;
    margin-right: -10px;
    text-align: left;
    height: 50px;
    padding-left:30px;
    
}
.header {
    /* background-color: #126db6; */
    position: absolute;
    top:0px;
    right: 0px;
    left: 0px;
    background-color: #136db9;
    color: white;
    padding: 10px 20px;
    text-align: left;
    height: 22px;
   
}
.filters {
    height: 120px;
    border-radius: 6px;
    border: 1px solid #F6FBFE;
    margin-top: 20px;
    padding: 2%;
    padding-top: 1%;
}
.title-small {
    color: #126db6;
}
</style>