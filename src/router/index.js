import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import LoginForm from "../components/LoginForm.vue";
import SignupForm from "../components/SignupForm.vue";
import Dashboard from "../components/Dashboard.vue";
import Profile from "../components/Profile.vue";

const routes = [
  // {
  //   path: "/signup",
  //   name: "Home",
  //   component: Home,
  //   meta: { requiresGuest: true },
  // },
  {
    path: "/",
    name: "Login",
    component: LoginForm,
    meta: { requiresGuest: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupForm,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/products",
    name: "Products",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/");
    return;
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    next("/dashboard");
    return;
  }

  next();
});

export default router;
