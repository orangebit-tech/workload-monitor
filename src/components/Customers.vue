<template>
    <div v-if="!getIssuesLoading" class="items-widget">
       <div v-for="(customer, index) in getCustomers" :key="index">
           <div class="item" >
               {{customer}}
               <!-- <div class="column">
                   <div class="priority-circle" :style="{backgroundColor: functions.getPriority(issue.priority).color}"></div>
                   <a style="display: inline-block;" target="_blank" :href="'https://redmine.maintstar.co/issues/'+issue.id"> {{issue.id}} </a>
               </div>
                <div style="width: 350px; margin-right: 15px;" class="column">
                   {{issue.subject}}
               </div>
               <div class="column">
                   {{issue.firstName}} {{issue.lastName[0]}}
               </div>
               <div class="column">
                   {{issue.tracker}}
               </div>
               <div class="column">
                   {{issue.status}}
               </div>
               <div class="column">
                   {{howLongAgo(issue.created_on)}}
               </div> -->
           </div>
       </div>
    </div>
    <div v-else>
        <Spinner />
    </div>
</template>

<script>
import {mapGetters}     from 'vuex'
import Spinner from './partials/Spinner.vue'
import FUNCTIONS        from '../functions.js'

export default {
    name: 'Customers',
    components: {
        Spinner
    },
    data(){
        return {
            
        }
    },
    computed: {
        ...mapGetters([
            'getCustomers',
            'getIssuesLoading'
        ]),
        functions: () => FUNCTIONS
    },
    methods: {
        filterItems(items){
            var result = []
            if(result.length < 1){
                return items
            }
            return result
        },
    }
}
</script>