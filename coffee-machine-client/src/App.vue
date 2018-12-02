<template>
    <div id="app">
        <img alt="Coffee Machine App Logo" src="./assets/coffee-machine-symbol.png">
        <router-view></router-view>
        <div>
            <router-link to="/">
                <md-button class="md-fab md-primary">
                    <md-icon>home</md-icon>
                </md-button>
            </router-link>
            <router-link to="/diagnostic">
                <md-button class="md-fab md-primary">
                    <md-icon>build</md-icon>
                </md-button>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>

<style lang="scss" scoped>

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    small {
        display: block;
    }
</style>
