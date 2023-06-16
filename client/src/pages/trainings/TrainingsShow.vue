<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">{{ training?.name || 'Treino' }}</h1>

      <div>
        <q-btn color="primary" label="Editar treino" flat size="16px" icon="sym_r_add" no-caps :to="{ name: 'TrainingsEdit', params: { id: trainingId }}" />
      </div>
    </header>

    <div class="q-ma-md q-pa-lg q-col-gutter-md row shadow-4 rounded-borders">
      <div class="col-6">
        <div class="text-weight-bold">Atleta</div>
        <div class="">{{ training.athlete_name || '-'}}</div>
      </div>

      <div class="col-6">
        <div class="text-weight-bold">Treino</div>
        <div class="">{{ training.name || '-'}}</div>
      </div>

      <div class="col-12">
        <div class="text-weight-bold">Observação</div>
        <div class="">{{ training.observation || '-'}}</div>
      </div>
    </div>

    <div class="q-ma-md q-pa-lg q-gutter-md row shadow-4 rounded-borders">
      <div class="text-weight-bold text-subtitle1">Exercícios</div>

      <div class="row col-12 separator" v-for="exercise in training.exercises" :key="exercise.id">
        <div class="col-3">
          <div class="text-weight-bold">Nome</div>
          <router-link class="link" target="_blank" :to="{name: 'ExercisesShow', params: { id: exercise.exercise_id }}">{{ exercise.name || '-'}}</router-link>
        </div>

        <div class="col-3">
          <div class="text-weight-bold">Séries</div>
          <div >{{ exercise.num_sets || '-'}}</div>
        </div>

        <div class="col-3">
          <div class="text-weight-bold">Repetições</div>
          <div >{{ exercise.num_reps || '-'}}</div>
        </div>

        <div class="col-3">
          <div class="text-weight-bold">Intervalo</div>
          <div >{{ exercise.rest_time || '-'}}</div>
        </div>

        <div class="col-12 q-mt-sm">
          <div class="text-weight-bold">Observação</div>
          <div >{{ exercise.observation || '-'}}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useTrainingsStore } from 'stores/trainings'

export default defineComponent({
  name: 'TrainingsShow',

  data () {
    return {
      name: 'teste'
    }
  },

  computed: {
    ...mapState(useTrainingsStore, ['training']),

    trainingId () {
      return this.$route.params?.id || ''
    }
  },

  methods: {
    ...mapActions(useTrainingsStore, ['fetchSingle']),

    goToList (_, row) {
      this.$router.push({ name: 'AthletesShow', params: { id: row.id } })
    }
  },

  created () {
    this.fetchSingle(this.trainingId)
  }
})
</script>

<style lang="scss">
.separator {
  padding-bottom: 12px;
  border-bottom: 1px solid $grey-6;

  &:nth-last-child(1) {
    padding-bottom: none;
    border: none
  }
}

.link {
  text-decoration: none;
  color: $primary
}
</style>
