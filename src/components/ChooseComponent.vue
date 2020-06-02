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
                    v-for="(item, i) in items"
                    :key="i"
                    cols="8"
                  >
                      <v-hover>
                          <v-banner style="display: block !important;"
                                    slot-scope="{ hover }"
                                    :class="`elevation-${hover ? 10 :0}`">
                              <v-card elevation="0" >
                              <div class="d-flex flex-no-wrap justify-space-between" style="padding: 10px">
                                <div class="flex-column">
                                  <div class="flex-row justify-space-around">
                                      <v-avatar
                                          class="ma-3"
                                          size="70"
                                        >
                                          <v-img :src="item.image"></v-img>
                                      </v-avatar>
                                      <span v-text="item.username"
                                        style="color:#585f63;font-family: 'Raleway', sans-serif;font-weight: bold;border-bottom: 1px solid #585f63;"></span>
                                        <v-btn color="#5278a3" style="color:white;margin:5px" x-small elevation="0">
                                            Beginner
                                        </v-btn>
                                  </div>
                                    <div class="flex-column flex-nowrap">
                                        <div style="margin-top: 10px;display: inline-block" v-for="(subjects,i) in item.values" :key="i">
                                            <v-btn color="white" elevation="1" style="margin-right: 5px" x-small v-text="subjects.val" v-bind:style="subjects.color">
                                            </v-btn>
                                        </div>
                                    </div>

                                </div>
                                <div class="d-flex flex-row" style="align-items: center;justify-content: center">
                                    <v-btn color="#5278a3" v-on:click="openDialog(item.values,item.username,item.image)">
                                                  <span style="color:white"> Challenge </span>
                                    </v-btn>
                                    <v-dialog v-model="dialog"  scrollable max-width="300px" persistent>
                                        <template >
                                        </template>
                                      <v-card>
                                        <v-list dense >
                                          <v-list-item-group v-model="list" color="primary">
                                            <v-list-item
                                              v-for="(item, i) in chooseSubject"
                                              :key="i"
                                              @click="openFullscreen(item.val)"
                                            >
                                              <v-list-item-content>
                                                <v-list-item-title v-text="item.val"></v-list-item-title>
                                              </v-list-item-content>
                                              <v-list-item-action>
                                                  <v-btn icon>
                                                    <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                                  </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                          </v-list-item-group>
                                        </v-list>
                                          <v-card-actions>
                                                  <v-btn
                                                          color="white"
                                                          elevation="0" style="color:red" small v-on:click="close">
                                                    Close
                                                    </v-btn>
                                          </v-card-actions>
                                        <v-divider></v-divider>
                                      </v-card>
                                    </v-dialog>
                                    <Fullscreen
                                            :challenger-point="challengerPoint"
                                            :user-point="userPoint"
                                            :fullscreenmodel="fullscreenModel"
                                    :questions="questions"
                                    :answers="answers"
                                    :index="index"
                                    :value="value"
                                    :time="time"
                                    :started="started"
                                    :inc="inc"
                                                :user="user"
                                    :challenger="challenger"
                                    :loading="loading"
                                    :start-challenge="startChallenge"
                                    :close-fullscreen="closeFullscreen"
                                            :answer-question="answerQuestion"
                                            :click-to-choose="clickToChoose"
                                            :show-animation="showAnimation"
                                            :wrong-answer="wrongAnswer"
                                    ></Fullscreen>
                                </div>
                              </div>
                              </v-card>
                            </v-banner>
                      </v-hover>
                  </v-col>
            </v-row>
      </v-container>
    </div>
</template>

