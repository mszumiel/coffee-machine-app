import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        status: null,
        coffeeRecipes: [],
        coffeeRecipesSelectionDisabled: false
    },
    getters: {
        status: state => {
            return state.status
        },
        coffeeRecipes: state => {
            return state.coffeeRecipes
        },
        selectionDisabled: state => {
            return state.coffeeRecipesSelectionDisabled
        }
    },
    mutations: {
        setStatus: (state, status) => {
            state.status = status;
        },
        updateSelectionStatus: state => {
            if (state.status !== null && state.status !== undefined && state.status.coffeePreparationInProgress) {
                state.coffeeRecipesSelectionDisabled = false;
            }
        },
        setCoffeeRecipes: (state, recipes) => {
            state.coffeeRecipes = recipes;
        },
        enableSelection: state => {
            state.coffeeRecipesSelectionDisabled = false;
        },
        disableSelection: state => {
            state.coffeeRecipesSelectionDisabled = true;
        }
    }
});
