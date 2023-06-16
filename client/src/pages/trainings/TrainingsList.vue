<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">Lista de treinos</h1>

      <div>
        <q-btn color="primary" label="Novo treino" flat size="16px" icon="sym_r_add" no-caps :to="{ name: 'TrainingsCreate' }" />
      </div>
    </header>

    <div class="q-py-md">
      <q-table
        :rows="list"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[10]"
        @row-click="goToPage"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useTrainingsStore } from 'stores/trainings'

export default defineComponent({
  name: 'TrainingsList',

  computed: {
    ...mapState(useTrainingsStore, ['list']),

    columns () {
      return [
        { name: 'athlete_name', label: 'Atleta', sortable: false, field: 'athlete_name', align: 'left' },
        { name: 'name', label: 'Treino', sortable: true, field: 'name', align: 'left' },
        { name: 'observation', label: 'Observações', sortable: false, field: 'observation', align: 'left' }
      ]
    }
  },

  methods: {
    ...mapActions(useTrainingsStore, ['fetchList']),

    goToPage (_, row) {
      this.$router.push({ name: 'TrainingsShow', params: { id: row.id } })
    }
  },

  created () {
    this.fetchList()
  }
})
</script>
