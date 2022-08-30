<template>
    <div class="login-page">
        <div style="margin-top: 200px;" class="logo">
        </div>
        <form @submit.prevent="setToken(token)" method="" class="form w-full max-w-450 mx-auto" id="form-login" novalidate="novalidate">
            <div class="m-t-24 mb-2 relative">
                <label class="w-full mb-2 mt-8 block" for="password">Password:</label>
                <div class="show-hide-password">
                    <span class="hide-password hidden">Hide Password <span class="icon-eye-off-12"></span></span>
                </div>
                <div class="relative">
                    <input v-model="token" class="w-full " autocomplete="off" type="password" name="password" id="password" value="">
                </div>
                <div v-if="getError && getError !== ''" id="email-error" class="alert alert-error form-row-alert">{{getError}}</div>
            </div>                
            <div style="" class="text-center mt-6">
                <button type="submit" class="uk-button uk-button-default uk-button-large">Continue <span class="icon-chevron icon-chevron-white"></span></button>
            </div>
        </form>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    name: 'Login',
    data() {
        return {
            token: ''
        }
    },
    computed: {
        ...mapGetters([
            'getError'
        ])
    },
    methods: {
        ...mapActions([
            'setToken',
            'flushErrors'
        ]),
    },
    destroyed(){
        this.flushErrors()
    }
}
</script>

<style scoped>
@import url('https://client.americor.com/_assets/_front/_css/_min/front_v3.min.purged.css?rev=0a5365c78e99ad68697135f2246e3b4aproduction373336');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://client.americor.com/_assets/bower_components/tooltipster/dist/css/tooltipster.bundle.min.css');
.login-page {
    background-color: white;
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
}
.block {
    height: unset;
}
label {
    text-align: left;
    border: none;
    padding-left: 0px;
    margin-left: 0px;
}
.logo {
    text-align: center;
    margin-bottom: 85px;
    margin-top: 126px;
}
</style>