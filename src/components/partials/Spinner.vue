<template>
  <div class="loader">
    <div class="loader-div">
      <div class="loading-spinner">
        <div v-if="!getError || getError == ''" class="spinner" style="">
          <half-circle-spinner
            :animation-duration="1000"
            :size="80"
            color="#126db6"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HalfCircleSpinner }  from 'epic-spinners'
import { mapGetters }         from 'vuex';

export default {
  name: 'Loader',
  components: {
      HalfCircleSpinner,
  },
  computed: 
    mapGetters([
      'getError'
    ]),
}
</script>

<style scoped>
.loader {
  position: relative;
  z-index: 9999;
  margin-top: -30px;
}
.loader-div{
  text-align: center;
  position: relative;
  height: 600px;
}
.loading-spinner {
  padding-top: 65px;
  padding-bottom: 408px;
  width: 100%;
  display: block;
  background-color: white;
  opacity: 0.7;
  position: absolute;
  text-align: center;
}
.spinner {
  display: inline-block;
  margin-top: 25px;
}
.message {
  margin-top: 10px; 
  color: #126db6; 
  font-size: 18px;
}
.green {
  color: #7bc143 !important;
}
.red {
  color: #e64759 !important;
}
</style>