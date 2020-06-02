<template>
    <div>
        <v-container>
            <v-alert dense text type="success"
                v-if="doneMessage && !error">
                  Сhallenge has been done!
            </v-alert>
             <v-alert dense text type="error"
                      v-if="doneMessage && error"
                >
                  Challenge canceled!
            </v-alert>
            <v-row dense
                   align="center"
                    justify="center">
              <v-col
                cols="8"
              >
                  <v-content style="padding: 5px;border-bottom: 1px solid lightgray;">
                      <span style="font-family: 'Raleway',sans-serif;font-weight: bold">Available</span>
                  </v-content>
                  <v-list dense >
                      <v-list-item-group color="primary">
                          <v-list-item
                                  v-for="(item, i) in items"
                                  :key="i"
                                  @click="clickList(item.key,i)">
                              <v-list-item-content>
                                  <div class="d-flex flex-row align-center">
                                      <v-avatar>
                                          <v-img :src="item.sender.user.image"></v-img>
                                      </v-avatar>
                                      <span v-text="item.sender.user.username" style="font-family: 'Raleway',sans-serif;margin-left: 10px">
                                      </span>
                                  </div>
                              </v-list-item-content>
                              <v-list-item-action>
                                  <v-btn icon>
                                      <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                  </v-btn>
                              </v-list-item-action>
                              <Fullscreen
                                        :fullscreenmodel="fullScreen.fullscreenmodel"
                                        :questions="fullScreen.questions"
                                        :answers="fullScreen.answers"
                                        :index="fullScreen.index"
                                        :value="fullScreen.value"
                                        :user="fullScreen.user"
                                        :time="fullScreen.time"
                                        :started="fullScreen.started"
                                        :inc="fullScreen.inc"
                                        :challenger="fullScreen.challenger"
                                        :loading="fullScreen.loading"
                                        :firebase-key="fullScreen.firebaseKey"
                                        :closeFullscreen="fullScreen.closeFullscreen"
                                        :challenger-point="fullScreen.challengerPoint"
                                        :user-point="fullScreen.userPoint"
                                        :answer-question="fullScreen.answerQuestion"
                                        :start-challenge="fullScreen.startChallenge"
                                        :wrong-answer="fullScreen.wrongAnswer"
                                        :click-to-choose="fullScreen.clickToChoose"
                                        :show-animation="fullScreen.showAnimation"
                                        :answered-value="fullScreen.answeredValue"
                              ></Fullscreen>
                          </v-list-item>
                      </v-list-item-group>
                  </v-list>
                  <v-content style="padding: 5px;border-bottom: 1px solid lightgray">
                      <span style="font-family: 'Raleway',sans-serif;font-weight: bold">Finished</span>
                  </v-content>
                  <v-list dense >
                      <v-list-item-group color="primary">
                          <v-list-item
                                  v-for="(item, i) in finishedItems"
                                  :key="i">
                                  <v-list-item-content>
                                      <div class="d-flex flex-row align-center" >
                                              <v-avatar>
                                              <v-img :src="item.sender.user.image"></v-img>
                                          </v-avatar>
                                          <span v-text="item.sender.user.username" style="font-family: 'Raleway',sans-serif;margin-left: 10px">
                                          </span>
                                      </div>
                                  </v-list-item-content>
                                  <v-list-item-action>
                                      <v-btn icon>
                                          <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                      </v-btn>
                                  </v-list-item-action>
                              <Fullscreen
                                        :fullscreenmodel="fullScreen.fullscreenmodel"
                                        :questions="fullScreen.questions"
                                        :answers="fullScreen.answers"
                                        :index="fullScreen.index"
                                        :value="fullScreen.value"
                                        :user="fullScreen.user"
                                        :time="fullScreen.time"
                                        :started="fullScreen.started"
                                        :inc="fullScreen.inc"
                                        :challenger="fullScreen.challenger"
                                        :loading="fullScreen.loading"
                                        :firebase-key="fullScreen.firebaseKey"
                                        :closeFullscreen="fullScreen.closeFullscreen"
                                        :challenger-point="fullScreen.challengerPoint"
                                        :user-point="fullScreen.userPoint"
                                        :answer-question="fullScreen.answerQuestion"
                                        :start-challenge="fullScreen.startChallenge"
                                        :wrong-answer="fullScreen.wrongAnswer"
                                        :click-to-choose="fullScreen.clickToChoose"
                                        :show-animation="fullScreen.showAnimation"
                                        :answered-value="fullScreen.answeredValue"
                              ></Fullscreen>
                          </v-list-item>
                      </v-list-item-group>
                  </v-list>
              </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import {db} from "@/plugins/firebase"
    import firebase from "firebase"
    import Fullscreen from "@/components/Fullscreen";
    export default {
        name: "HistoryComponent",
        components: {Fullscreen},
        data(){
            return{
                items:[],
                finishedItems:[],
                user:firebase.auth().currentUser.email,
                doneMessage:false,
                error:false,
                fullScreen:{
                    fullscreenmodel:false,
                    answeredValue:"",
                    wrongAnswer: false,
                    showAnimation: false,
                    questions:[],
                    userPoint:0,
                    firebaseKey:"",
                    challengerPoint:0,
                    answers:[],
                    index:0, //index for question navigation
                    value:"", // value for loading
                    user:[],
                    time:20, // time for navigation
                    started:true, // started for user enterance
                    inc:100, // increase
                    startChallenge:this.closeFullscreen,
                    challenger:[],
                    loading:false, // waiting user enterance
                    closeFullscreen:this.closeFullscreen,
                    clickToChoose:this.clickToChoose,
                    answerQuestion:this.answerQuestion,
                }
            }
        },
        created(){
            window.addEventListener('beforeunload',function () {
                if (this.fullScreen.started){
                    db.ref("challengers")
                        .child(this.key)
                        .child("sender")
                        .child("status")
                        .child("status")
                        .set("finished");
                }
            }.bind(this));
            db.ref("challengers").on('value',(snapshot)=>{
                var arr = [];
                snapshot.forEach(s=>{
                    // eslint-disable-next-line no-unused-vars
                    if (s.val().challenger.user.username.toLowerCase() === this.user.toLowerCase() && s.val().challenger.status.status === "available"){
                        arr.push(s.val());
                    }
                    else if(s.val().challenger.status.status === "available" && s.val().sender.user.username.toLowerCase() === this.user.toLowerCase()){
                        arr.push(s.val());
                    }
                })
                this.items = arr;
            });
            // db.ref("challengers").on('child_added',(snapshot)=>{
            //     this.items.push(snapshot.val());
            // });
            db.ref("challengers").on('value',(snapshot)=>{
                var arr = [];
                snapshot.forEach(s=>{
                    if(s.val().challenger.status.status === "finished" && s.val().challenger.user.username.toLowerCase() === this.user.toLowerCase()){
                        arr.push(s.val());
                    }
                    else if(s.val().challenger.status.status === "finished" && s.val().sender.user.username.toLowerCase() === this.user.toLowerCase()){
                        arr.push(s.val());
                    }
                });
                for(var x = 0;x < arr.length;x++){
                    if(arr[x].challenger.user.username.toLowerCase() === this.user.toLowerCase() && arr[x].challenger.point.point > arr[x].sender.point.point){
                        arr[x].color = {
                            color:"#d9e3d3"
                        }
                    }
                    else{
                        arr[x].color={
                            color:"#e0c3c3"
                        }
                    }
                }
                this.finishedItems = arr;
                console.log(arr[0].color);
            })
        },
        methods:{
            clickList(key,index){
                db.ref("challengers").child(key).child("challenger").child("entered").child("entered").set(true);
                this.initializeQuestionAndAnswer(key);
                this.checkWhenRemoved(key);
                this.fullScreen.firebaseKey = key;
                this.fullScreen.user = this.items[index].sender.user;
                this.fullScreen.challenger = this.items[index].challenger.user;
                this.fullScreen.fullscreenmodel = true;
                this.userPoint = this.items[index].sender.point;
                this.challengerPoint = this.items[index].challenger.point;
                this.initilizeUpdatesScore(key);
                // eslint-disable-next-line no-unused-vars
                db.ref("challengers").child(this.firebaseKey).on('child_removed',(snapshot)=>{
                    clearInterval(this.timer);
                });
            },
            initializeQuestionAndAnswer(key){
                var questions = []
                    var answers = []
                db.ref("challengers").child(key).child("game").on('value',(snapshot)=>{
                    // eslint-disable-next-line no-unused-vars
                    var arr = snapshot.val().Ids;
                    // eslint-disable-next-line no-unused-vars
                    db.ref("subjects").child(snapshot.val().name).on('value',(e)=>{
                        e.forEach(s=>{
                            for (var x = 0;x < arr.length;x++){
                                if (arr[x] === s.key){
                                    questions.push(s.val().question);
                                    answers.push(s.val().answers);
                                    break;
                                }
                            }
                        });
                    })
                })
                this.fullScreen.questions = questions;
                this.fullScreen.answers = answers;
                this.start();
            },
            closeFullscreen(val){
                if(val){
                    db.ref("challengers").child(this.fullScreen.firebaseKey).remove();
                }
                this.update();
                clearInterval(this.timer);
                this.fullScreen.fullscreenmodel = false;
            },
            async start () {
                this.timer = setInterval( () => {
                    if(this.fullScreen.index === this.fullScreen.questions.length){
                            clearInterval(this.timer);
                            db.ref("challengers")
                                .child(this.fullScreen.firebaseKey)
                                .child("challenger")
                                .child("status")
                                .child("status")
                                .set("finished");
                            this.fullScreen.started = false;
                            this.doneMessage = true;
                            this.error = false;
                            this.closeFullscreen(false);
                            var thread = setInterval(()=>{
                                setTimeout(function () {
                                    this.doneMessage = false;
                                    this.error = false;
                                    clearInterval(thread);
                                }.bind(this),3000);
                            },1000);
                            // this.closeFullscreen("");
                            // console.log("why");
                            // this.closeFullscreen("");
                            // this.doneMessage = false;
                            //     this.error = false;
                            // setTimeout(function () {
                            //     this.doneMessage = true;
                            //     this.error = false;
                            // }.bind(this),3000);
                    }
                    else{
                        this.fullScreen.time--;
                        this.fullScreen.inc -=5;
                        if (this.fullScreen.time===0){
                            this.fullScreen.inc = 100;
                            this.fullScreen.time = 20;
                            this.fullScreen.index++;
                        }
                    }
                },1000)

            },
            initilizeUpdatesScore(key){
                db.ref("challengers").child(key).child("sender").child("point").on('child_changed',(snap)=>{
                    this.fullScreen.userPoint = snap.val();
                    console.log(snap.val());
                })
            },
            answerQuestion() {
                for (var x = 0;x < this.fullScreen.answers.length;x++){
                    for (var y = 0;y < this.fullScreen.answers[x].length;y++){
                        if (this.fullScreen.answers[x][y].text === this.fullScreen.answeredValue && this.fullScreen.answers[x][y].correct){
                            this.fullScreen.challengerPoint++;
                            this.bindAllThem(false);
                        }
                        else if(this.fullScreen.answers[x][y].text === this.fullScreen.answeredValue && !this.fullScreen.answers[x][y].correct){
                            this.bindAllThem(true);
                        }
                    }
                }
            },
            bindAllThem(wrong){
                clearInterval(this.timer);
                this.fullScreen.wrongAnswer = wrong;
                this.fullScreen.started = false;
                this.fullScreen.showAnimation = true;
                setTimeout(function () {
                    this.fullScreen.showAnimation = false;
                    this.fullScreen.inc = 100;
                    this.fullScreen.time = 20;
                    this.fullScreen.index++;
                    this.fullScreen.started = true;
                    if(this.fullScreen.index === this.fullScreen.questions.length){
                        clearInterval(this.fullScreen.timer);
                    }
                    this.start();
                    db.ref("challengers").child(this.fullScreen.firebaseKey).child("challenger").child("point").child("point").set(this.fullScreen.challengerPoint);
                }.bind(this),3000)
            },
            clickToChoose(key){
                this.fullScreen.answeredValue = key;
            },
            checkWhenRemoved(key){
                // eslint-disable-next-line no-unused-vars
                db.ref("challengers").on('child_removed',(snap)=>{
                    if (snap.val().key === key){
                        this.closeFullscreen(key);
                    }
                })
            },
            update(){
                    this.fullScreen.fullscreenmodel=false,
                    this.fullScreen.answeredValue="",
                    this.fullScreen.wrongAnswer=false,
                    this.fullScreen.showAnimation = false,
                    this.fullScreen.questions = [],
                    this.fullScreen.userPoint = 0,
                    this.fullScreen.firebaseKey="",
                    this.fullScreen.challengerPoint=0,
                    this.fullScreen.answers=[],
                    this.fullScreen.index=0, //index for question navigation
                    this.fullScreen.value="", // value for loading
                    this.fullScreen.user=[],
                    this.fullScreen.time=20, // time for navigation
                    this.fullScreen.started=true, // started for user enterance
                    this.fullScreen.inc=100, // increase
                    this.fullScreen.challenger=[]// waiting user enterance
            }
        },

    }
</script>

<style scoped>

</style>