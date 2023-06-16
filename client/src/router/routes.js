const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'AthletesList' },
    children: [
      {
        path: '/atletas',
        name: 'AthletesList',
        component: () => import('../pages/athletes/AthletesList.vue')
      },
      {
        path: '/atletas/novo',
        name: 'AthletesCreate',
        component: () => import('../pages/athletes/AthletesForm.vue'),
        meta: { type: 'create' }
      },
      {
        path: '/atletas/:id',
        name: 'AthletesShow',
        component: () => import('../pages/athletes/AthletesShow.vue')
      },
      {
        path: '/atletas/:id/editar',
        name: 'AthletesEdit',
        component: () => import('../pages/athletes/AthletesForm.vue'),
        meta: { type: 'edit' }
      },
      {
        path: '/treinos',
        name: 'TrainingsList',
        component: () => import('../pages/trainings/TrainingsList.vue')
      },
      {
        path: '/treinos/novo',
        name: 'TrainingsCreate',
        component: () => import('../pages/trainings/TrainingsForm.vue'),
        meta: { type: 'create' }
      },
      {
        path: '/treinos/:id',
        name: 'TrainingsShow',
        component: () => import('../pages/trainings/TrainingsShow.vue')
      },
      {
        path: '/treinos/:id/editar',
        name: 'TrainingsEdit',
        component: () => import('../pages/trainings/TrainingsForm.vue'),
        meta: { type: 'edit' }
      },
      {
        path: '/exercicios',
        name: 'ExercisesList',
        component: () => import('../pages/exercises/ExercisesList.vue')
      },
      {
        path: '/exercicios/novo',
        name: 'ExercisesCreate',
        component: () => import('../pages/exercises/ExercisesForm.vue'),
        meta: { type: 'create' }
      },
      {
        path: '/exercicios/:id',
        name: 'ExercisesShow',
        component: () => import('../pages/exercises/ExercisesShow.vue')
      },
      {
        path: '/exercicios/:id/editar',
        name: 'ExercisesEdit',
        component: () => import('pages/exercises/ExercisesForm.vue'),
        meta: { type: 'edit' }
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
