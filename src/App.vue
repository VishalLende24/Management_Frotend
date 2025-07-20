<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Navigation from "./components/Navigation.vue";

const isAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");

const handleStorage = (event) => {
  if (event.key === "isAuthenticated") {
    isAuthenticated.value = event.newValue === "true";
  }
};

onMounted(() => {
  window.addEventListener("storage", handleStorage);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleStorage);
});

window._setAuth = (val) => {
  isAuthenticated.value = val;
};
</script>

<template>
  <div id="app">
    <Navigation v-if="isAuthenticated" />
    <router-view />
  </div>
</template>
