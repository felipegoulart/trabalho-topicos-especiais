<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">{{ exercise?.name || 'Exercício' }}</h1>

      <div>
        <q-btn color="primary" label="Editar exercício" flat size="16px" icon="sym_r_add" no-caps :to="{ name: 'ExercisesEdit', params: { id: exerciseId }}" />
      </div>
    </header>

    <div class="q-ma-md q-pa-lg q-gutter-y-md row shadow-4 rounded-borders">
      <div class="col-12" v-for="(item, index) in items" :key="index">
        <div class="text-weight-bold">{{ item.label }}</div>
        <div class="">{{ exercise[item.field] || '-'}}</div>
      </div>

      <iframe v-if="hasValidURL" width="560" height="315" :src="embedVideoURL" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useExercisesStore } from 'stores/exercises'

export default defineComponent({
  name: 'ExercisesShow',

  computed: {
    ...mapState(useExercisesStore, ['exercise']),

    exerciseId () {
      return this.$route.params?.id || ''
    },

    items () {
      return [
        { field: 'name', label: 'Nome' },
        { field: 'observation', label: 'Observação' },
        { field: 'video', label: 'Vídeos' }
      ]
    },

    hasValidURL () {
      const regex = /(.*)(\/watch\?v=)(.+)(&)/
      return regex.test(this.exercise.video)
    },

    embedVideoURL () {
      const regex = /(.*)(\/watch\?v=)(.{11})(.*)/
      return this.hasValidURL && this.exercise.video.replace(regex, 'https://www.youtube.com/embed/$3')
    }
  },

  methods: {
    ...mapActions(useExercisesStore, ['fetchSingle'])
  },

  created () {
    this.fetchSingle(this.exerciseId)
  }
})
</script>
