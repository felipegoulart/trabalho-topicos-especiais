<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">{{ title }}</h1>
    </header>

    <q-form @submit.prevent="submitForm" class="row q-col-gutter-md">
      <q-input class="col-4" v-model="model.name" label="Nome" />
      <q-input class="col-4" v-model="model.email" label="E-mail" />
      <q-input class="col-4" v-model="model.phone" label="Telefone" mask="(##) #####-####" />
      <q-select class="col-4" v-model="model.gender" emit-value map-options label="Sexo" :options="genderOptions" />
      <q-input class="col-4" v-model="model.age" label="Idade" mask="###" />

      <div class="col-12 q-mt-md row justify-end q-gutter-md">
        <q-btn color="grey-9" label="Cancelar" flat @click="goToPreviousPage" />
        <q-btn color="primary" :label="submitButtonLabel" type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useAthletesStore } from 'stores/athletes'

export default defineComponent({
  name: 'AthletesForm',

  data () {
    return {
      model: {}
    }
  },

  computed: {
    formMode () {
      return this.$route.meta.type
    },

    title () {
      const titles = {
        create: 'Adicionar atleta',
        edit: `Editar ${this.model?.name}`
      }
      return titles[this.formMode]
    },

    genderOptions () {
      return [
        {
          label: 'Masculino',
          value: 'male'
        },
        {
          label: 'Feminino',
          value: 'female'
        }
      ]
    },

    submitButtonLabel () {
      return this.formMode === 'edit' ? 'Salvar' : 'Cadastrar'
    }
  },

  methods: {
    ...mapActions(useAthletesStore, ['fetchSingle', 'replace', 'create']),

    async submitForm () {
      if (this.formMode === 'edit') {
        await this.replace(this.model)

        this.goToPreviousPage()

        return
      }

      const result = await this.create(this.model)
      console.log(result)
      this.$router.push({ name: 'AthletesShow', params: { id: result.id } })
    },

    goToPreviousPage () {
      this.$router.back()
    }
  },

  async created () {
    if (this.formMode === 'edit') {
      this.model = await this.fetchSingle(this.$route.params?.id)
    }
  }
})
</script>
