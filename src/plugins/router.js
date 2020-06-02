import Vue from 'vue'
import RegisterComponent from "@/components/RegisterComponent";
import LoginComponent from "@/components/LoginComponent";
import AllComponent from "@/components/AllComponent";
import VueRouter from 'vue-router';
import firebase from "firebase";
Vue.use(VueRouter)
const routes = [
   {
       path:'/register',
       name:'register',
       component:RegisterComponent,
       meta:{
            requiresAuth:false
        }
   },
   {
        path:'/login',
        name:'login',
        component: LoginComponent,
        meta:{
            requiresAuth:false
        }
   },
    {
        path: '/',
        name:'all',
        component: AllComponent,
        meta:{
            requiresAuth:true
        }
    },

]
// eslint-disable-next-line no-unused-vars
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = firebase.auth().currentUser

    if (requiresAuth && !currentUser) {
        next('/login')
    } else if (requiresAuth && currentUser) {
        next()
    } else {
        next()
    }
})

export default router

