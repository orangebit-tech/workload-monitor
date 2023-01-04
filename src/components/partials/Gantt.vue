<template>
  <div ref="gantt">{{prepareEpics()}}</div>
</template>

<script>
import {gantt} from 'dhtmlx-gantt';
import {mapActions, mapGetters} from 'vuex'
import _ from 'lodash';
export default {
  name: 'gantt',
  props: {
    tasks: {
      type: Object,
      default () {
        return {data: [], links: []}
      }
    }
  },
  data(){
    return {
      
    }
  },
  computed: {
    ...mapGetters([
      'getEpicsLoaded',
      'getAllIssues',
      'getEpics',
      'getAllModulesLoaded',
      'getGanttTable',
      'getTeamsLoaded',
      'getPmsLoaded',
      'getDataLoaded',
    ])
  },
  methods: {
    ...mapActions([
      'fetchEpics',
      'createGanttTable'
    ]),
    update(){
      //console.log("HELLO")
    },
    prepareEpics(){
      //console.log('preparing epics ', this.getEpics)
      //if(this.getEpicsLoaded == true && this.getEpics.data){
      if(this.getDataLoaded == true){
        //console.log("getDataLoaded: true, gantt table: ", this.getGanttTable)
        var epics = {}
        var data = _.cloneDeep(this.getGanttTable)
        epics.data = data
          gantt.config.xml_date = "%Y-%m-%d";
          gantt.config.branch_loading = true
          gantt.config.readonly = true;
          gantt.config.show_errors = false;
          gantt.config.columns = [
              {name: "text", label: "Name", tree: true, width: 200, resize: true},
              {name: "start_date", label: "Start", width:100, align: "center", resize: true},
              {name: "end_date", label: "Finish", width:100, align: "center", resize: true}
          ];
          gantt.init(this.$refs.gantt);
          gantt.config.scales = [
              {unit: "month", step: 1, format: "%F, %Y"},
              // {unit: "week", step: 1, format: weekScaleTemplate},
              // {unit: "day", step:1, format: "%D", css:daysStyle }
          ];
          gantt.createDataProcessor((entity, action, data, id) => {
            //console.log('update')
            this.$emit(`${entity}-updated`, id, action, data);
          });
        //gantt.parse(this.$props.tasks);
        gantt.parse(epics);
      }
    }
  },
  watch: {
  },
  updated(){
    this.prepareEpics()
  },
  mounted: async function () {
    if(this.getAllModulesLoaded && this.getAllModulesLoaded == 3){
      //console.log("GETALLMODULESLOADED has 3 modules")
    }
    this.prepareEpics()
    
  }
}
</script>

<style scoped>
    @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>