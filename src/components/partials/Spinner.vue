<template>
  <div class="loader">
    <div class="loader-div">
      <div class="loading-spinner">
        <div v-if="!getError || getError == ''" class="spinner" style="">
          <half-circle-spinner
            :animation-duration="1000"
            :size="80"
            color="#4773BA"
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
}
.loader-div{
  text-align: center;
  position: relative;
  height: 73vh;
}
.loading-spinner {
  padding-top: 65px;
  padding-bottom: 67vh;
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
  color: #4773BA; 
  font-size: 18px;
}
.green {
  color: #5fb037 !important;
}

</style>