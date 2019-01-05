import axios from 'axios';
import {config} from '../config'

export const coffeeService = {

    getRecipes: function () {
        return axios.get(`${config.baseUrl}/coffee/recipes`)
            .then(response => {
                return response.data
            })
            .catch(e => {
                this.errors.push(e)
            });
    },

    createOrder: function (coffeeId) {
        return axios.post(`${config.baseUrl}/coffee/${coffeeId}/order`)
            .then(() => {
            })
            .catch(e => {
                this.errors.push(e)
            });
    }
};