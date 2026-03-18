import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StudentView from '../views/StudentView.vue'
import TeacherView from '../views/TeacherView.vue'
import DemandeConfirmationView from '../views/DemandeConfirmationView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login/admin',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/confirmation-demande',
      name: 'confirmation',
      component: DemandeConfirmationView
    },
    {
      path: '/student/:view?',
      name: 'student',
      component: StudentView,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/teacher/:view?',
      name: 'teacher',
      component: TeacherView,
      meta: { requiresAuth: true, role: 'teacher' }
    }
  ]
})

// Navigation Guard (Validation du JWT & Rôle)
router.beforeEach((to, from) => {
    const token = localStorage.getItem('jwt_token')
    const userRole = localStorage.getItem('user_role')

    if (to.meta.requiresAuth && !token) {
        // Rediriger vers la page de login s'il n'y a pas de token
        return '/login'
    } 
    
    if (to.meta.requiresAuth && to.meta.role !== userRole) {
        // Empêcher d'aller sur un dashboard non autorisé
        if (userRole === 'student') return '/student'
        if (userRole === 'teacher') return '/teacher'
        if (userRole === 'admin') return '/admin/dashboard'
        return '/login'
    } 
    
    if (to.path.startsWith('/login') && token) {
        // Si l'utilisateur est déjà connecté, l'empêcher de retourner sur le login
        if (userRole === 'student') return '/student'
        if (userRole === 'teacher') return '/teacher'
        if (userRole === 'admin') return '/admin/dashboard'
        return false // Annule la navigation vers login
    }
    
    // Par défaut, la route est autorisée
    return true
})

export default router
