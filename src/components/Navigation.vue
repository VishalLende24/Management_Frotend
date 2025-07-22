<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Smart Product Management</h1>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Navigation Links -->
          <div v-if="isAuthenticated" class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              to="/dashboard"
              class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{
                'border-indigo-500': $route.path === '/dashboard',
                'border-transparent hover:border-gray-300': $route.path !== '/dashboard',
              }"
            >
              Dashboard
            </router-link>

            <router-link
              to="/profile"
              class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{
                'border-indigo-500': $route.path === '/profile',
                'border-transparent hover:border-gray-300': $route.path !== '/profile',
              }"
            >
              Profile
            </router-link>
          </div>

          <!-- User Menu -->
          <div v-if="isAuthenticated" class="ml-3 relative">
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-700">{{ userName }}</span>
              <button
                @click="handleLogout"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Auth Links -->
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/"
              class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/signup"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isAuthenticated" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/dashboard"
          class="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          :class="{
            'bg-indigo-50 border-indigo-500': $route.path === '/dashboard',
            'hover:bg-gray-50': $route.path !== '/dashboard',
          }"
        >
          Dashboard
        </router-link>

        <router-link
          to="/profile"
          class="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          :class="{
            'bg-indigo-50 border-indigo-500': $route.path === '/profile',
            'hover:bg-gray-50': $route.path !== '/profile',
          }"
        >
          Profile
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const isAuthenticated = computed(() => {
  return localStorage.getItem("isAuthenticated") === "true";
});

const userName = computed(() => {
  return localStorage.getItem("userName") || localStorage.getItem("userEmail") || "User";
});

const handleLogout = async () => {
  try {
    await api.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("Authorization");
    if (window._setAuth) window._setAuth(false);
    router.push("/");
  }
};
</script>
