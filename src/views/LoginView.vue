<template>
    <main>
        <form @submit.prevent="onSubmit">
            <div class="bottom">
                <h1>Вход</h1>
                <input name="username" placeholder="Имя пользователя" v-model="name" type="text" />
                <input type="password" placeholder="Пароль" v-model="pass" />
            </div>
            <div class="bottom">
                <button type="submit">Войти</button>
                <RouterLink to="/login">Нету аккаунта? Создать аккаунт</RouterLink>
            </div>
        </form>
    </main>
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
main {
    background-color: #f3f4f6;
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

form {
    margin: auto;
    background-color: white;
    border-radius: 1rem;
    padding: 0.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    min-width: 25%;
}

h1 {
    margin: 0;
}

label {
    margin-top: 0.5rem;
}

button {
    margin-top: 3rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
    outline: none;
    border: none;
    border-radius: 10px;
    background-color: #3b82f6;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
}

button:hover {
    transform: scale(1.03);
}

a {
    font-size: 14px;
    margin-top: 0.5rem;
}

.bottom {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
}

input {
    outline: none;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    background-color: #f9fafb;
    border-radius: 10px;
    margin-top: 1rem;
}
</style>
