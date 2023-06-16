<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">{{ title }}</h1>
    </header>

    <q-form @submit.prevent="submitForm" class="row q-col-gutter-md">
      <q-input class="col-6" v-model="model.name" label="Nome" />
      <q-select class="col-6" v-model="model.athlete_id" label="Atleta" emit-value map-options :options="parsedAthletesOptions" />
      <q-input class="col-12" v-model="model.observation" label="Observação" />

      <div class="text-weight-bold full-width">Exercicios</div>
      <div class="full-width" v-for="(exercise, index) in model.exercises" :key="index">
        <div class="row q-col-gutter-md" v-if="!exercise.destroyed">
          <q-select :rules="[(value) => value || 'Campo obrigatório']" class="col-4" v-model="exercise.exercise_id" label="Exercício" emit-value map-options :options="parsedExercisesOptions" />
          <q-input class="col-2" v-model.number="exercise.num_sets" label="Séries" type="number" min="0" steps="1" />
          <q-input class="col-2" v-model.number="exercise.num_reps" label="Repetições" type="number" min="0" steps="1" />
          <q-input class="col-2" v-model.number="exercise.rest_time" label="Intervalo (em segundos)" type="number" min="0" steps="1" />

          <div class="col-2 row items-center">
            <q-btn icon="sym_r_delete" flat label="Excluir" color="negative" @click="removeExercise(index)" no-caps />
          </div>
        </div>
      </div>

      <div class="row full-width q-mt-md items-center justify-center">
        <q-btn label="Incluir exercício" icon="sym_r_add" no-caps flat color="primary" @click="addNewExercise" />
      </div>

      <div class="col-12 q-mt-md row justify-end q-gutter-md">
        <q-btn color="grey-9" label="Cancelar" flat @click="goToPreviousPage" no-caps  />
        <q-btn color="primary" :label="submitButtonLabel" type="submit" no-caps  />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useTrainingsStore } from 'stores/trainings'
import { useAthletesStore } from 'stores/athletes'
import { useExercisesStore } from 'stores/exercises'

export default defineComponent({
  name: 'TrainingsForm',
  data () {
    return {
      model: {
        exercises: [
          {
            id: undefined,
            exercise_id: null,
            num_sets: 0,
            num_reps: 0,
            rest_time: 0
          }
        ]
      },
      athletesOptions: [],
      exercisesOptions: []
    }
  },
  computed: {
    formMode () {
      return this.$route.meta.type
    },

    title () {
      const titles = {
        create: 'Adicionar treino',
        edit: `Editar ${this.model?.name}`
      }
      return titles[this.formMode]
    },

    submitButtonLabel () {
      return this.formMode === 'edit' ? 'Salvar' : 'Cadastrar'
    },

    parsedAthletesOptions () {
      return this.athletesOptions.map(({ id, name }) => ({ value: id, label: name }))
    },

    parsedExercisesOptions () {
      return this.exercisesOptions.map(({ id, name }) => ({ value: id, label: name }))
    },

    defaultExerciseModel () {
      return {
        id: undefined,
        exercise_id: null,
        num_sets: 0,
        num_reps: 0,
        rest_time: 0
      }
    }
  },

  methods: {
    ...mapActions(useTrainingsStore, ['fetchSingle', 'replace', 'create']),
    ...mapActions(useAthletesStore, { fetchAthletesList: 'fetchList' }),
    ...mapActions(useExercisesStore, { fetchExercisesList: 'fetchList' }),

    async submitForm () {
      if (this.formMode === 'edit') {
        await this.replace(this.model)
        this.goToPreviousPage()
        return
      }
      const result = await this.create(this.model)
      this.$router.push({ name: 'TrainingsShow', params: { id: result.id } })
    },

    goToPreviousPage () {
      this.$router.back()
    },

    addNewExercise () {
      this.model.exercises.push({ ...this.defaultExerciseModel })
    },

    removeExercise (index) {
      if (this.model.exercises[index]?.id) {
        this.model.exercises[index].destroyed = true

        return
      }

      this.model.exercises.splice(index, 1)
    }
  },

  async created () {
    this.athletesOptions = await this.fetchAthletesList()
    this.exercisesOptions = await this.fetchExercisesList()

    if (this.formMode === 'edit') {
      this.model = await this.fetchSingle(this.$route.params?.id)
    }
  }
})
</script>
