<template>
    <div id="register">
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
                  sm="10"
                  style="box-shadow: none"
                  md="4"
                >
                  <v-card class="elevation-0"

                  >
                    <v-toolbar
                      color="white"
                      dark
                      flat
                    >
                      <v-toolbar-title>
                        <router-link to="/login" style="color:white">
                          <v-btn value="recent" color="white" elevation="0">
                            <span style="color:#5278a3">
                              Login
                            </span>
                          </v-btn>
                        </router-link>
                        <router-link to="/register" style="color:white">
                          <v-btn value="favorites" color="#5278a3" elevation="0">
                            <span style="color:white">
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
                      <v-card-text
                      v-show="expand2">
                        <v-form>
                          <v-text-field
                            label="Email"
                            autofocus
                            name="login"
                            v-model="auth.username"
                            :color="color"
                            style="font-family: 'Raleway', sans-serif;"
                            type="text"
                          ></v-text-field>
                          <v-text-field
                            id="password"
                            :color="color"
                            label="Password"
                            v-model="auth.password"
                            style="font-family: 'Raleway', sans-serif;"
                            name="password"
                            type="password"
                          ></v-text-field>
                          <v-text-field
                            id="confirmPassword"
                            :color="color"
                            label="Confirm Password"
                            v-model="auth.password"
                            style="font-family: 'Raleway', sans-serif;"
                            name="password"
                            type="password"
                          ></v-text-field>
                          <v-menu top :close-on-content-click="closeOnContentClick">
                            <template v-slot:activator="{ on }">
                              <v-text-field v-on="on" style="font-family: 'Raleway', sans-serif;" label="Language">
                              </v-text-field>
                            </template>

                            <v-list elevation="0">
                                <div style="display: inline-block;margin:10px 5px 10px 5px ;" v-for="(item, index) in items"
                                :key="index">
                                  <v-btn small :color="item.color" elevation="0" v-on:click="append(item.title)">{{ item.title }}</v-btn>
                                </div>
                            </v-list>
                          </v-menu>
                          <div v-for="(item,index) in auth.values" :key="index" style="display: inline-block;margin-left: 5px">
                            <v-btn small elevation="1" color="white">
                              <span style="color:#5278a3">{{ item.val }}</span>
                            </v-btn>
                          </div>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#5278a3" v-on:click="submit" >
                          <span style="color:white">Register</span>
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
  import {mapGetters} from "vuex"
  import {db} from "@/plugins/firebase"

    export default {
        name: "RegisterComponent",
        data(){
          return {
            auth:{
              username:"",
              password:"",
              values:[],
              image:""
            },
            items:[
              {
                title:"Python"
              },
              {
                title: "C++"
              },
              {
                title: "Java"
              },
              {
                title: "C#"
              },
              {
                title: "Javascript"
              }
            ],
            expand: false,
            expand2: true,
            error:null,
            color:"#5278a3",
            images:[],
            closeOnContentClick: true,
          }
        },
        computed:{
          ...mapGetters({
            user:"user"
          }),

        },
        methods:{
          randImage(){
            this.images.push("https://cdn.pixabay.com/photo/2016/03/12/23/18/man-1253004_960_720.jpg");
            this.images.push("https://cdn.pixabay.com/photo/2016/03/09/15/10/man-1246508_960_720.jpg");
            this.images.push("https://cdn.pixabay.com/photo/2020/05/11/18/37/forest-5159688_960_720.jpg");
            this.images.push("https://cdn.pixabay.com/photo/2020/05/18/12/41/landscape-5186058_960_720.jpg");
            this.auth.image = this.images[Math.floor(Math.random()*this.images.length)];
          },
          ID(){
            return Math.random().toString(36).substr(2, 10);
          },
          submit(){
            this.randImage();
            firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.auth.username,this.auth.password)
                    .then(data=>{
                      data.user.updateProfile({
                        displayName:this.auth.username
                      })
                      db.ref("users").child(this.ID()).set(this.auth);
                      // eslint-disable-next-line no-unused-vars
                      this.$router.push({ path: this.redirect || '/' }, onComplete => { }, onAbort => { })
                    })
                    .catch(
                            // eslint-disable-next-line no-unused-vars
                            err=>{
                            }
                    )

          },
          append:function (value) {
            for (var x = 0;x < this.auth.values.length;x++){
              if(this.auth.values[x]["val"] === value){return;}
            }
            this.auth.values.push({val:value});
          }
        },
      created(){
          if(firebase.auth().currentUser){
                  this.$router.push("/")
              }
      },
    }
</script>

<style scoped>
  a{
    text-decoration: none;
  }
</style>