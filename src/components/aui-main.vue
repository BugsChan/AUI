<template>
  <div class="aui-main-container">
    <!-- AI助手图标 -->
    <aui-icon 
      :icon-config="parsedConfig.icon" 
      @click="toggleWindow"
    />
    
    <!-- AI助手窗口 -->
    <aui-win
      :visible="windowVisible" 
      :window-config="parsedConfig.window"
      @close="hideWindow"
      @send-message="handleMessage"
      ref="winRef"
    >
      <!-- 卡片插槽 -->
      <template #card="{ card, onConfirm }">
        <aui-card 
          :card-config="card" 
          @confirm="(data) => handleCardConfirm(data, onConfirm)"
        />
      </template>
    </aui-win>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import auiIcon from './aui-icon.vue';
import auiWin from './aui-win.vue';
import auiCard from './aui-card.vue';
import { getLLMReply } from '../api/llm-api.js';

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
});

// 响应式数据
const winRef = ref(null);
const windowVisible = ref(false);
const messages = ref([]);

// 解析配置
const parsedConfig = computed(() => {
  return {
    icon: {
      path: props.options.icon?.path || '',
      width: props.options.icon?.width || 32,
      height: props.options.icon?.height || 32,
      position: props.options.icon?.position || 'bottom-right',
      description: props.options.icon?.description || ''
    },
    window: {
      width: props.options.window?.width || 300,
      height: props.options.window?.height || 400,
      position: props.options.window?.position || 'bottom-right',
      description: props.options.window?.description || '',
      placeholder: props.options.window?.placeholder || ''
    },
    description: props.options.description || '',
    methods: props.options.methods || {}
  };
});

// 切换窗口显示/隐藏
const toggleWindow = () => {
  windowVisible.value = !windowVisible.value;
};

// 隐藏窗口
const hideWindow = () => {
  windowVisible.value = false;
};

// 处理消息
const handleMessage = async (message) => {
  console.log('Received message:', message);
  const res = await getLLMReply(message, props.options);
  if (typeof(res) === "object" && winRef.value) {
    // 调用aui-win暴露的replyCard方法
    winRef.value.replyCard(res);
  } else if (winRef.value) {
    // 普通文本回复
    // 调用aui-win暴露的replyMessage方法
    winRef.value.replyMessage(res);
  }
};

// 随机生成卡片
const generateRandomCard = () => {
  // 从parsedConfig.methods中获取卡片配置，确保使用经过计算的配置
  const cardMethods = parsedConfig.value.methods || {};
  const methodKeys = Object.keys(cardMethods);
  console.log(methodKeys);
  
  if (methodKeys.length === 0) {
    // 如果没有配置方法，返回一个默认的卡片配置
    return {
      description: "默认功能",
      method: function() {
        console.log('默认功能执行');
      },
      ui: function() {
        return {
          type: 'button',
          attention: "请确认执行默认功能"
        };
      }
    };
  }
  
  // 随机选择一个方法
  const randomKey = methodKeys[Math.floor(Math.random() * methodKeys.length)];
  const cardConfig = cardMethods[randomKey];
  
  // 确保返回的卡片配置对象包含所有必要的属性
  return {
    description: cardConfig.description || "",
    method: cardConfig.method || function() {
      console.log('默认功能执行');
    },
    params: cardConfig.params || [],
    ui: cardConfig.ui || {
      type: 'button',
      cardImg: null,
      attention: ''
    }
  };
};

// 匹配方法
const matchMethod = (message) => {
  // 简单的关键词匹配，实际项目中可以用NLP
  const methods = Object.values(parsedConfig.value.methods);
  
  // 这里只是简单示例，实际项目中需要更智能的匹配
  for (const method of methods) {
    if (method.description && message.includes(method.description.split('，')[0])) {
      return method;
    }
  }
  
  // 默认返回第一个方法
  return methods[0] || null;
};

// 处理卡片确认
const handleCardConfirm = (cardData, onConfirm) => {
  console.log('Card confirmed:', cardData);
  
  // 执行功能
  executeFunction(cardData);
  
  // 调用窗口的确认处理
  onConfirm && onConfirm(cardData);
};

// 执行功能
const executeFunction = (cardData) => {
  const { method, params } = cardData;
  console.log("cardData:");
  console.log(cardData);
  if (typeof method === 'function') {
    // 执行函数，传递参数
    method(...(params || []));
  } else if (typeof method === 'string' && method.startsWith('http')) {
    // 跳转到URL
    window.location.href = method;
  } else {
    console.error('Invalid method type:', method);
  }
};

onMounted(() => {
  // 初始化时可以做一些准备工作
  console.log('AUI initialized with config:', parsedConfig.value);
});
</script>

<style scoped>
.aui-main-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

/* 确保图标和窗口可以接收点击事件 */
.aui-main-container :deep(.aui-icon-container),
.aui-main-container :deep(.aui-window-container) {
  pointer-events: auto;
}
</style>