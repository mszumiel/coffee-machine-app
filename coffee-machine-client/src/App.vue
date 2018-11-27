<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <img alt="Vue logo" src="./assets/logo.png">
    <MainPanel msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import MainPanel from './components/MainPanel.vue'

export default {
  name: 'app',
  components: {
      MainPanel
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
