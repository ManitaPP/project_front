import { createRouter, createWebHistory} from "vue-router";
import LoginView from "../View/LoginView.vue";
import ProfileView from "../View/ProfileView.vue";
import UserManagementView from "../View/userManagementView.vue";
import RegisterView from "../View/RegisterView.vue";
import RegisterAdminView from "../View/RegisterAdminView.vue";
import { useAuthStore } from "../stores/auth.store";
import ForbiddenView from "../View/ForbiddenView.vue";
import PositionView from "../View/PositionView.vue";
import DiagramView from "../View/DiagramView.vue";
import CapImageView from "../View/CapImageView.vue";
import CapSignatureView from "../View/CapSignatureView.vue";

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
    meta: { requiredRoles: ['user', 'admin'] },
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
  {
    path: '/position',
    name: 'position',
    component: PositionView,
  },
  {
    path: '/diagram',
    name: 'diagram',
    component: DiagramView,
  },
  {
    path: '/capImage',
    name: 'capImage',
    component: CapImageView,
  },
  {
    path: '/capSignature',
    name: 'capSignature',
    component: CapSignatureView,
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