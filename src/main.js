import { createApp } from 'vue';
import AuiMain from './components/aui-main.vue';
import App from './App.vue';

// 导出组件
export { AuiMain };

// 创建AUI类
class AUI {
  constructor(options = {}) {
    this.options = options;
    this.app = null;
    this.mount();
  }

  mount() {
    // 创建一个div元素作为挂载点
    const container = document.createElement('div');
    container.id = 'aui-container';
    document.body.appendChild(container);

    // 创建Vue应用并挂载
    this.app = createApp(AuiMain, {
      options: this.options
    });
    this.app.mount('#aui-container');
  }

  // 提供一些公共方法
  show() {
    this.app && this.app.config.globalProperties.$emit('show');
  }

  hide() {
    this.app && this.app.config.globalProperties.$emit('hide');
  }
}

// 导出AUI类，支持UMD和ES模块
export default AUI;

// 对于直接在浏览器中使用的情况
if (typeof window !== 'undefined') {
  window.AUI = AUI;
  // 导出组件到全局作用域，以便可以直接使用
  window.AUI.AuiMain = AuiMain;
}

// 初始化应用
if (import.meta.env.DEV) {
  // 开发环境：挂载完整的App组件
  createApp(App).mount('#app');
}
