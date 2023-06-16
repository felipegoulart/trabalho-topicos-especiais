import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAthletesStore = defineStore('athletes', {
  state: () => ({
    list: [],
    athlete: {}
  }),

  actions: {
    async fetchList () {
      const { data: { results } } = await api.get('athletes')

      this.list = results

      return results
    },

    async fetchSingle (payload) {
      const { data: { result } } = await api.get(`athletes/${payload}`)

      this.athlete = result

      return result
    },

    async create (payload) {
      const { data: { result } } = await api.post('athletes', { ...payload })

      return result
    },

    async replace ({ id, ...payload }) {
      const { data: { result } } = await api.put(`athletes/${id}`, { ...payload })

      return result
    }
  }
})
