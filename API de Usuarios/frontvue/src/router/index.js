import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/Register'
import Login from '../views/Login'
import Users from '../views/Users'
import Edit from '../views/Edit'

async function AdminAuth(to, from, next) {
  if(localStorage.getItem('token') != undefined) next();
  else next("/login")
}

Vue.use(VueRouter)

const routes = [
  { path: '*', name: 'DefaultRouter', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin/users', name: 'Users', component: Users, beforeEnter: AdminAuth },
  { path: '/admin/users/edit/:id', name: 'UserEdit', component: Edit, beforeEnter: AdminAuth }
]

const router = new VueRouter({ mode: 'history', routes });

export default router;
