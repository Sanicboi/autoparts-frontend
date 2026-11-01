<template>
    <header>
        <img src="/logo.svg" alt="Автолитика">
        <h1>
            <slot></slot>
        </h1>
    </header>
</template>
<style scoped>
header {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    gap: 0.75rem;
    text-align: center;
}

h1 {
    color: #0F172A;
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: -0.5px;
}
</style>