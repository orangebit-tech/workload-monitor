<template>
    <div class="display-block">
        <div class="">
            <div style="text-align: left" class="assignees">
                <h4 >Hidden assignees</h4>
                <div>
                    <div class="assignee" v-for="(assignee, index) in hiddenAssignees" :key="index">
                        <span style="color: #6d6e71;">{{assignee}}</span>
                        <span style="float: right; margin-top: 3px;" @click="removeFromBlacklistLocal({name: assignee, skipRefresh: 'false'})" class="undo">Undo</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Settings',
    methods: {
        ...mapActions([
            'removeFromBlacklist'
        ]),
        removeFromBlacklistLocal({name, skipRefresh}){
            this.removeFromBlacklist({name, skipRefresh})
            this.$forceUpdate()
        }
    },
    computed: {
        ...mapGetters([
            'hiddenAssignees'
        ])
    }
}
</script>

<style scoped>
    .assignees {
        text-align: left !important;
        max-width: 300px;
    }
    .assignee {
        margin-bottom: 10px;
        
    }
    .undo {
        font-size: 12px;
        margin-left: 15px;
        cursor: pointer;
    }
    .undo:hover {
        color: #FF0000;
    }
</style>