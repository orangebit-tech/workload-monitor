<template>
  <div id="app">
    <div class="router">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  methods: {
    ...mapActions([
      'setBlacklist',
      'flushErrors',
      'clearData'
    ])
  },
  created(){
    if(!localStorage.getItem('redm_settings')){
      var redm_settings = {
        hideAssignees: [],
      }
      localStorage.redm_settings = JSON.stringify(redm_settings)
    }
    if(localStorage.getItem('redm_settings')){
      redm_settings = localStorage.getItem('redm_settings')
      if(JSON.parse(redm_settings).hideAssignees && JSON.parse(redm_settings).hideAssignees.length > 0) {
        this.setBlacklist(JSON.parse(redm_settings).hideAssignees)
      }
    }
    this.flushErrors()
  },
  mounted(){
    this.clearData()
  },
  destroyed(){
    this.clearData()
  }
}
</script>

<style>

::-webkit-scrollbar
{
  display: block;
  width: 10px;  /* for vertical scrollbars */
  height: 12px; /* for horizontal scrollbars */
}
::-webkit-scrollbar-track
{
  background: #ffffff;
  border-radius: 6px;
  margin: 5px;
}
::-webkit-scrollbar-thumb
{
  border-radius: 6px;
  background-color: #757575;
  border: 1px solid #757575;
  border-radius: 2px !important;
}
.primary-column {
  background-image: linear-gradient(to bottom,#4683c7,#3367a1) !important;
  color: white !important;
  overflow: hidden !important; 
  position: relative !important; 
  text-align: center !important;
  padding-left: 0.8% !important;
  padding-right: 0.8% !important;
}
.tasks-widget {
      position: absolute;
    bottom: 4%;
    left:5%;
    right:5%;
}
.tasks-widget span{
  color: white !important;
  
}
#app {
  overflow-x: hidden;
  font-family: 'Roboto',sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4773BA;
}
html, body {
  min-width: 1040px;
  margin-left: 0px;
  margin-right: 0px;
}
html {
  background-color: #f3f4f6;
}
body {
    color: #757575;
}
.priority-circle {
      vertical-align: middle;
    display: inline-block; 
    border-radius: 50%; 
    height: 12px;
    width: 12px;
}


.display-block {
  text-align: center;
  margin: 15px;
  padding-top: 0px;
}
.border {
  border: 1px solid #F6FBFE;
  border-radius: 8px;
  background-color: #4773BA;
}
/* .button:hover {
  cursor: pointer;
  color: white;;
} */
a {
  color: #4773BA;
  font-weight: 500;
  font-size: 14px;
}
a:hover {
  color: #333;
}
.is-active {
  width: static;
  color: #333 !important;
}
.is-active:hover {
}
.top-button {
  line-height: 4.586rem;
  
  color: #c8cccb;
}
.is-still-active {
  width: static;
  background-color: transparent;
  color: #4773BA !important;
  border: 1px solid #4773BA
}
.block {
  color: #757575;
  border: 1px solid #F6FBFE;
  width: 250px;
  height: 250px;
  margin: 20px 10px;
  margin-bottom: 10px;
  vertical-align: top;
  padding: 5px 15px;
  vertical-align: center !important;
  min-width: 200px;
  margin-top: 10px;
}
.text-color, h1, p, button {
  color: #757575;
}
h1 {
  font-weight: 500;
}
p {
  letter-spacing: 1px;
  line-height: 22px;
  font-size: 14px;
  text-align: center;
}
.router-2 {
}
.spinner {
  text-align: center !important;
  vertical-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 12%;
}
h2 {
  font-weight: 400;
  text-align: left;
  padding-left: 10px;
}
h3 {
  color: #5fb037;
  font-weight: 400;
}
/* ::-webkit-scrollbar-track
{
  background: transparent;
}
::-webkit-scrollbar-thumb
{
  background-color: transparent;
  border: 1px solid #F6FBFE;
  border-radius: 1px !important;
} */
@keyframes cssAnimation {
    to {
        width:0;
        height:0;
        overflow:hidden;
    }
}
@-webkit-keyframes cssAnimation {
    to {
        width:0;
        height:0;
        visibility:hidden;
    }
}
@-webkit-keyframes fadeinout {
  0%,100% { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes fadeinout {
  0%,100% { opacity: 0; }
  50% { opacity: 1; }
}
.external-link-icon {
  display: inline-block;
}
.link:hover {
  text-decoration: underline;
  color: #5fb037 !important;
}
@media screen and (max-width: 840px) {
  .block {
    width: auto;
    height: auto;
    margin-left: 0px ;
    margin-right: 0px;
  }
}
@media screen and (max-width: 705px){
  /* .button {
    margin-left: 0px;
    margin-top: 20px;
    display: block;
  }  */
}
@media screen and (max-width: 407px){
  body {
     padding: 0px !important;
  }
  .block {
    padding: 0px 5px;
    margin-bottom: 15px;
  }
}
input {
  border-radius: 0.215rem;
}
.button {
    border:1px solid transparent;
    -webkit-border-radius: 0px 0px 4px 4px;
    font-size: 13px;
    white-space: nowrap;
    margin-right: 7px;
    transition: .3s;
    text-decoration: none;
    border-color: transparent;
    transition: all 0.3s ease 0s;
    vertical-align: sub;
    width: 100px !important;
    display: inline-block;
        text-align: center;

}

.btn {

}
.waves-effect {
    position: relative;
    z-index: 1;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
.m-t-10 {
    margin-top: 10px !important;
}
.btn {

}
.btn {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.571429;
    display: inline-block;
    padding: 0.429rem 1.072rem;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: 0.215rem;
}
</style>
