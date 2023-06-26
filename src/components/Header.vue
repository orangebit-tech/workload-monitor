<template>
    <div>
        <div>
            <!-- <div :style="{backgroundImage: 'url(' + logoUrl.sample + ')'}" class="image">
            </div> -->
            <img class="image" :src="'https://test.americor.biz/images/logo-white.svg'">
            <a style="margin-top: 16px;" @click="logout()" class="btn btn-light js-menu-log-in-btn">Log Out</a>
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
    height: 47px;
        display: inline-block;
}
a {
    float: right;
    margin-top: 0px;
    padding-top: 0px;
    color: #F3F4F6;
}
.js-menu-log-in-btn:hover {
    color: #CE3D34 !important;
}
</style>