<template>
  <div class="chat-container">
    <!-- 消息列表 -->
    <div class="messages-wrapper">
      <div 
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="[msg.role === 'user' ? 'user-message' : 'assistant-message']"
      >
        {{ msg.content }}
        <template v-if="msg.chartData">
          <img :src="msg.chartData" class="chart-image" alt="AI生成图表">
        </template>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <textarea
        v-model="inputText"
        placeholder="请输入您的问题..."
        @keyup.enter.exact="sendMessage"
      />
      <button @click="sendMessage">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  float: right;
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  margin: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.messages-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.message {
  max-width: 75%;
  padding: 12px 16px;
  margin: 8px 20px;
  border-radius: 18px;
  word-break: break-word;
  background: #f0f4ff;
}

.user-message {
  background: #e8f4ff;
  margin-left: auto;
  margin-right: 20px;
}

.assistant-message {
  background: #ffffff;
  border: 1px solid #eee;
  margin-left: 20px;
  margin-right: auto;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

textarea {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 50px;
  font-family: inherit;
  font-size: 14px;
}

textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

button {
  padding: 10px 15px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3a7bc8;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.input-area button {
  align-self: flex-end;
}
</style>

<script setup>
import { ref } from 'vue'
import { callBailianAgent, callBailianAgent_again } from '../api.js'

const messages = ref([])
const inputText = ref('')
const isLoading = ref(false)
const sessionId = ref(null) 

const sendMessage = async () => {
  if (!inputText.value.trim()) return;
  
  const userMessage = {
    role: 'user',
    content: inputText.value.trim()
  };
  
  messages.value.push(userMessage);
  const tempText = inputText.value;
  inputText.value = '';
  let response = null;
  try {
    isLoading.value = true;
    console.log(sessionId.value);
    if (!sessionId.value) {
      response = await callBailianAgent(tempText)
    }
    else{
      const params = { prompt: tempText }
      if (sessionId.value) params.session_id = sessionId.value
      // 发起请求
      response = await callBailianAgent_again(params)
    }
    const extractImageUrl = (text) => {
      const regex = /!\[.*?\]\((https?:\/\/[^\s]+)\)/;
      const match = text.match(regex);
      return match ? match[1] : null;
    };
    const cleanContent = (text) => {
      return text.replace(/!\[.*?\]\(.*?\)/g, '').trim();
    };
    const rawText = response.data.output.text;
    const imageUrl = extractImageUrl(rawText);  // 提取图片链接
    const cleanText = cleanContent(rawText);    // 获得纯净文本
    // 如果有返回新 sessionId 可在此更新（根据实际 API 响应）
    if (response.data.output.session_id) sessionId.value = response.data.output.session_id
    console.log(response.data.output.session_id);
    console.log(response.data.output.text);
    messages.value.push({
      role: 'assistant',
      content: cleanText,// 显示处理后的干净文本
      chartData: imageUrl// 如果有图表数据
    });
  } catch (error) {
    console.error('API调用失败:', error);
    messages.value.push({
      role: 'assistant',
      content: '请求失败，请稍后重试',
      isError: true
    });
  } finally {
    isLoading.value = false;
  }
};
</script>