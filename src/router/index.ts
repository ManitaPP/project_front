import { createRouter, createWebHistory} from "vue-router";
import LoginView from "../View/LoginView.vue";
const routes = [
  {
    path: '/',          
    redirect: '/login', 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_URL),
  routes,
});

// console.log("history", process.env.BASE_URL)

export default router;