import { createRouter, createWebHistory} from "vue-router";
import LoginView from "../View/LoginView.vue";
import ProfileView from "../View/ProfileView.vue";
import UserManagementView from "../View/userManagementView.vue";
import RegisterView from "../View/RegisterView.vue";
import RegisterAdminView from "../View/RegisterAdminView.vue";
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
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
  },
  {
    path: '/userManagement',
    name: 'userManagement',
    component: UserManagementView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/registerAdmin',
    name: 'registerAdmin',
    component: RegisterAdminView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_URL),
  routes,
});


// console.log("history", process.env.BASE_URL)

export default router;