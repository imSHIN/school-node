<template>
  <div class="wrapper">
    <keep-alive>
      <v-head></v-head>
    </keep-alive>
    <keep-alive>
      <v-sidebar></v-sidebar>
    </keep-alive>
    
    <div class="content">
      <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
    
  </div>
</template>

<script>
  import vHead from './header.vue'
  import vSidebar from './sidebar.vue'
  export default {
    components: {
      vHead, vSidebar
    }
  }
</script>
