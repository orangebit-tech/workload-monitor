<template>
    <div class="main-view border-light shadow">
        <Spinner/>
       
    </div>

</template>

<script>

import Spinner from './partials/Spinner'
import {mapGetters} from 'vuex'
export default {
    name: 'News',
    components: {
        Spinner
    },
    computed: {
        ...mapGetters([
           
        ])
    },
    data(){
        return {
    
        }
    },
    methods: {
        
    },
    mounted(){
      
    },
    created(){

    },
    beforeDestroy(){
     
    }
}
</script>

<style>

</style>