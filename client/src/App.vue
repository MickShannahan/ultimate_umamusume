<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { RouterView } from 'vue-router';
import { umasService } from './services/UmasService.js';

onMounted(umasService.loadFavoriteUmas)

</script>

<template>
  <nav class="bg-black">
    <i class="fw-bold fs-5 text-white">Ultimate Umamusume 🏇</i>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss"></style>
