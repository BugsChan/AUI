<template :replyMsg="replyMessage" :replyCard="replyCard">
  <div 
    v-if="visible" 
    class="aui-window-container" 
    :class="{ 'aui-window-mobile': isMobile }"
    :style="windowStyle"
    ref="windowRef"
  >
    <!-- PC端拖拽手柄 -->
    <div 
      v-if="!isMobile" 
      class="aui-window-header" 
      @mousedown="startDrag"
    >
      <div class="aui-window-title">{{ windowConfig.description || 'AI Assistant' }}</div>
      <button class="aui-window-close" @click="handleClose">&times;</button>
    </div>
    
    <!-- 移动端头部 -->
    <div v-else class="aui-window-header-mobile">
      <div class="aui-window-title">{{ windowConfig.description || 'AI Assistant' }}</div>
      <button class="aui-window-close" @click="handleClose">&times;</button>
    </div>
    
    <!-- 消息内容区 -->
    <div class="aui-window-content" ref="contentRef">
      <!-- 消息历史 -->
      <div class="aui-messages">
        <!-- 系统消息 -->
        <div class="aui-message system">
          <div class="aui-message-content">
            你好！我是AI助手，有什么可以帮助你的吗？
          </div>
        </div>
        
        <!-- 统一渲染消息和卡片 -->
        <template v-for="(item, index) in items" :key="index">
          <!-- 文字消息 -->
          <div 
            v-if="item.type === 'message'" 
            class="aui-message" 
            :class="item.sender"
          >
            <div class="aui-message-content">
              {{ item.content }}
            </div>
          </div>
          
          <!-- 卡片消息 -->
          <div v-else-if="item.type === 'card'">
            <!-- 直接渲染aui-card组件，去掉额外容器 -->
            <slot name="card" :card="item.data" :onConfirm="handleCardConfirm"></slot>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="aui-window-input-container">
      <div class="aui-input-wrapper">
        <!-- 语音输入按钮 -->
        <button class="aui-voice-btn" @click="toggleVoice">
          {{ isVoiceActive ? '🔴' : '🎤' }}
        </button>
        
        <!-- 文字输入框 -->
        <input 
          type="text" 
          class="aui-input" 
          :placeholder="windowConfig.placeholder || '请输入您的问题...'"
          v-model="inputValue"
          @keyup.enter="sendMessage"
        />
        
        <!-- 发送按钮 -->
        <button class="aui-send-btn" @click="sendMessage">
          ➤
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  windowConfig: {
    type: Object,
    default: () => ({
      width: 300,
      height: 400,
      position: 'bottom-right',
      description: '',
      placeholder: ''
    })
  }
});

const emit = defineEmits(['close', 'send-message']);

// 响应式数据
const windowRef = ref(null);
const contentRef = ref(null);
const isMobile = ref(false);
const inputValue = ref('');
const isVoiceActive = ref(false);
const items = ref([]); // 合并消息和卡片的统一数组

// 拖拽相关
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const windowPosition = ref({ x: 0, y: 0 });

// 检测设备类型
onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
  window.addEventListener('mousemove', handleDrag);
  window.addEventListener('mouseup', stopDrag);
});

// 检测设备类型
const checkDeviceType = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    // 移动端重置位置到底部
    windowPosition.value = { x: 0, y: 0 };
  } else {
    // PC端默认位置
    windowPosition.value = {
      x: window.innerWidth - (props.windowConfig.width || 300) - 40,
      y: window.innerHeight - (props.windowConfig.height || 400) - 100
    };
  }
};

// 窗口样式计算
const windowStyle = computed(() => {
  const style = {};
  
  if (!isMobile.value) {
    // PC端样式
    style.width = `${props.windowConfig.width || 300}px`;
    style.height = `${props.windowConfig.height || 400}px`;
    style.left = `${windowPosition.value.x}px`;
    style.top = `${windowPosition.value.y}px`;
  } else {
    // 移动端样式
    style.width = '100%';
    style.height = '300px';
  }
  
  return style;
});

