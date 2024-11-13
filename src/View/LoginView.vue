<!-- views/LoginView.vue -->
<template>
  <div class="login">
    <h1>Login Page</h1>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      // เพิ่มโค้ดการตรวจสอบเข้าสู่ระบบที่นี่
      // ตัวอย่าง: เปลี่ยนเส้นทางไปยังหน้า Home หลังจากล็อกอินสำเร็จ
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.login {
  text-align: center;
}
</style>
