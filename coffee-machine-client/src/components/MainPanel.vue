<template>
    <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-30"></div>
        <div class="md-layout-item">
            <div style="font-size: 25px;margin-top: 5%;">
                {{ now | moment('MM-DD-YYYY HH:mm') }}
            </div>
            <div class="elevation-demo">
                <md-button v-for="coffee in coffeeRecipes"
                           @click="onCoffeeClick(coffee)"
                           style="width: 300px;height: 80px; margin: 5px"
                           :disabled="selectionDisabled"
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
    import {config} from '../config'
    import {mapGetters} from 'vuex'

    export default {
        name: 'MainPanel',
        components: {PopupDialog},
        data() {
            return {
                now: new Date
            }
        },
        computed: {
            ...mapGetters([
                'coffeeRecipes',
                'selectionDisabled'
            ])
        },
        methods: {
            onCoffeeClick: function (coffee) {
                axios.post(`${config.baseUrl}/coffee/${coffee.id}/order`)
                    .then(() => {
                        this.$store.commit('disableSelection');
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });
            }
        },
        created() {
            setInterval(() => this.now = new Date, 1000 * 60);
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