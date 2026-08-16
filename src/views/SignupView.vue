<template>
  <main>
    <form @submit.prevent="onSubmit">
      <h2>Registration</h2>
      <div>
        <!-- <label for="username">name</label> -->
        <input type="text" id="username" v-model="form.name" placeholder="name" />
      </div>
      <div>
        <!-- <label for="password">password</label> -->
        <input type="password" id="password" v-model="form.password" placeholder="password" />
      </div>
      <div>
        <!-- <lable for="key">key</lable> -->
        <input type="text" if="key" v-model="form.key" placeholder="key" />
      </div>
      <button type="submit">Зарегистрироваться</button>
      <RouterLink to="/login">Уже есть аккаунт? Войти</RouterLink>
    </form>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  margin: -8px;
}

main > div {
  position: relative;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 380px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  gap: 16px;
}

h2 {
  margin: 0 0 10px 0;
  text-align: left;
  color: #1a1a1a;
  font-size: 32px;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #c8cdd3;
  border-radius: 10px;
  font-size: 15px;
  box-sizing: border-box;
  background-color: transparent;
  color: #333;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 apx rgba(59, 130, 246, 0.15);
  background-color: white;
}

button {
  padding: 14px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

button:hover {
  background-color: #2563eb;
}

button:active {
  transform: scale(0.97);
}
</style>

<script setup>
import { reactive } from 'vue'
const form = reactive({
  name: '',
  password: '',
  key: '',
})
const onSubmit = async () => {
  if (form.name.length < 5) {
    alert('Имя пользователя должно быть хотя бы 4 символа')
    return
  }

  if (form.password.length < 8) {
    alert('Пароль должен быть хотя бы 8 символов')
    return
  }

  try {
    const res = await axios.post('/api/me', {
      username: name.value,
      password: pass.value,
    })
    localStorage.setItem('token', res.data.token)
    await router.push('/')
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        alert('Ошибка авторизации')
      } else if (error.response?.status === 409) {
        alert('Пользователь уже существует')
      }
    }
    form.name = ''
    form.key = ''
    form.password = ''
  }
}
</script>
