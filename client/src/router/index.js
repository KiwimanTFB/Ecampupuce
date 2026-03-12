import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import StudentView from '../views/StudentView.vue'
import TeacherView from '../views/TeacherView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/student',
      name: 'student',
      component: StudentView,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: TeacherView,
      meta: { requiresAuth: true, role: 'teacher' }
    }
  ]
})

// Navigation Guard (Validation du JWT & Rôle)
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwt_token')
    const userRole = localStorage.getItem('user_role')

    if (to.meta.requiresAuth && !token) {
        // Rediriger vers la page de login s'il n'y a pas de token
        next('/login')
    } else if (to.meta.requiresAuth && to.meta.role !== userRole) {
        // Empêcher un étudiant d'aller sur /teacher et inversement
        if (userRole === 'student') next('/student')
        else if (userRole === 'teacher') next('/teacher')
        else next('/login')
    } else if (to.path === '/login' && token) {
        // Si l'utilisateur est déjà connecté, l'empêcher de retourner sur le login
        if (userRole === 'student') next('/student')
        else if (userRole === 'teacher') next('/teacher')
        else next(false)
    } else {
        next()
    }
})

export default router
