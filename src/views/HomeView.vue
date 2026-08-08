<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  if (!localStorage.getItem('token')) {
    await router.push('/login')
  }
})
</script>

<template></template>
