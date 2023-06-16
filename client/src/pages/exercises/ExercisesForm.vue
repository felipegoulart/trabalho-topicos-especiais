<template>
  <q-page padding>
    <header class="row justify-between items-center">
      <h1 class="text-h4">{{ title }}</h1>
    </header>

    <q-form @submit.prevent="submitForm" class="row q-col-gutter-md">
      <q-input class="col-12" v-model="model.name" label="Nome" />
      <q-input class="col-12" v-model="model.observation" label="Observação" type="textarea" />
      <q-input class="col-12" v-model="model.video" label="Vídeo" type="url" />

      <iframe v-if="hasValidURL" width="560" height="315" :src="embedVideoURL" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>

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
import { useExercisesStore } from 'stores/exercises'

export default defineComponent({
  name: 'ExercisesForm',

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
        create: 'Adicionar exercício',
        edit: `Editar ${this.model?.name}`
      }
      return titles[this.formMode]
    },

    submitButtonLabel () {
      return this.formMode === 'edit' ? 'Salvar' : 'Cadastrar'
    },

    hasValidURL () {
      const regex = /(.*)(\/watch\?v=)(.+)(&)/
      return regex.test(this.model.video)
    },

    embedVideoURL () {
      const regex = /(.*)(\/watch\?v=)(.{11})(.*)/
      return this.hasValidURL && (this.model.video || '').replace(regex, 'https://www.youtube.com/embed/$3')
    }
  },

  methods: {
    ...mapActions(useExercisesStore, ['fetchSingle', 'replace', 'create']),

    async submitForm () {
      if (this.formMode === 'edit') {
        await this.replace(this.model)

        this.goToPreviousPage()

        return
      }

      const result = await this.create(this.model)

      this.$router.push({ name: 'ExercisesShow', params: { id: result.id } })
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
