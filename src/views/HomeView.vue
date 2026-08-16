<script setup lang="ts">
import { io, Socket } from 'socket.io-client'
import { computed, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import ExcelJS from 'exceljs'

const router = useRouter()

let socket: Socket

let vins: Ref<string[]> = ref([])
let nextVin: Ref<string> = ref('')
let results: Ref<
  {
    vin: string
    exist: number
    autodoc: number
  }[]
> = ref([])
let isEmpty = computed(() => results.value.length === 0)
let isFinished: Ref<boolean> = ref(false)

onMounted(async () => {
  if (!localStorage.getItem('token')) {
    await router.push('/login')
  }

  socket = io()
  socket.on('result', (el: { vin: string; exist: number; autodoc: number }) => {
    results.value.push(el)
  })

  socket.on('end-parse', () => {
    isFinished.value = true
    alert('Парсинг завершен')
  })
})

const add = () => {
  vins.value.push(nextVin.value)
  nextVin.value = ''
}

const start = () => {
  socket.emit('parse', vins.value)
}

const exportExcel = async () => {
  const workbook = new ExcelJS.Workbook()

  const sheet = workbook.addWorksheet('Main')
  const vinCell = sheet.getCell('A1')
  vinCell.value = 'VIN'
  const existCell = sheet.getCell('B1')
  existCell.value = 'Exist цена'
  const autodocCell = sheet.getCell('C1')
  autodocCell.value = 'Autodoc цена'
  for (let i = 0; i < results.value.length; i++) {
    const v = sheet.getCell(`A${i + 2}`)
    const e = sheet.getCell(`B${i + 2}`)
    const a = sheet.getCell(`C${i + 2}`)
    v.value = results.value[i]!.vin
    e.value = results.value[i]!.exist
    a.value = results.value[i]!.autodoc
  }

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'result.xlsx'
  link.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <main>
    <div class="parser-container">
      <h1>Парсинг артикулов</h1>
      <h3 v-for="vin in vins">{{ vin }}</h3>
      <input type="text" v-model="nextVin" placeholder="Добавить вин" />
      <button @click="add">Добавить</button>
    </div>
    <button @click="start">Начапть парсинг</button>
    <div class="results" v-if="!isEmpty">
      <h3>Результаты</h3>
      <ol>
        <li v-for="el in results">
          <h4>VIN: {{ el.vin }}</h4>
          <h4>Цена на экзист: {{ el.exist }}</h4>
          <h4>Цена на автодок: {{ el.autodoc }}</h4>
        </li>
      </ol>
      <h3 v-if="!isFinished">Идет парсинг...</h3>
      <button v-else @click="exportExcel">Экспортировать в эксель</button>
    </div>
  </main>
</template>
<style scoped>
main {
  background-color: #f3f4f6;
  min-height: 100vh;
  width: 100%;
  padding: 3rem 2rem;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #111827;
}

.parser-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

h1 {
  margin: 0 0 2rem;
  font-size: 2rem;
}

h3 {
  margin: 0.75rem 0;
}

.vin-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.vin-item {
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
}

.add-vin {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

input {
  flex: 1;
  outline: none;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  border-radius: 10px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

button {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: #3b82f6;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

button:hover {
  transform: translateY(-1px);
  background-color: #2563eb;
}

.button-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.button-secondary:hover {
  background-color: #d1d5db;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.results {
  margin-top: 2rem;
}

.results-list {
  padding-left: 1.5rem;
}

.result-card {
  margin-bottom: 1rem;
  padding: 1rem 1.25rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.result-card h4 {
  margin: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.parsing {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #eff6ff;
  border-radius: 10px;
  color: #1d4ed8;
  font-weight: 600;
}

.export {
  margin-top: 1.5rem;
  background-color: #10b981;
}

.export:hover {
  background-color: #059669;
}
</style>
