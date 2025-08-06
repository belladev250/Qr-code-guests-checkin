import { createRouter, createWebHistory } from 'vue-router'  
import Admin from '../pages/AdminPage.vue'
import Login from '../pages/LoginPage.vue'
import ReceptionDashboard from '@/components/ReceptionDashboard.vue'
import SuperAdminDashboard from '@/components/SuperAdminDashboard.vue'
import CheckinPage from '../pages/CheckinPage.vue'
const routes = [
  { path: '/', name: 'CheckIn', component: CheckinPage },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/login', name: 'Login', component: Login },
  { path: '/reception-dashboard', name: 'receptiondashboard', component: ReceptionDashboard },
  { path: '/super-admin-dashboard', name: 'admindashboard', component: SuperAdminDashboard },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
