<template>
    <form @submit.prevent="onSubmit">
        <h1>Вход</h1>
        <label for="username">Имя пользователя</label>
        <input name="username" v-model="name" type="text" />
        <label for="password">Пароль</label>
        <input type="password" v-model="pass" />
        <button type="submit">Войти</button>
        <RouterLink to="/login">Создать аккаунт</RouterLink>
    </form>
</template>
<script lang="ts" setup>
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
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 1.5rem;

}

label {
    margin-top: 0.5rem;
}

button {
    margin-top: 0.5rem;
    font-size: 1.7rem;
    font-weight: semibold;
    padding: 0.25rem 0.5rem;
    outline: none;
    border: 1px solid black;
    border-radius: 0.25rem;
    background-color: white;
    cursor: pointer;
}

a {
    text-decoration: none !important;
}
</style>
