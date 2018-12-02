<template>
    <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-30"></div>
        <div class="md-layout-item md-size-40">
            <md-table>
                <md-table-toolbar>
                    <h1 class="md-title">Coffee Machine Diagnostic Panel</h1>
                </md-table-toolbar>
                <md-table-row>
                    <md-table-head>Diagnostic Parameter</md-table-head>
                    <md-table-head>Status</md-table-head>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>Connection With Machine</md-table-cell>
                    <md-table-cell>{{connectionStatus()}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>Cleaning Process</md-table-cell>
                    <md-table-cell>{{cleaningProcess()}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>Water Tank Status</md-table-cell>
                    <md-table-cell>{{waterTankStatus()}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>Container of Coffee Grounds Status</md-table-cell>
                    <md-table-cell>{{containerOfCoffeeGroundStatus()}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell>Coffee Beans Container</md-table-cell>
                    <md-table-cell>{{coffeeBeansContainerStatus()}}</md-table-cell>
                </md-table-row>
            </md-table>
        </div>
        <div class="md-layout-item md-size-30"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "DiagnosticPanel",
        data() {
            return {
                statusDetails: null
            }
        },
        methods: {
            connectionStatus: function() {
                if(this.statusDetails == null) {
                    return 'UNKNOWN'
                } else {
                    return this.statusDetails.serverUp ? 'UP' : 'DOWN'
                }
            },
            cleaningProcess: function() {
                if(this.statusDetails == null) {
                    return 'UNKNOWN'
                } else {
                    return this.statusDetails.cleaningInProgress ? 'In Progress' : 'Not Running'
                }
            },
            waterTankStatus: function() {
                if(this.statusDetails == null) {
                    return 'UNKNOWN'
                } else {
                    return this.statusDetails.emptyWaterTank ? 'Lack of Water' : 'OK'
                }
            },
            containerOfCoffeeGroundStatus: function() {
                if(this.statusDetails == null) {
                    return 'UNKNOWN'
                } else {
                    return this.statusDetails.fullContainerOfCoffeeGrounds ? 'Full' : 'OK'
                }
            },
            coffeeBeansContainerStatus: function() {
                if(this.statusDetails == null) {
                    return 'UNKNOWN'
                } else {
                    return this.statusDetails.coffeeBeansLowLevel ? 'Low Level' : 'OK'
                }
            }
        },
        created() {
            axios.get(`/machine-status.json`)
                .then(response => {
                    this.statusDetails = response.data
                })
                .catch(e => {
                    this.errors.push(e)
                })
        }
    }
</script>

<style scoped>

</style>