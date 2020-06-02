import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'
import router from "@/plugins/router";
import store from "@/plugins/store";
import Firebase from "firebase"

Vue.config.productionTip = false
Vue.use(vuetify)
Vue.use(firestorePlugin)

Firebase.auth().onAuthStateChanged(user=>{
    store.dispatch("fetchUser",user)
})

new Vue({
  vuetify,
  router,
  render: h => h(App),
  store,
}).$mount('#app')
