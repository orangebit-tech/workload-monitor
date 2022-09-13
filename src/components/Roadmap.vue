<template>
    <div v-if="getEpicsLoaded == true" class="items-widget">
        <div class="container1">
            <gantt class="left-container"></gantt>
        </div>
    </div>
    <div v-else>
        <Spinner />
    </div>
</template>

<script>
import {mapGetters, mapActions}     from 'vuex'
import Spinner                      from './partials/Spinner.vue'
import FUNCTIONS                    from '../functions.js'
import Gantt                        from './partials/Gantt.vue'

export default {
    name: 'Departments',
    components: {
        Spinner,
        Gantt
    },
    
    data(){
        return {

        }
    },
    computed: {
        ...mapGetters([
            'getDepartments',
            'getEpicsLoaded',
            'getAllIssues',
            'getEpics',
            'getAllModulesLoaded'
        ]),
        functions: () => FUNCTIONS,
    },
    methods: {
        ...mapActions([
            'fetchEpics'
        ]),
        filterItems(items){
            var result = []
            if(result.length < 1){
                return items
            }
            return result
        },
    },
}
</script>

<style scoped>
  .container1 {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 33px;
  }

  .left-container {
    overflow: hidden;
    position: relative;
    position: fixed;
    left: 2.5%;
    right: 2.5%;
    bottom: 0px;
    top: 130px;
  }
</style>
<style>
.gantt_layout_cell {

}
</style>