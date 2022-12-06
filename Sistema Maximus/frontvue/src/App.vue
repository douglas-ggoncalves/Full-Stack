<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import SocketioService from '../services/socketio.service.js';

export default {
  
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
};
</script>

