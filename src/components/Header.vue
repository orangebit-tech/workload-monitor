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
            logoUrl: {sample: ''}
        }
    }
}
</script>
<style scoped>
.image {
    height: 20px;
}
</style>