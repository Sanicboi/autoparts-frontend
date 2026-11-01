<template>
  <main class="main">
    <div class="center">
      <form class="form" @submit.prevent="onSubmit">
        <div class="padded">
          <Logo>Вход</Logo>
          <div class="fields">
            <label class="label">Имя пользователя</label>
            <input name="username" class="input" placeholder="ivan_autolytica" v-model="name" type="text" />
            <div class="password">
              <label class="label">Пароль</label>
              <RouterLink to="/recover" class="link">Забыли пароль?</RouterLink>
            </div>
            <input type="password" class="input" placeholder="Пароль" v-model="pass" />
          </div>
          <button type="submit" class="btn scale">Войти</button>
        </div>
        <div class="cover">
          <p class="no-account">Нет аккаунта?</p>
          <RouterLink class="link scale" to="/signup">Создать аккаунт</RouterLink>
        </div>
      </form>
      <Suppliers />
    </div>
    <Footer />
  </main>
</template>
<script lang="ts" setup>
import Footer from '@/components/footer.vue'
import Logo from '@/components/logo.vue'
import Suppliers from '@/components/suppliers.vue'
import axios, { AxiosError } from 'axios'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

let name: Ref<string> = ref('')
let pass: Ref<string> = ref('')

const router = useRouter()

const onSubmit = async () => {
  if (name.value.length < 5) {
    alert('Имя пользователя должно быть хотя бы 4 символа')
    return
  }

  if (pass.value.length < 8) {
    alert('Пароль должен быть хотя бы 8 символов')
    return
  }

  try {
    const res = await axios.post('/api/login', {
      username: name.value,
      password: pass.value,
    })
    localStorage.setItem('token', res.data.token)
    await router.push('/')
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        alert('Ошибка авторизации')
      } else if (error.response?.status === 404) {
        alert('Пользователь не существует')
      }
    }
    name.value = ''
    pass.value = ''
  }
}
</script>
<style scoped>
input {
  margin-top: 0.3rem;
}

.password {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  cursor: pointer;
}


button {
  margin-top: 1.5rem;
}




.no-account {
  font-size: 12px;
  line-height: 1.2;
  color: #64748B;
}
</style>
