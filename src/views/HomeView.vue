<script setup lang="ts">
import { io, Socket } from 'socket.io-client'
import { computed, onMounted, reactive, ref, type Reactive, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/navbar.vue'
import { exportNumbers, importNumbers } from '@/utils/excel'
const router = useRouter()

let socket: Socket;


let mode: Ref<'list' | 'excel'> = ref('list');

const toggleMode = () => {
  mode.value = mode.value == 'excel' ? 'list' : 'excel';
}

let numbers: Ref<string[]> = ref([]);
let nextNumber: Ref<string> = ref('');

const addNumber = () => {
  if (!nextNumber.value) return;
  numbers.value.push(nextNumber.value);
  nextNumber.value = '';
}

let isLoading: Ref<boolean> = ref(false);
let results: Ref<
  {
    part: string, exist: number, adeo: number, autodoc: number
  }[]
> = ref([])

let file: File | null = null;
const addFile = async (e: Event) => {
  file = (e.target! as HTMLInputElement).files![0]!;
  const res = await importNumbers(file);
}

onMounted(async () => {
  if (!localStorage.getItem('token')) {
    await router.push('/login')
  }

  try {
    const r = await axios.get('/api/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    localStorage.clear();
    await router.push('/signup')
  }

  socket = io({
    auth: {
      token: localStorage.getItem('token'),
    },
  })
  socket.on('progress', (el: { part: string, exist: number, adeo: number, autodoc: number }) => {
    results.value.push(el)
  });
  socket.on('finish', () => {
    isLoading.value = false;
  })

})


const start = async () => {
  if (numbers.value.length == 0) return alert("Необходимо ввести артикулы");
  isLoading.value = true;
  socket.emit("parse", numbers.value)
}

const download = async () => {
  await exportNumbers(results.value);
}

</script>

<template>
  <main>
    <Navbar />
    <div class="content">
      <header>
        <img src="/parsing.svg" alt="">
        <h1>Проценка артикулов</h1>
      </header>
      <div class="selection-container">
        <button @click="toggleMode" :class="mode == 'list' ? 'mode-selected' : ''" class="selection-option">Одиночные
          артикулы (ввод
          списком)</button>
        <button @click="toggleMode" :class="mode != 'list' ? 'mode-selected' : ''" class="selection-option">Загрузка
          Excel-файла</button>
      </div>
      <div v-if="!isLoading && results.length == 0" class="parser-container">
        <div class="list" v-if="mode == 'list'">
          <label>Список артикулов</label>
          <ul>
            <li v-for="n in numbers">{{ n }}</li>
          </ul>
          <input type="text" class="new-number input" v-model="nextNumber" placeholder="Новый артикул">
          <button class="add-number btn scale" @click="addNumber">Добавить артикул</button>
        </div>
        <div class="list" v-else>
          <label>Файл с артикулами (столбец А, с ячейки А1)</label>
          <input type="file" class="input" accept=".xlsx" @change="addFile">
        </div>
        <button @click="start" class="start btn scale">Начать проценку</button>
      </div>
    </div>
    <div v-if="isLoading">
      <h2>Идет проценка...</h2>
    </div>
    <div class="" v-else-if="!isLoading && results.length > 0">
      <h2>Проценка завершена!</h2>
      <button class="btn">Скачать результат</button>
    </div>
  </main>
</template>
<style scoped>
main {
  background-color: #F8FAFC;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
}

header {
  margin-top: 1.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  background: white;
  border-radius: 0.5rem;
  gap: 1rem;
}

h1 {
  line-height: 1.4;
  font-size: 20px;
  font-weight: 600;
}

.res-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.selection-container {
  margin-top: 2rem;
  background: #E8E7F1;
  align-self: flex-start;
  padding: 0.125rem;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: start;
  gap: 0.125rem;
}

.selection-option {
  outline: none;
  border: none;
  background: none;
  padding: 0.5rem 1rem;
  line-height: auto;
  cursor: pointer;
  border-radius: 4px;
  color: #1A1B22;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
}

.mode-selected {
  background: white;
}

.parser-container {
  padding: 1.5rem;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem
}

.content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
}

label {
  line-height: 1.4;
  font-weight: 500;
  font-size: 14px;
}

.add-number {
  font-size: 14px;
}

.start {
  align-self: flex-end;
  margin-top: 2rem;
}
</style>
