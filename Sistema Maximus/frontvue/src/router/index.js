import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Replic from '../views/Replic.vue'
import Tasks from '../views/Tasks.vue'
import Index from '../views/Index.vue'
import AdminUsers from '../views/Admin/AdminUsers.vue'
import Wiki from '../views/Wiki/Wiki.vue'
import RegisterPost from '../views/Wiki/RegisterPost.vue'
import Post from '../views/Wiki/Post.vue'
import Access from '../views/Access/Access.vue'
import Implantation from '../views/Implantation/Implantation.vue'
import Napp from '../views/Napp/Napp.vue'
import Dashboard from '../views/Dashboard/Dashboard.vue'
import Teste from '../views/Implantation/Teste.vue'


import axios from 'axios';
import scrypt from "../assets/js/scrypt";

var serverIP = scrypt.serverIP
/*
async function AdminAuth(to, from, next) {
  if(localStorage.getItem('token') != undefined) {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    
    var redeUser = localStorage.getItem("redeIdUser")
    var roleUser = localStorage.getItem("roleUser")
    var loginUser = localStorage.getItem("loginUser")
   
    await axios.post(`${serverIP}/validate`, {redeUser, roleUser, loginUser}, req).then(() => {
      next();
    }).catch(err => {
      alert(err.response.data.err)
      next("/");
    })
  } else{
    next("/");
  }
} 

async function UserMaximusAuth(to, from, next) {
  if(localStorage.getItem('token') != undefined) {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    
    var redeUser = localStorage.getItem("redeIdUser")
    var roleUser = localStorage.getItem("roleUser")
    var loginUser = localStorage.getItem("loginUser")
   
    await axios.post(`${serverIP}/validate`, {redeUser, roleUser, loginUser}, req).then(() => {
      next();
    }).catch(err => {
      alert(err.response.data.err)
      next("/");
    })
  } else{
    next("/");
  }
}
*/
async function UserAuth(to, from, next) {
  if(localStorage.getItem('token') != undefined) {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    
    var redeUser = localStorage.getItem("redeIdUser")
    var roleUser = localStorage.getItem("roleUser")
    var loginUser = localStorage.getItem("loginUser")
   
    await axios.post(`${serverIP}/validate`, {redeUser, roleUser, loginUser}, req).then(() => {
      next();
    }).catch(err => {
      alert(err.response.data.err)
      next("/");
    })
  } else{
    next("/");
  }
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },/*
  {
    path: '*',
    name: 'DefaultRouter',
    component: Home
  },*/
  
  {
    path: '/index',
    name: 'Index',
    component: Index,
    beforeEnter: UserAuth
  },
  {
    path: '/acessos',
    name: 'Access',
    component: Access,
    beforeEnter: UserAuth
  },
  {
    path: '/implantacoes',
    name: 'Implantation',
    component: Implantation,
  },
  {
    path: '/napp',
    name: 'Napp',
    component: Napp,
  },
  {
    path: '/teste',
    name: 'Teste',
    component: Teste,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: UserAuth
  },
  {
    path: '/replicacoes',
    name: 'Replic',
    component: Replic,
    beforeEnter: UserAuth
  },
  {
    path: '/tarefas',
    name: 'Tasks',
    component: Tasks,
    beforeEnter: UserAuth
  },
  {
    path: '/usuarios',
    name: 'AdminUsers',
    component: AdminUsers,
    beforeEnter: UserAuth
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: Wiki    
  },
  {
    path: '/cadastrar-postagem',
    name: 'RegisterPost',
    component: RegisterPost
  },
  {
    path: '/:slug',
    name: 'Post',
    component: Post
  },
  {
    path: '/conta/:token',
    name: 'HomeRecover',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
