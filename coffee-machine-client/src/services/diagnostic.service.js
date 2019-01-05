import axios from 'axios';
import {config} from '../config'

export const diagnosticService = {
  getStatus: function () {
      return axios.get(`${config.baseUrl}/diagnostic/status`)
          .then(response => {
              return response.data
          })
          .catch(e => {
              this.errors.push(e)
          })
  }
};