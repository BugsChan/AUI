<script setup>
import auiMain from "./components/aui-main.vue";
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>AUI框架测试页面</h1>
      <p>这是一个用于测试AUI框架的示例页面</p>
    </header>
    
    <main class="app-main">
      <section class="app-section">
        <h2>测试说明</h2>
        <ul>
          <li>页面右下角（PC端）或底部中央（移动端）有一个AI助手图标</li>
          <li>点击图标可以打开AI助手窗口，与AI进行交互</li>
          <li>尝试输入一些内容，AI会随机生成功能卡片</li>
          <li>卡片会有2-4秒的等待过程，模拟真实的AI响应</li>
          <li>卡片支持多种类型，包括输入框、按钮和行程规划等</li>
        </ul>
      </section>
      
      <section class="app-section">
        <h2>测试功能</h2>
        <div class="feature-grid">
          <div class="feature-item">
            <h3>📱 响应式设计</h3>
            <p>适配PC端和移动端不同的布局需求</p>
          </div>
          <div class="feature-item">
            <h3>🗣️ 语音输入</h3>
            <p>支持语音和文字两种输入方式</p>
          </div>
          <div class="feature-item">
            <h3>🎯 智能卡片</h3>
            <p>根据用户需求生成相应的功能卡片</p>
          </div>
          <div class="feature-item">
            <h3>⚙️ 高度可配置</h3>
            <p>支持多种配置选项，满足不同需求</p>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2026 AUI框架测试页面</p>
    </footer>
    
    <!-- AUI组件 -->
    <aui-main :options="auiOptions"></aui-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auiOptions: {
        icon: {
          path: "",//'./components/asserts/logo.svg',
          width: 32,
          height: 32,
          position: 'bottom-right',
          description: '打开AI提示 测试'
        },
        window: {
          width: 300,
          height: 400,
          position: 'bottom-left',
          description: 'AI提示窗口',
          placeholder: '请输入您的问题...'
        },
        description: "这是一个AUI框架的测试页面，用于演示AI助手的功能",
        methods: {
          sendMsg: {
            description: "发送消息功能，用于向指定用户发送消息",
            method: function(id, msg) {
              console.log('sendMsg', id, msg);
              alert('发送消息成功：\n用户ID：' + id + '\n消息内容：' + msg);
            },
            params: [
              {
                name: 'id',
                type: 'string',
				        hidden: true,
                description: '接收消息的用户ID'
              },
              {
                name: 'msg',
                type: 'string',
                description: '要发送的消息内容'
              }
            ],
            ui: function() {
              return {
                type: 'input',
                cardImg: null,
                attention: "请确认发送消息"
              }
            }
          },
          drawSth: {
            description: "绘制内容功能，用于在页面中绘制SVG内容",
            method: function(svg) {
              console.log('drawSth', svg);
              alert('绘制内容成功：\nSVG：' + svg);
            },
            params: [
              {
                name: 'svg',
                type: 'string',
                description: '要绘制的SVG内容'
              }
            ],
            ui: function() {
              return {
                type: 'button',
                cardImg: "$svg",
                attention: "请确认绘制内容"
              }
            }
          },
          jumpToPage: {
            description: "跳转到指定页面",
            method: "https://www.example.com",
            ui: function() {
              return {
                type: 'button',
                cardImg: null,
                attention: "请确认跳转页面"
              }
            }
          },
          takeATaxi: {
            description: "叫出租车功能，用于预约出租车服务",
            method: function(start, end) {
              console.log('takeATaxi', start, end);
              alert('叫出租车成功：\n起始位置：' + start + '\n目的地：' + end);
            },
            params: [
              {
                name: 'start',
                type: 'string',
                description: '起始位置'
              },
              {
                name: 'end',
                type: 'string',
                description: '目的地'
              }
            ],
            ui: function() {
              return {
                type: 'journey',
                start: 'start',
                end: 'end',
                attention: "请确认叫出租车"
              }
            }
          }
        }
      }
    };
  }
};
</script>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.app-header p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.app-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.app-section h2 {
  color: #667eea;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.app-section ul {
  list-style-type: none;
  padding: 0;
}

.app-section li {
  padding: 0.5rem 0;
  padding-left: 2rem;
  position: relative;
}

.app-section li::before {
  content: "✓";
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  color: #667eea;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.feature-item p {
  margin: 0;
  color: #666;
}

.app-footer {
  background: #f8f9fa;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
  color: #666;
  border-top: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
  
  .app-section {
    padding: 1.5rem;
  }
  
  .app-section h2 {
    font-size: 1.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
