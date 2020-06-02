<template>
    <div id="login">
      <v-app id="inspire">
        <v-app id="inspire">
          <v-content>
            <v-container
              class="fill-height"
              fluid
            >
              <v-row
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  sm="8"
                  md="4"
                >
                  <v-card class="elevation-0">
                    <v-toolbar
                      color="white"
                      dark
                      flat
                    >
                      <v-toolbar-title>
                        <v-btn value="recent" color="#5278a3" elevation="0">
                          <span style="color:white">
                            <router-link to="/login" style="color:white">Login</router-link>
                          </span>
                        </v-btn>
                        <router-link to="/register" style="color:white">
                          <v-btn value="favorites" color="white" elevation="0">
                            <span style="color:#585f63">
                              Registration
                            </span>
                          </v-btn>
                        </router-link>
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <span>Source</span>
                      </v-tooltip>
                    </v-toolbar>
                    <v-card-text>
                      <v-form>
                        <v-text-field
                          label="Login"
                          autofocus
                          name="login"
                          v-model="auth.username"
                          color="#5278a3"
                          style="font-family: 'Raleway', sans-serif;"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          id="password"
                          v-model="auth.password"
                          color="#5278a3"
                          label="Password"
                          style="font-family: 'Raleway', sans-serif;"
                          name="password"
                          type="password"
                        ></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <transition name="bounce">
                        <v-btn color="#d94e68" max-width="300" small style="color:white" v-text="errorText" v-show="!error">
                          error
                        </v-btn>
                      </transition>
                      <v-spacer v-show="!visibility"></v-spacer>
                      <v-progress-circular
                        indeterminate
                        class="flex justify-center"
                        v-show="visibility"
                        color="primary"
                      ></v-progress-circular>
                      <v-btn color="#5278a3" @click="submit" v-show="!visibility">
                        <span style="color:white">Login</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-content>
        </v-app>
      </v-app>
    </div>
</template>

<script>
  import firebase from "firebase"
    export default {
        name: "LoginComponent",
        data(){
          return{
              auth:{
                  username:"",
                  password:""
              },
              visibility:false,
              error:true,
              errorText:""
          }
        },
      created(){
          if(firebase.auth().currentUser){
                  this.$router.push("/")
              }
      },
        methods:{
          submit() {

            this.visibility = true;
              firebase.auth()
                      .signInWithEmailAndPassword(this.auth.username,this.auth.password)
                      .then(
                              // eslint-disable-next-line no-unused-vars
                              e=>{
                                // eslint-disable-next-line no-unused-vars
                                this.$router.push({ path: this.redirect || '/' }, onComplete => { }, onAbort => { })

                              }
                      )
                      .catch(
                              err=>{
                                this.visibility = false;
                                this.errorText = err.message;
                                this.error = false;
                              }
                      )
          },
          async handleSomething() {
              try {
                  await this.$router.push({name:"all",path:"/"});
              } catch (err) {
                  throw new Error(`Problem handling something: ${err}.`);
              }
          }
        }
    }
</script>

<style scoped>
   a{
    text-decoration: none;
    color:white
  }
  .bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

</style>