<template>
    <div id="app">
        <PopupDialog :displayPopup="showMachineAccessPopup()"
                     title="Coffee In Preparation"
                     :content="machineAccessPopupMessage"
                     :isWorkInProgressPopup="false"
                     :isInfoPopup="isInfoPopup"
                     :isAlertPopup="isAlertPopup"
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
    import PopupDialog from "@/components/PopupDialog";
    import axios from 'axios';
    import {config} from './config'

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
                if (this.$store.getters.status != null) {
                    if (this.$store.getters.status.coffeePreparationInProgress === true) {
                        this.machineAccessPopupMessage = 'Coffee In Preparation';
                        displayPopup = true;
                    }
                    if (this.$store.getters.status.cleaningInProgress === true) {
                        this.machineAccessPopupMessage = 'Cleaning In Progress';
                        displayPopup = true;
                    }
                    if (this.$store.getters.status.waterTankEmpty === true) {
                        this.machineAccessPopupMessage = 'Water Tanks Requires To be emptied';
                        displayPopup = true;
                    }
                    if (this.$store.getters.status.coffeeBeansContainerEmpty === true) {
                        this.machineAccessPopupMessage = 'Coffee Beans needs to be refilled';
                        displayPopup = true;
                    }
                    if (this.$store.getters.status.coffeeGroundsContainerFull === true) {
                        this.machineAccessPopupMessage = 'Coffee Grounds Requires To be emptied';
                        displayPopup = true;
                    }
                }
                return displayPopup
            },
        },
        created() {
            setInterval(() => {
                axios.get(`${config.baseUrl}/diagnostic/status`)
                    .then(response => {
                        this.$store.commit('setStatus', response.data);
                        this.$store.commit('updateSelectionStatus');
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }, 1000 * 3);
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
