<template>
  <main class="main">
    <div class="center">
      <form @submit.prevent="onSubmit" class="form">
        <div class="padded">
          <Logo>Регистрация</Logo>
          <div class="fields">
            <label class="label" for="username">Имя пользователя</label>
            <input class="input" type="text" id="username" v-model="form.name" placeholder="ivan_autolityca" />
            <label class="label" for="password">Пароль</label>
            <input class="input" type="password" id="password" v-model="form.password" placeholder="Пароль" />
            <lable class="label" for="key">Ключ доступа</lable>
            <input class="input" type="text" if="key" v-model="form.key" placeholder="abcdef" />
          </div>
          <button class="btn scale" type="submit">Зарегистрироваться</button>
        </div>
        <div class="cover">
          <RouterLink class="link" to="/login">Уже есть аккаунт? Войти</RouterLink>
        </div>
      </form>
      <Suppliers />
    </div>

    <Footer />
  </main>
</template>

<style scoped>
input {
  margin-top: 0.3rem;
}

button {
  margin-top: 1.5rem;
}

a {
  text-align: center;
}
</style>

<script setup lang="ts">
import Footer from '@/components/footer.vue'
import Logo from '@/components/logo.vue'
import Suppliers from '@/components/suppliers.vue'
import axios, { AxiosError } from 'axios'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const form = reactive({
  name: '',
  password: '',
  key: '',
})

const router = useRouter()
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
    const res = await axios.post('/api/user', {
      username: form.name,
      password: form.password,
      signupKey: form.key,
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