<script>
    import {db} from "@/plugins/firebase";
    import Fullscreen from "@/components/Fullscreen";

    export default {
        name: "ChooseComponent",
        components:{
            Fullscreen
        },
        data(){
          return{
              doneMessage:false,
              error:false,
              isRunning: false,
              user: {
                  username:this.$store.getters.user.data.email,
                  image:"",
              },
              challenger:{
                  username:"",
                  image:""
              },
              list:1,
              fullscreenModel:false,
              items: [],
              inc:100,
              answeredValue:"",
              wrongAnswer: false,
              showAnimation: false,
              dialog:false,
              subjects:[
                  {
                      color:"color:#8ca867",
                      title:"Python"
                  },
                  {
                      color:"color:#6a9ead",
                      title: "C++"
                  },
                  {
                      color:"color:#baa463",
                      title: "Java"
                  },
                  {
                      color:"color:#b04f45",
                      title: "Ruby"
                  }
              ],
              value:0,
              chooseSubject:[],
              secondes:0,
              loading:false,
              started:false,
              time:20,
              timer:null,
              questions:[],
              answers:[],
              ids:[],
              index:0,
              selectedIndex:0,
              challengerPoint:0,
              userPoint:0,
              key:"",
              challenges:{
                  challenger:{
                      user:"",
                      entered: {
                          entered:false
                      },
                      status:{
                          status:"available",
                      },
                      point:{
                          point:0
                      }
                  },
                  sender:{
                      user:"",
                      point:{
                          point:0
                      },
                      status:{
                          status:"available",
                      },
                  },
                  game:{
                      name:"",
                      Ids:{}
                  },
                  key:""
              }
          }
        },
        created(){
            db.ref("users").once('value',(snapshot)=>{
                var arr = []
                snapshot.forEach(function (key) {
                    arr.push(key.val());
                })
                for (var x = 0;x < arr.length;x++){
                    if(arr[x].username === this.user.username){
                        this.user.image = arr[x].image;
                        continue;
                    }
                    this.items.push(arr[x]);
                }
            });
            // eslint-disable-next-line no-unused-vars
            window.addEventListener('beforeunload',function () {
                if (this.started){
                    db.ref("challengers")
                        .child(this.key)
                        .child("sender")
                        .child("status")
                        .child("status")
                        .set("finished");
                }
            }.bind(this))
        },
        computed:{
        },
        methods: {

            changePoints(key){
              db.ref("challengers").child(key).child("challenger").child("point").on('child_changed',(snap)=>{
                  this.challengerPoint = snap.val();
              });
            },
            start () {
                this.timer = setInterval( () => {
                    if(this.index === this.answers.length){
                        this.started = false;
                        clearInterval(this.timer);
                        db.ref("challengers")
                            .child(this.key)
                            .child("sender")
                            .child("status")
                            .child("status")
                            .set("finished");
                        this.closeFullscreen(false);
                        this.doneMessage = true;
                        this.error = false;
                        var thread = setInterval(()=>{
                            console.log("yes");
                            setTimeout(function () {
                                this.doneMessage = false;
                                this.error = false;
                                clearInterval(thread);
                            }.bind(this),3000);
                        },1000);
                        // this.closeFullscreen("");
                        // setTimeout(function () {
                        //     this.doneMessage = true;
                        //     this.error = false;
                        // }.bind(this),3000);
                    }
                    else{
                        this.time--;
                        this.inc -=5;
                        if (this.time===0){
                            this.updateTheValues();
                        }
                    }
                },1000)
            },
            updateTheValues(){
                this.inc = 100;
                this.time = 20;
                this.index++;
                if(this.index === this.questions.length){
                    clearInterval(this.timer);
                }
            },
            async add(key) {
                await this.items.push(key);
            },
            close() {
                this.dialog = false;
            },
            openFullscreen(key) {
                this.fullscreenModel = true;
                this.challenges.game.name = key;
                this.questions = [];
                this.answers = [];
                db.ref("subjects").child(key).on('value',(snapshot)=>{
                    var arr = [];
                    var keys = [];
                    console.log("it is in");
                    snapshot.forEach(function (key) {
                        arr.push(key.val());
                        keys.push(key.key);
                    })
                    this.ids = keys;
                    for (var x = 0;x < arr.length;x++){
                        this.questions.push(arr[x].question);
                        this.answers.push(arr[x].answers);
                    }
                });
            },
            // eslint-disable-next-line no-unused-vars
            closeFullscreen(val) {
                clearInterval(this.timer);
                this.inc = 100;
                this.time = 20;
                this.subjects = [];
                this.index = 0;
                this.started = false;
                this.fullscreenModel = false;
                this.loading = false;
                this.challengerPoint = 0;
                this.userPoint = 0;
                this.started = false;
                this.value = 0;
                // eslint-disable-next-line no-unused-vars
                if (this.key !== undefined && this.key !== null && this.key !== "" && val){
                    db.ref("challengers").child(this.key).remove()
                }
                this.destroy();
            },
            openDialog(mySubjects,username,image){
                this.dialog = true;
                this.chooseSubject = mySubjects;
                this.challenger = {username: username,image: image};
            },
            startChallenge(){
                // this.started = true;
                this.loading = true;
                this.load();
                this.checkWhenRemoved(this.key);
                this.challenges.sender.user = this.user;
                this.challenges.challenger.user = this.challenger;
                this.challenges.game.Ids = this.ids;
                this.key = this.ID();
                this.changePoints(this.key);
                this.challenges.key = this.key;
                db.ref("challengers").child(this.key).set(this.challenges);
                // eslint-disable-next-line no-unused-vars
                db.ref("challengers").child(this.key).child("challenger").child("entered").on('child_changed',(snapshot)=>{
                    this.loading = false;
                    this.destroy();
                    this.start();
                    this.started = true;
                })
                // eslint-disable-next-line no-unused-vars
                db.ref("challengers").child(this.key).on('child_removed',(snapshot)=>{
                    clearInterval(this.timer);
                });
            },
            ID(){
                return Math.random().toString(36).substr(2, 10);
            },
            answerQuestion(){
                for (var x = 0;x < this.answers.length;x++){
                    for (var y = 0;y < this.answers[x].length;y++){
                        if (this.answers[x][y].text === this.answeredValue && this.answers[x][y].correct){
                            this.userPoint++;
                            this.bindAllThem(false);
                        }
                        else if(this.answers[x][y].text === this.answeredValue && !this.answers[x][y].correct){
                            this.bindAllThem(true);
                        }
                    }
                }
            },
            clickToChoose(key){
                this.answeredValue = key;
            },
            bindAllThem(wrong){
                clearInterval(this.timer);
                this.wrongAnswer = wrong;
                this.started = false;
                this.showAnimation = true;
                setTimeout(function () {
                    this.showAnimation = false;
                    this.inc = 100;
                    this.time = 20;
                    this.index++;
                    this.started = true;
                    if(this.index === this.questions.length){
                        clearInterval(this.timer);
                    }
                    this.start();
                    db.ref("challengers").child(this.key).child("sender").child("point").child("point").set(this.userPoint);
                }.bind(this),3000)
            },
            destroy () {
              clearInterval(this.interval);
            },
            load () {
              this.interval = setInterval(() => {
                if (this.value === 100) {
                  return (this.value = 0)
                }
                this.value += 10
              }, 1000)
            },
            checkWhenRemoved(key){
                // eslint-disable-next-line no-unused-vars
                db.ref("challengers").on('child_removed',(snap)=>{
                    if (snap.val().key === key){
                        this.closeFullscreen(key);
                    }
                })
            },
        },

    }
</script>

<style scoped>
    .class1{

    }

</style>