// 拖拽功能
const startDrag = (e) => {
  if (isMobile.value) return;
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - windowPosition.value.x,
    y: e.clientY - windowPosition.value.y
  };
};

const handleDrag = (e) => {
  if (!isDragging.value || isMobile.value) return;
  windowPosition.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  };
};

const stopDrag = () => {
  isDragging.value = false;
};

// 关闭窗口
const handleClose = () => {
  emit('close');
};

const replyMessage = (msg) => {
	// 普通文本回复，添加到统一数组
	items.value.push({
	  type: 'message',
	  sender: 'ai',
	  content: msg
	});
	scrollToBottom();
};

const replyCard = (cardData) => {
	items.value.push({
	  type: 'card',
	  data: cardData
	});
	scrollToBottom();
};

// 发送消息
const sendMessage = () => {
  if (!inputValue.value.trim()) return;
  
  // 添加用户消息到统一数组
  items.value.push({
    type: 'message',
    sender: 'user',
    content: inputValue.value
  });
  
  // 清空输入框
  const message = inputValue.value;
  inputValue.value = '';
  
  // 滚动到底部
  scrollToBottom();
  
  // 发送消息事件
  emit('send-message', message);
};

// 切换语音输入
const toggleVoice = () => {
  isVoiceActive.value = !isVoiceActive.value;
  // 这里可以添加语音输入逻辑
};

// 处理卡片确认
const handleCardConfirm = (cardData) => {
  // 处理卡片确认事件
  console.log('Card confirmed:', cardData);
};

// 滚动到底部
const scrollToBottom = () => {
  if (contentRef.value) {
    contentRef.value.scrollTop = contentRef.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动到底部
watch(items, () => {
  scrollToBottom();
});

// 暴露方法给父组件
defineExpose({
  replyMessage,
  replyCard
});
</script>

<style scoped>
.aui-window-container {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;
}

/* PC端样式 */
.aui-window-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
}

.aui-window-title {
  font-size: 14px;
  font-weight: bold;
}

.aui-window-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.aui-window-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 移动端样式 */
.aui-window-mobile {
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  border-radius: 16px 16px 0 0 !important;
  height: calc(100vh / 3) !important;
  min-height: 400px !important;
  max-height: 600px !important;
  transform: none !important;
  box-sizing: border-box !important;
}
/* 移动端头部 */
.aui-window-header-mobile {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
}

/* 内容区域 */
.aui-window-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f8f9fa;
}

/* 消息样式 */
.aui-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.aui-message {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  margin-bottom: 10px;
}

.aui-message.system {
  align-self: center;
  background-color: #e9ecef;
  color: #495057;
  font-size: 12px;
}

.aui-message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.aui-message.ai {
  align-self: flex-start;
  background-color: white;
  border: 1px solid #e9ecef;
}

/* 缩小消息字体大小 */
.aui-message-content {
  word-wrap: break-word;
  font-size: 14px; /* 调整为更小的字体 */
}

/* 卡片样式简化 - 去掉多余的容器样式 */
.aui-card-container {
  margin: 10px 0;
  background-color: transparent;
  padding: 0;
  box-shadow: none;
  border-radius: 0;
}

/* 卡片包装器样式 */
.aui-card-wrapper {
  margin: 10px 0;
}

/* 输入区域 */
.aui-window-input-container {
  padding: 10px;
  background-color: white;
  border-top: 1px solid #e9ecef;
}

.aui-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f8f9fa;
  padding: 6px 12px;
  border-radius: 18px;
}

.aui-voice-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.aui-voice-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.aui-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  padding: 6px 0;
  margin: 0 6px;
}

.aui-send-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.aui-send-btn:hover {
  transform: scale(1.1);
}

/* 卡片容器 */
.aui-card-container {
  margin: 10px 0;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 滚动条样式 */
.aui-window-content::-webkit-scrollbar {
  width: 6px;
}

.aui-window-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.aui-window-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.aui-window-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>