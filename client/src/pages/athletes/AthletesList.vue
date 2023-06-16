<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">Lista de usuários</h1>

      <div>
        <q-btn color="primary" label="Novo atleta" flat size="16px" icon="sym_r_add" no-caps :to="{ name: 'AthletesCreate' }" />
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
import { useAthletesStore } from 'stores/athletes'

export default defineComponent({
  name: 'AthletesList',

  data () {
    return {
      name: 'teste'
    }
  },

  computed: {
    ...mapState(useAthletesStore, ['list']),

    columns () {
      return [
        { name: 'name', label: 'Nome', sortable: true, field: 'name', align: 'left' },
        { name: 'email', label: 'Email', sortable: false, field: 'email', align: 'left' },
        { name: 'phone', label: 'Telefone', sortable: false, field: 'phone', align: 'left' },
        { name: 'gender', label: 'Sexo', sortable: false, field: 'gender', align: 'left', format: this.formatGender },
        { name: 'age', label: 'Idade', sortable: false, field: 'age', align: 'left' }
      ]
    }
  },

  methods: {
    ...mapActions(useAthletesStore, ['fetchList']),

    formatGender (gender) {
      const genders = {
        male: 'Masculino',
        female: 'Feminino'
      }

      return genders[gender]
    },

    goToPage (_, row) {
      this.$router.push({ name: 'AthletesShow', params: { id: row.id } })
    }
  },

  created () {
    this.fetchList()
  }
})
</script>
