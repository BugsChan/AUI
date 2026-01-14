<template>
  <div class="aui-card" :class="uiConfig.type">
    <!-- 顶部提示词 - 左上角 -->
    <div class="aui-card-attention">
      {{ uiConfig.attention || '请确认操作' }}
    </div>
    
    <!-- 中间图片 - 带默认样式 -->
    <div class="aui-card-image-container">
      <!-- SVG内容 -->
      <div 
        v-if="isSvg" 
        class="aui-card-svg"
        v-html="cardImage"
      ></div>
      <!-- 图片URL -->
      <img 
        v-else-if="cardImage" 
        :src="cardImage" 
        alt="Card Image" 
        class="aui-card-image"
      />
      <!-- 占位符 -->
      <div v-else class="aui-card-image-placeholder">
        <div class="aui-placeholder-icon">📷</div>
        <div class="aui-placeholder-text">暂无图片</div>
      </div>
    </div>
    
    <!-- 下方输入框（根据类型） -->
    <div class="aui-card-inputs">
      <!-- input类型：根据params生成输入框 -->
      <template v-if="uiConfig.type === 'input'">
        <div 
          v-for="(param, index) in cardConfig.params.filter(parm => !parm.hidden)"
          :key="index"
          class="aui-input-group"
        >
          <label :for="'param-' + index" class="aui-input-label">
            {{ param.description }}
          </label>
          <input 
            :id="'param-' + index"
            type="text" 
            class="aui-card-input"
            v-model="paramValues[param.name]"
            :placeholder="'请输入' + param.name"
          />
        </div>
      </template>
      
      <!-- journey类型：起始和结束位置输入框 -->
      <div v-else-if="uiConfig.type === 'journey'" class="aui-journey-inputs">
        <div class="aui-input-group">
          <label class="aui-input-label">起始位置</label>
          <input 
            type="text" 
            class="aui-card-input"
            v-model="paramValues[uiConfig.start || 'start']"
            placeholder="请输入起始位置"
          />
        </div>
        <div class="aui-journey-arrow">↓</div>
        <div class="aui-input-group">
          <label class="aui-input-label">目的地</label>
          <input 
            type="text" 
            class="aui-card-input"
            v-model="paramValues[uiConfig.end || 'end']"
            placeholder="请输入目的地"
          />
        </div>
      </div>
    </div>
    
    <!-- 最后确认按钮 - 右下角，更小尺寸 -->
    <div class="aui-card-actions">
      <button class="aui-card-confirm" @click="handleConfirm">
        确定
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  cardConfig: {
    type: Object,
    required: true,
    default: () => ({
      description: '',
      method: null,
      params: [],
      ui: {
        type: 'button',
        cardImg: null,
        attention: ''
      }
    })
  }
});

const emit = defineEmits(['confirm']);

// 参数值存储
const paramValues = ref({});

// 计算实际的UI配置（处理ui是函数的情况）
const uiConfig = computed(() => {
  const ui = props.cardConfig.ui;
  // 如果ui是函数，调用它获取实际的UI配置
  if (typeof ui === 'function') {
    return ui();
  }
  // 否则直接使用ui对象
  return ui || {
    type: 'button',
    cardImg: null,
    attention: ''
  };
});

// 初始化参数值
watch(() => props.cardConfig, (newConfig) => {
  if (newConfig.params) {
    const initialValues = {};
    // 获取预定义的参数值（如果存在）
    const predefinedParams = newConfig._params || {};
    
    newConfig.params.forEach(param => {
      // 如果预定义参数中存在该参数，使用预定义值；否则使用空字符串
      initialValues[param.name] = predefinedParams[param.name] !== undefined 
        ? predefinedParams[param.name] 
        : '';
    });
    paramValues.value = initialValues;
  }
}, { immediate: true, deep: true });

// 判断是否是SVG内容
const isSvgContent = (content) => {
  return typeof content === 'string' && (
    content.trim().startsWith('<svg') || 
    content.trim().startsWith('data:image/svg+xml')
  );
};

// 计算卡片图片
const cardImage = computed(() => {
  const cardImg = uiConfig.value.cardImg;
  if (!cardImg) return null;
  
  // 处理$开头的参数引用
  if (cardImg.startsWith('$')) {
    const paramName = cardImg.slice(1);
    return paramValues.value[paramName] || null;
  }
  
  return cardImg;
});

// 计算是否为SVG内容
const isSvg = computed(() => {
  const img = cardImage.value;
  return img ? isSvgContent(img) : false;
});

// 处理确认按钮点击
const handleConfirm = () => {
  // 收集参数值
  const params = [];
  console.log(props.cardConfig);
  
  // 根据ui类型处理参数
  if (uiConfig.value.type === 'journey') {
    // journey类型：收集start和end参数
    const startParam = uiConfig.value.start || 'start';
    const endParam = uiConfig.value.end || 'end';
    params.push(paramValues.value[startParam], paramValues.value[endParam]);
  } else if (props.cardConfig.params) {
    // 其他类型：按params顺序收集
    props.cardConfig.params.forEach(param => {
      params.push(paramValues.value[param.name]);
    });
  }
  
  // 发送确认事件
  emit('confirm', {
    method: props.cardConfig.method,
    params: params,
    paramValues: paramValues.value
  });
};
</script>

<style scoped>
.aui-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

/* 顶部提示词 - 左上角 */
.aui-card-attention {
  font-size: 14px;
  color: #666;
  text-align: left;
  margin-bottom: 4px;
  font-weight: 500;
}

/* 中间图片 - 带默认样式 */
.aui-card-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 0;
  min-height: 80px;
  background-color: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
  border: 1px dashed #dee2e6;
}

.aui-card-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.aui-card-svg {
  max-width: 100%;
  max-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* 确保SVG能够正确缩放 */
  svg {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
}

/* 图片占位样式 */
.aui-card-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #adb5bd;
}

.aui-placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.aui-placeholder-text {
  font-size: 14px;
}

/* 下方输入框 */
.aui-card-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 4px 0;
}

/* 输入组样式 */
.aui-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aui-input-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.aui-card-input {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.aui-card-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* journey类型特殊样式 */
.aui-journey-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.aui-journey-arrow {
  text-align: center;
  font-size: 20px;
  color: #667eea;
  margin: 4px 0;
}

/* 按钮容器 - 右下角 */
.aui-card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

/* 最后确认按钮 - 变小靠右 */
.aui-card-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 60px;
}

.aui-card-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.aui-card-confirm:active {
  transform: translateY(0);
}
</style>