<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">Lista de exercícios</h1>

      <div>
        <q-btn color="primary" label="Novo exercício" flat size="16px" icon="sym_r_add" no-caps :to="{ name: 'ExercisesCreate' }" />
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
import { useExercisesStore } from 'stores/exercises'

export default defineComponent({
  name: 'ExercisesList',

  computed: {
    ...mapState(useExercisesStore, ['list']),

    columns () {
      return [
        { name: 'name', label: 'Nome', sortable: true, field: 'name', align: 'left' },
        { name: 'observation', label: 'Observações', sortable: false, field: 'observation', align: 'left' },
        { name: 'video', label: 'Vídeo', sortable: false, field: 'video', align: 'left' }
      ]
    }
  },

  methods: {
    ...mapActions(useExercisesStore, ['fetchList']),

    goToPage (_, row) {
      this.$router.push({ name: 'ExercisesShow', params: { id: row.id } })
    }
  },

  created () {
    this.fetchList()
  }
})
</script>
