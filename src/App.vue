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
      'setBlacklist'
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
  background: #EBEAEA;
}
::-webkit-scrollbar-thumb
{
  background-color: #6d6e71;
  border: 1px solid #6d6e71;
  border-radius: 2px !important;
}
#app {
  overflow-x: hidden;
  font-family:   "AvenirNext", "Arial", "Helvetica Neue", "Helvetica", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #126db6;
}
html, body {
  font-family:   "AvenirNext", "Arial", "Helvetica Neue", "Helvetica", sans-serif !important;
  min-width: 1040px;
  margin-left: 0px;
  margin-right: 0px;
}
html {
  background-color: white;
}
body {
    color: #6d6e71;
}
.priority-circle {
      vertical-align: middle;
    display: inline-block; 
    border-radius: 50%; 
    height: 12px;
    width: 12px;
}
.button {
    font-size: 18px;
    padding: 4px;
    border:1px solid transparent;
    -webkit-border-radius: 0px 0px 4px 4px;
    padding: 6px 7px;
    font-size: 13px;
    white-space: nowrap;
    margin-right: 7px;
    transition: .3s;
    text-decoration: none;
    border-color: transparent;
    color: white;
    transition: all 0.3s ease 0s;
    vertical-align: sub;
    background-color: #126db6;
    width: 80px !important;
    display: inline-block;
    text-align: center;
}
.display-block {
  border: 1px solid #F6FBFE;
  text-align: center;
  padding: 15px;
  margin: 15px;
  padding-top: 0px;
}
.border {
  border: 1px solid #F6FBFE;
  border-radius: 8px;
  background-color: #126db6;
}
.button:hover {
  cursor: pointer;
  color: white;;
}
a {
  color: #126db6;
  font-weight: 500;
  font-size: 14px;
}
a:hover {
  color: #7bc143;
}
.is-active {
  width: static;
  background-color: #7BC143;
  color: white !important;
  font-weight: bold;

}
.is-active:hover {
  background-color: #7bc143;

}
.is-still-active {
  width: static;
  background-color: transparent;
  color: #126db6 !important;
  border: 1px solid #126db6
}
.block {
  color: #6d6e71;
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
  color: #6d6e71;
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
  margin-top: 30px;
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
  color: #7bc143;
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
  color: #7bc143 !important;
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
</style>
