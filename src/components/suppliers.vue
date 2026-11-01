<template>
    <div class="suppliers">
        <h2>Наши поставщики</h2>
        <div class="row">
            <div class="card">
                Exist.ru
            </div>
            <div class="card">
                Adeopro.ru
            </div>
            <div class="card">
                Autodoc.ru
            </div>
        </div>
    </div>
</template>
<style scoped>
.suppliers {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    margin-top: 5rem;
}

h2 {
    color: #64748B;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.2;
    letter-spacing: 0.6px;
    text-transform: uppercase;
}

.row {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.5rem;
}

.card {
    padding: 0.5rem 0.3rem;
    border-radius: 4px;
    background-color: white;
    flex-grow: 1;
    font-size: 13px;
    color: #0F172A;
    font-weight: 700;
    font-family: 'Times New Roman', Times, serif;
}
</style>