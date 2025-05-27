<template>
  <div class="app-container">
    <h2 class="title">智能图表系统</h2>
    <ChatDialog />
  </div>
</template>

<script setup>
import ChatDialog from './components/ChatDialog.vue'
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}
</style>