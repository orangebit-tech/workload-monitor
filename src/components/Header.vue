<template>
    <div>
        <div>
            <!-- <div :style="{backgroundImage: 'url(' + logoUrl.sample + ')'}" class="image">
            </div> -->
            <img class="image" :src="logoUrl.sample">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    data(){
        return {
            logoUrl: {sample: 'https://h3.maintstar.co/Presentation1/App_Themes_MS/img/maintstar_logo_white.png'}
        }
    }
}
</script>
<style scoped>
.image {
    height: 20px;
}
</style>