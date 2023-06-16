<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">{{ athlete?.name || 'Atleta' }}</h1>

      <div>
        <q-btn color="primary" label="Editar atleta" flat size="16px" icon="sym_r_add" no-caps :to="{ name: 'AthletesEdit', params: { id: athleteId }}" />
      </div>
    </header>

    <div class="q-ma-md q-pa-lg q-gutter-y-md row shadow-4 rounded-borders">
      <div class="col-6" v-for="(item, index) in items" :key="index">
        <div class="text-weight-bold">{{ item.label }}</div>
        <div class="">{{ parsedAthlete[item.field] || '-'}}</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useAthletesStore } from 'stores/athletes'

export default defineComponent({
  name: 'AthletesShow',

  data () {
    return {
      name: 'teste'
    }
  },

  computed: {
    ...mapState(useAthletesStore, ['athlete']),

    athleteId () {
      return this.$route.params?.id || ''
    },

    items () {
      return [
        { field: 'name', label: 'Nome' },
        { field: 'email', label: 'Email' },
        { field: 'phone', label: 'Telefone' },
        { field: 'gender', label: 'Sexo' },
        { field: 'age', label: 'Idade' }
      ]
    },

    parsedAthlete () {
      return {
        ...this.athlete,
        phone: this.formatPhone(this.athlete.phone),
        gender: this.formatGender(this.athlete.gender)
      }
    }
  },

  methods: {
    ...mapActions(useAthletesStore, ['fetchSingle']),

    formatGender (gender) {
      const genders = {
        male: 'Masculino',
        female: 'Feminino'
      }

      return genders[gender]
    },

    formatPhone (phone) {
      return phone && phone.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3')
    },

    goToList (_, row) {
      this.$router.push({ name: 'AthletesShow', params: { id: row.id } })
    }
  },

  created () {
    this.fetchSingle(this.athleteId)
  }
})
</script>
