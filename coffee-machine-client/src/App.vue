<template>
    <div id="app">
        <PopupDialog v-bind:displayPopup="showMachineAccessPopup()"
                     title="Coffee In Preparation"
                     v-bind:content="machineAccessPopupMessage"
                     v-bind:isWorkInProgressPopup="false"
                     v-bind:isInfoPopup="isInfoPopup"
                     v-bind:isAlertPopup="isAlertPopup"
        ></PopupDialog>
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
    import axios from 'axios';
    import PopupDialog from "@/components/PopupDialog";
    import { store } from './main.js'

    export default {
        name: 'app',
        components: {PopupDialog},
        data() {
            return {
                machineAccessPopupMessage: 'Progress Stage',
                isInfoPopup: false,
                isAlertPopup: true,
                now: new Date
            }
        },
        methods: {
            showMachineAccessPopup: function () {
                let displayPopup = false;
                if (store.state.status != null) {
                    if(store.state.status.coffeePreparationInProgress === true) {
                        this.machineAccessPopupMessage = 'Coffee In Preparation';
                        displayPopup = true;
                    }
                    if(store.state.status.cleaningInProgress === true) {
                        this.machineAccessPopupMessage = 'Cleaning In Progress';
                        displayPopup = true;
                    }
                    if(store.state.status.waterTankEmpty === true) {
                        this.machineAccessPopupMessage = 'Water Tanks Requires To be emptied';
                        displayPopup = true;
                    }
                    if(store.state.status.coffeeBeansContainerEmpty === true) {
                        this.machineAccessPopupMessage = 'Coffee Beans needs to be refilled';
                        displayPopup = true;
                    }
                    if(store.state.status.coffeeGroundsContainerFull === true) {
                        this.machineAccessPopupMessage = 'Coffee Grounds Requires To be emptied';
                        displayPopup = true;
                    }
                }
                return displayPopup
            },
        },
        created() {
            axios.get(`http://localhost:3000/diagnostic/status`)
                .then(response => {
                    store.setStatus(response.data);
                })
                .catch(e => {
                    this.errors.push(e)
                })
        }
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
