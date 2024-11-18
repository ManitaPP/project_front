import { createRouter, createWebHistory} from "vue-router";
import LoginView from "../View/LoginView.vue";
import ProfileView from "../View/ProfileView.vue";
import UserManagementView from "../View/userManagementView.vue";
import RegisterView from "../View/RegisterView.vue";
import RegisterAdminView from "../View/RegisterAdminView.vue";
import { useAuthStore } from "../stores/auth.store";
import ForbiddenView from "../View/ForbiddenView.vue";

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
    meta: { requiredRole: 'user' },
  },
  {
    path: '/userManagement',
    name: 'userManagement',
    component: UserManagementView,
    meta: { requiredRole: 'admin' },
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
  {
    path: '/forbidden',
    name: 'forbidden',
    component: ForbiddenView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userRole = authStore.currentUser?.role;
  console.log("role",userRole);

  if (!userRole && to.meta.requiredRole) {
    next({ name: 'Login' });
  }
  else if (to.meta.requiredRole && to.meta.requiredRole !== userRole) {
    next({ name: 'forbidden' });
  }
  else {
    next();
  }
});


export default router;