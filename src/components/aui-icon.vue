<template>
  <div 
    class="aui-icon-container" 
    :class="iconPosition" 
    @click="handleClick"
    :style="{
      '--icon-width': `${iconConfig.width || 32}px`,
      '--icon-height': `${iconConfig.height || 32}px`
    }"
  >
    <img 
      v-if="iconConfig.path" 
      :src="iconConfig.path" 
      :alt="iconConfig.description || 'AI Assistant'"
      :style="{
        width: `${iconConfig.width || 32}px`,
        height: `${iconConfig.height || 32}px`
      }"
      class="aui-icon-img"
    />
    <div v-else class="aui-icon-default" 
	:style="{
        width: `${iconConfig.width || 32}px`,
        height: `${iconConfig.height || 32}px`
    }">
      AI
    </div>
    <div v-if="iconConfig.description" class="aui-icon-tooltip">
      {{ iconConfig.description }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  iconConfig: {
    type: Object,
    default: () => ({
      path: '',
      width: 32,
      height: 32,
      position: 'bottom-right',
      description: ''
    })
  }
});

const emit = defineEmits(['click']);

// 响应式位置计算
const iconPosition = computed(() => {
  // 检测是否为移动设备
  const isMobile = window.innerWidth <= 768;
  
  // 默认位置配置
  let position = props.iconConfig.position || 'bottom-right';
  
  // 移动端特殊处理
  if (isMobile) {
    // 移动端默认底部居中
    position = props.iconConfig.position || 'bottom-center';
  }
  
  return `aui-icon-${position}`;
});

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.aui-icon-container {
  position: fixed;
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 图标位置样式 */
.aui-icon-top-left {
  top: 20px;
  left: 20px;
}

.aui-icon-top-right {
  top: 20px;
  right: 20px;
}

.aui-icon-bottom-left {
  bottom: 20px;
  left: 20px;
}

.aui-icon-bottom-right {
  bottom: 20px;
  right: 20px;
}

.aui-icon-bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

/* 图标样式 */
.aui-icon-img {
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.aui-icon-default {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.aui-icon-container:hover .aui-icon-img,
.aui-icon-container:hover .aui-icon-default {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 提示文本 */
.aui-icon-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.aui-icon-container:hover .aui-icon-tooltip {
  opacity: 1;
}

/* 移动端特殊样式 */
@media (max-width: 768px) {
  .aui-icon-container {
    bottom: 20px !important;
  }
  
  .aui-icon-bottom-center {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
  
  /* 增大移动端icon大小 */
  .aui-icon-img {
    width: calc(var(--icon-width, 32px) * 1.5) !important;
    height: calc(var(--icon-height, 32px) * 1.5) !important;
  }
  
  .aui-icon-default {
    width: calc(var(--icon-width, 32px) * 1.5) !important;
    height: calc(var(--icon-height, 32px) * 1.5) !important;
    font-size: calc(16px * 1.5) !important;
  }
}
</style>