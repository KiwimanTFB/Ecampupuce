import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StudentView from '../views/StudentView.vue'
import TeacherView from '../views/TeacherView.vue'
import DemandeConfirmationView from '../views/DemandeConfirmationView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

// ─── Vues Publiques ───────────────────────────────────────────
import AccueilView from '../views/public/AccueilView.vue'
import PublicShowcaseView from '../views/public/PublicShowcaseView.vue'
import NotreButView from '../views/public/NotreButView.vue'
import CampusView from '../views/public/CampusView.vue'
import ContactView from '../views/public/ContactView.vue'

// ─── Vues Inscription ─────────────────────────────────────────
import ParcoursupView from '../views/public/inscription/ParcoursupView.vue'
import CandidatureView from '../views/public/inscription/CandidatureView.vue'
import IntegrationView from '../views/public/inscription/IntegrationView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // ─── Routes Publiques ─────────────────────────────────
    {
      path: '/',
      name: 'accueil',
      component: AccueilView,
      meta: { title: 'Accueil', description: 'Découvrez les talents et développeurs du département MMI Vélizy.' }
    },
    {
      path: '/projets',
      name: 'nos-projets',
      component: PublicShowcaseView,
      meta: { title: 'Nos Projets', description: 'Explorez la vitrine des projets MMI : Web, Design, 3D, Audiovisuel.' }
    },
    {
      // Rétrocompatibilité — /vitrine redirige vers /projets
      path: '/vitrine',
      redirect: '/projets'
    },
    {
      path: '/but',
      name: 'notre-but',
      component: NotreButView,
      meta: { title: 'Le BUT MMI', description: 'Tout savoir sur le programme du Bachelor Universitaire de Technologie MMI.' }
    },
    {
      path: '/le-campus',
      name: 'le-campus',
      component: CampusView,
      meta: { title: 'Le Campus', description: 'Découvrir la vie étudiante et les infrastructures du campus.' }
    },
    {
      // Rétrocompatibilité — /campus redirige vers /le-campus
      path: '/campus',
      redirect: '/le-campus'
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { title: 'Nous contacter', description: 'Posez vos questions sur la formation MMI.' }
    },

    // ─── Routes Inscription ───────────────────────────────
    {
      path: '/inscription/parcoursup',
      name: 'parcoursup',
      component: ParcoursupView
    },
    {
      path: '/inscription/candidature',
      name: 'candidature',
      component: CandidatureView
    },
    {
      path: '/inscription/integration',
      name: 'integration',
      component: IntegrationView
    },

    // ─── Routes Privées ───────────────────────────────────
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

// ─── Navigation Guard ──────────────────────────────────────────
router.beforeEach((to, from) => {
  const token = localStorage.getItem('jwt_token')
  const userRole = localStorage.getItem('user_role')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
  if (to.meta.requiresAuth && to.meta.role !== userRole) {
    if (userRole === 'student') return '/student'
    if (userRole === 'teacher') return '/teacher'
    if (userRole === 'admin') return '/admin/dashboard'
    return '/login'
  }
  if (to.path.startsWith('/login') && token) {
    if (userRole === 'student') return '/student'
    if (userRole === 'teacher') return '/teacher'
    if (userRole === 'admin') return '/admin/dashboard'
    return false
  }
  return true
})

// ─── SEO Guard ──────────────────────────────────────────
router.afterEach((to) => {
  const defaultTitle = "IUT MMI Vélizy"
  const defaultDesc = "Une formation hybride alliant design, développement web et communication numérique. Nous formons les talents qui façonnent le web de demain."
  
  if (to.meta.title) {
    document.title = `${to.meta.title} — ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }
  
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.name = "description"
    document.head.appendChild(metaDesc)
  }
  metaDesc.content = to.meta.description || defaultDesc
})

export default router
