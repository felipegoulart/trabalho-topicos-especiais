import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useExercisesStore = defineStore('exercises', {
  state: () => ({
    list: [],
    exercise: {}
  }),

  actions: {
    async fetchList () {
      const { data: { results } } = await api.get('exercises')

      this.list = results

      return results
    },

    async fetchSingle (payload) {
      const { data: { result } } = await api.get(`exercises/${payload}`)

      this.exercise = result

      return result
    },

    async create (payload) {
      const { data: { result } } = await api.post('exercises', { ...payload })

      return result
    },

    async replace ({ id, ...payload }) {
      const { data: { result } } = await api.put(`exercises/${id}`, { ...payload })

      return result
    }
  }
})
