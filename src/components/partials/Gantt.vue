<template>
  <div ref="gantt"></div>
</template>

<script>
import {gantt} from 'dhtmlx-gantt';
import {mapActions, mapGetters} from 'vuex'
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
      'getAllModulesLoaded'
    ])
  },
  methods: {
    ...mapActions([
      'fetchEpics',
      'createGanttTable'
    ])
  },
  watch: {
  },
  mounted: async function () {
    // await this.fetchEpics()

      if(this.getAllModulesLoaded && this.getAllModulesLoaded == 3){
        console.log("GETALLMODULESLOADED has 3 modules")

      }
    if(this.getEpicsLoaded == true && this.getEpics.data){
      var epics = {}
      epics.data = [...this.getEpics.data]
        gantt.config.xml_date = "%Y-%m-%d";
        gantt.config.readonly = true;
        gantt.config.show_errors = false;
        gantt.init(this.$refs.gantt);
        gantt.createDataProcessor((entity, action, data, id) => {
          console.log('update')
          this.$emit(`${entity}-updated`, id, action, data);
      });
      //gantt.parse(this.$props.tasks);

      gantt.parse(epics);
    }
  }
}
</script>

<style scoped>
    @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>