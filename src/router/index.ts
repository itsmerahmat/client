import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginLayout from '@/layouts/LoginLayout.vue'
import RegisterLayout from '@/layouts/RegisterLayout.vue'
import NotFound from '@/views/NotFound.vue'
import User from '@/views/user/User.vue'
import UserForm from '@/views/user/UserForm.vue'
import Beranda from '@/views/beranda/Beranda.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Beranda,
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginLayout,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterLayout,
    },
    {
      path: '/users',
      component: MainLayout,
      children: [
        {
          path: '/users',
          name: 'User',
          component: User,
        },
        {
          path: '/users/form/:id?',
          name: 'UserForm',
          component: UserForm,
        }
      ]
    },

    // Redirect to 404 page
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
      meta: {
        title: 'Not Found'
      }
    },
  ]
})

export default router
