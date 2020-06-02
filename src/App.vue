<template>
  <v-app>
    <transition >
      <router-view/>
    </transition>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
  },

  data: () => ({
    //
  }),
};
</script>
<style>
    body{
        font-family: 'Raleway', sans-serif;
    }
    .v-content .v-banner__wrapper .v-banner__content{
        display: block !important;
    }
    .v-list-item{
        margin-top:10px;
    }
  .title {
    font-family: 'Raleway', sans-serif !important;
  }
</style>