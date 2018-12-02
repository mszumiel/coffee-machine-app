<template>
    <div class="md-layout md-gutter">
        <PopupDialog v-bind:displayPopup="showCoffeeProgressPopup"
                     title="Coffee In Preparation"
                     v-bind:content="coffeePreparationPopupMessage"
                     v-bind:isWorkInProgressPopup="popupInWorkInProgressMode"
                     v-bind:isInfoPopup="popupInWorkInInfoMode"
        ></PopupDialog>
        <div class="md-layout-item md-size-30"></div>
        <div class="md-layout-item">
            <div style="font-size: 25px;margin-top: 5%;">
                {{ now | moment('MM-DD-YYYY HH:mm') }}
            </div>
            <div class="elevation-demo">
                <md-button v-for="coffee in coffeeRecipes"
                           v-on:click="onCoffeeClick(coffee)"
                           style="width: 300px;height: 80px; margin: 5px"
                           class="md-raised">
                    {{coffee.name}}
                </md-button>
            </div>
        </div>
        <div class="md-layout-item md-size-30"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import PopupDialog from "@/components/PopupDialog";

    export default {
        name: 'MainPanel',
        components: {PopupDialog},
        props: {},
        data() {
            return {
                coffeeRecipes: [],
                showCoffeeProgressPopup: false,
                coffeePreparationPopupMessage: 'Progress Stage',
                popupInWorkInProgressMode: true,
                popupInWorkInInfoMode: false,
                now: new Date
            }
        },
        methods: {
            onCoffeeClick: function (coffee) {
                //Here i'll call server coffee machine to prepare this coffee
                this.coffeePreparationPopupMessage = 'Progress Stage';
                this.showCoffeeProgressPopup = true;
                setTimeout(this.coffeePreparedInfoPopup, 5000)
            },
            coffeePreparedInfoPopup: function () {
                this.coffeePreparationPopupMessage = 'Coffee Ready';
                this.popupInWorkInProgressMode = false;
                this.popupInWorkInInfoMode = true;
                setTimeout(this.coffeePreparedClosePopup, 2000)
            },
            coffeePreparedClosePopup: function () {
                this.popupInWorkInProgressMode = true;
                this.popupInWorkInInfoMode = false;
                this.showCoffeeProgressPopup = false;
            }
        },
        created() {
            setInterval(() => this.now = new Date, 1000 * 60);
            axios.get(`/coffee-recipes.json`)
                .then(response => {
                    this.coffeeRecipes = response.data
                })
                .catch(e => {
                    this.errors.push(e)
                })
        }
    }
</script>

<style lang="scss" scoped>
    .elevation-demo {
        padding: 16px;
        flex-wrap: wrap;
    }

    .md-content {
        width: 100px;
        height: 100px;
        margin: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>