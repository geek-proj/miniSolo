<template>
     <v-dialog v-model="fullscreenmodel" scrollable fullscreen hide-overlay transition="dialog-bottom-transition" >
         <v-card>
             <v-container>
                 <v-progress-linear disabled="true"
                         height="20"
                         color="#585f63"
                         v-model="inc"
                 ></v-progress-linear>
             </v-container>
             <v-container>
                 <v-row align="center" justify="center">
                     <v-col cols="12" sm="10" md="10">
                         <v-card elevation="0" class="d-flex flex-no-wrap justify-space-between" width="100%">
                             <div class="d-flex flex-row justify-center align-center">
                                 <v-avatar
                                         class="ma-3"
                                         size="30"
                                 >
                                     <v-img :src="user.image"></v-img>
                                 </v-avatar>
                                 <span v-text="user.username"
                                       style="color:#585f63;font-family: 'Raleway', sans-serif;font-weight: bold;border-bottom: 1px solid #585f63;"></span>
                             </div>
                             <div class="d-flex flex-column justify-center align-center">
                                 <div>
                                     <span v-text="userPoint"></span>
                                     <v-icon color="#ab9754">mdi-flash</v-icon>
                                     <span v-text="challengerPoint"></span>
                                 </div>
                                 <v-btn elevation="0" color="white"  style="color:#d94c58" v-on:click="closeFullscreen(true)" v-if="!started">
                                     <span>
                                         Cancel
                                     </span>
                                 </v-btn>
                             </div>
                             <div class="d-flex flex-row justify-center align-center">
                                 <v-avatar
                                         class="ma-3"
                                         size="30"
                                 >
                                     <v-img :src="challenger.image"></v-img>
                                 </v-avatar>
                                 <span v-text="challenger.username"
                                       style="color:#585f63;font-family: 'Raleway', sans-serif;font-weight: bold;border-bottom: 1px solid #585f63;"></span>
                             </div>
                         </v-card>
                     </v-col>
                 </v-row>
             </v-container>
             <v-container class="d-flex justify-row justify-center" v-if="!started && !loading">
                 <v-btn color="#88ab74" style="color: white" v-on:click="startChallenge" v-show="!started && !loading && !showAnimation">
                     Send Challenge
                 </v-btn>
             </v-container>
             <v-container class="d-flex justify-column justify-center" v-if="loading">
                 <v-progress-circular
                         :rotate="90"
                         v-show="loading"
                         :size="120"
                         :width="15"
                         :value="value"
                         color="#88ab74"
                 >
                     <span style="font-family: 'Raleway',sans-serif">Waiting...</span>
                 </v-progress-circular>
             </v-container>
                 <v-container v-show="started" >
                     <v-row
                             align="center"
                             justify="center">
                         <v-col cols="10" sm="8" md="8">
                             <div class="d-flex flex-nowrap justify-space-between" >
                                 <v-btn elevation="0" color="#eaf0e6"  style="color:#88ab74">
                                     <span>
                                         {{ time }}
                                     </span>
                                 </v-btn>
                             </div>
                             <v-card elevation="1">
                                 <v-card-title v-text="questions[index]">
                                 </v-card-title>
                                 <v-card-text>
                                     <v-list>
                                         <v-list-item-group color="primary">
                                             <v-list-item v-on:click="clickToChoose(item.text)"
                                                          v-for="(item, i) in answers[index]"
                                                     :key="i">
                                                 <v-list-item-content v-text="item.text"></v-list-item-content>
                                             </v-list-item>
                                         </v-list-item-group>
                                     </v-list>
                                 </v-card-text>
                                 <div class="flex justify-end">
                                     <v-btn  elevation="0" color="#88ab74" width="100%" style="color:white" v-on:click="answerQuestion">
                                         Answer
                                     </v-btn>
                                 </div>
                             </v-card>
                         </v-col>
                     </v-row>
                 </v-container>
             <v-container>
                 <transition name="bounce">
                     <v-container v-if="!wrongAnswer && showAnimation">
                         <v-content  class="d-flex flex-column justify-center align-center">
                             <v-card-title>
                                 <v-btn elevation="0" style="color:#99b863;font-size: 19px" color="white">
                                     Right
                                 </v-btn>
                             </v-card-title>
                         </v-content>
                     </v-container>
                 </transition>
                 <transition name="bounce">
                 <v-container v-if="wrongAnswer && showAnimation">
                     <v-content  class="d-flex flex-column justify-center align-center">
                         <v-card-title>
                             <v-btn elevation="0" style="color:#b35254;font-size: 19px" color="white" >
                                 Wrong
                             </v-btn>
                         </v-card-title>
                     </v-content>
                 </v-container>
             </transition>
             </v-container>
         </v-card>
     </v-dialog>
</template>

<script>
    export default {
        name: "Fullscreen",
        props:{
            fullscreenmodel:null,
            questions:null,
            rightAnswer:null,
            wrongAnswer:null,
            showAnimation:null,
            answers:null,
            index:null,
            value:null,
            user:null,
            time:null,
            started:null,
            inc:null,
            challenger:null,
            challengerPoint:null,
            userPoint:null,
            loading:null,
            answeredValue:null,
            clickToChoose:{
                type:Function
            },
            firebaseKey:null,
            closeFullscreen:{
                type:Function
            },
            startChallenge:{
                type:Function
            },
            answerQuestion:{
                type:Function
            }
        },
        data(){
            return{
                right:false
            }
        },
        methods:{
            show(){
                  this.right = true;
            },
            start () {
                this.timer = setInterval( () => {
                    this.time--;
                    this.inc -=5;
                    if (this.time===0){
                        this.inc = 100;
                        this.time = 20;
                        this.index++;
                    }
                },1000)
                if(this.index === this.questions.length){
                    clearInterval(this.timer);
                }
            },
        }
    }
</script>

<style scoped>
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
    .col-sm-10 col-md-6 col-12{
        width: 100%;
    }
</style>