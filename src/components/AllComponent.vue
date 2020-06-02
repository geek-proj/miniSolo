<template>
    <v-content>
    <v-toolbar flat color="#5278a3" dark>
      <v-toolbar-title>Challenge</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical color="#5278a3" slider-size="5">
      <v-tab >
        <v-icon left color="#ab9754">mdi-flash</v-icon>
        Challenges
      </v-tab>
      <v-tab >
        <v-icon left>mdi-history</v-icon>
        History
      </v-tab>
        <v-tab v-on:click="signOut">
            <v-icon left>mdi-exit-to-app</v-icon>
            Exit
          </v-tab>
      <v-tab-item >
        <ChooseComponent/>
      </v-tab-item>
        <v-tab-item >
        <HistoryComponent/>
      </v-tab-item>
    </v-tabs>

    </v-content>
</template>
<script>
    import ChooseComponent from "@/components/ChooseComponent";
    import firebase from "firebase"
    import HistoryComponent from "@/components/HistoryComponent";
    export default {
        name: "AllComponent",
        components:{
            HistoryComponent,
            ChooseComponent,
        },
        methods:{
            signOut(){
                firebase.auth().signOut().then(
                    // eslint-disable-next-line no-unused-vars
                    data=>{
                        // eslint-disable-next-line no-unused-vars
                        this.$router.push({ path: this.redirect || '/login' }, onComplete => { }, onAbort => { })
                    }
                    // eslint-disable-next-line no-unused-vars
                ).catch(e=>{
                })

            },
            created(){
            },
        }
    }
</script>

<style scoped>

</style>