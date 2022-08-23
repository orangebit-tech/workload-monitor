<template>
    <div>
        <div>
            <!-- <div :style="{backgroundImage: 'url(' + logoUrl.sample + ')'}" class="image">
            </div> -->
            <img class="image" :src="logoUrl.sample">
            <a @click="logout()" class="btn btn-light js-menu-log-in-btn">Log Out</a>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'Header',
    data(){
        return {
            logoUrl: {sample: ''}
        }
    },
    methods: {
        ...mapActions([
            'logout'
        ])
    }
}
</script>
<style scoped>
.image {
    height: 20px;
}
a {
    float: right;
    margin-top: 0px;
    padding-top: 0px;
    color: #F3F4F6;
}
</style>