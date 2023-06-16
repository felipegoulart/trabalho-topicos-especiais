import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useTrainingsStore = defineStore('trainings', {
  state: () => ({
    list: [],
    training: {}
  }),

  actions: {
    async fetchList () {
      const { data: { results } } = await api.get('trainings')

      this.list = results
    },

    async fetchSingle (payload) {
      const { data: { result } } = await api.get(`trainings/${payload}`)

      this.training = result

      return result
    },

    async create (payload) {
      const { data: { result } } = await api.post('trainings', { ...payload })

      return result
    },

    async replace ({ id, ...payload }) {
      const { data: { result } } = await api.put(`trainings/${id}`, { ...payload })

      return result
    }
  }
})
