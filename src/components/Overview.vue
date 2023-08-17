<template>
    <div class="main-view border-light shadow">
        <h1>Newsletter (week of <span>{{showWeek(date)}}</span>)</h1>
        <div v-if="getNewsLetterLoaded == true || makeAlive == true" class="notes">
            <!-- NEWSLETTER -->
            <div v-for="(issue, index) in getNewsLetter.issues" :key="index" class="note border-light shadow">

                <div v-for="(content, inde) in issue.fields.description.content" :key="inde">
                    <div v-if="content.type == 'heading'">
                        <div style="margin-bottom: 15px;" v-for="(el, ind) in content.content" :key="ind">
                            <h1 v-if="content.attrs && content.attrs.level == 1" style="background-color: red" >{{el.text}}</h1>
                            <h2 v-if="content.attrs && content.attrs.level == 2">{{el.text}}</h2>
                            <h3 v-if="content.attrs && content.attrs.level == 3">{{el.text}}</h3>
                            <h4 v-if="content.attrs && content.attrs.level == 4">{{el.text}}</h4>
                            <h5 v-if="content.attrs && content.attrs.level == 5">{{el.text}}</h5>
                            <h6 v-if="content.attrs && content.attrs.level == 6">{{el.text}}</h6>
                        </div>
                    </div>
                    <div style="padding: 20px; padding-bottom: 5px; text-align: left; " v-if="content.type == 'paragraph'">
                        <div class="paragraph" v-for="(el, ind) in content.content" :key="ind" style="text-align: left;" :style="getStyles(el.marks)">
                            {{el.text}}
                        </div>
                    </div>
                    <!-- <div v-for="(element, ind) in content.content" :key="ind">
                        <div v-if="element.type == 'text'">
                            <span>{{element.text}}</span>
                        </div>
                    </div> -->
                    <!-- {{doc}} -->
                </div>
                <!-- {{issue.fields.description}} -->
            </div>
            <!-- <div class="note border-light shadow">
                Note 2
            </div> -->
        </div>
        <div v-else>
            <Spinner />
        </div>
    </div>

</template>

<script>
import Spinner from './partials/Spinner'
import {mapGetters} from 'vuex'
export default {
    name: 'Overview',
    components: {
        Spinner
    },
    computed: {
        ...mapGetters([
            'getNewsLetterLoaded',
            'getNewsLetter'
        ])
    },
    data(){
        return {
            date: new Date(),
            makeAlive: false,
        }
    },
    methods: {
        getStyles(marks){
            var styles = []
            if(marks){
                marks.map((mark) => {
                    if(mark.type == 'strong'){
                        styles.push('font-weight: bold;')
                    }
                })
            }
            return styles.join('')
        },
        showWeek(date){
            var newDate  = new Date(date)
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            if(newDate.getDay() == '0'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate()-6)
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
            if(newDate.getDay() == '1'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate())
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
            if(newDate.getDay() == '2'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate()-1)
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
            if(newDate.getDay() == '3'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate()-2)
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
            if(newDate.getDay() == '4'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate()-3)
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
            if(newDate.getDay() == '5'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate()-4)
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
            if(newDate.getDay() == '6'){
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate()-5)
                return monthNames[weekStart.getMonth()] + ' ' +weekStart.getDate()
            }
        },
    },
    mounted(){
        // if(this.getNewsLetter && this.getNewsLetter !== []){
        //     this.makeAlive = true
        // }
    },
    created(){
        //console.log(process.env.VUE_APP_SERVER_HOST)
        setTimeout(() => {
            if(this.getNewsLetterLoaded == true){
                this.makeAlive = true
                //console.log("MakeAllive")
            }
        }, 4000);
    },
    beforeDestroy(){
        this.makeAlive = false
    }
}
</script>

<style>
.paragraph {
    display: inline;
    color: #757575
}
.notes {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    min-height: 46vh;
}
.note {
    width: 49%;
    padding: 20px;
    /* border: 1px solid #757575; */
    border-radius: 6px;
}
.main-view {
    position: absolute;
    top: 132px;
    left: 20px;
    right: 20px;
    /* bottom: 20px; */
    background-color: white;
    padding: 20px;


}
</style>