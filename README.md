# AUI - AI 智能交互插件

AUI（AI User Interface）是一个基于 Vue 3 的智能交互插件，专为与 LLM（大语言模型）进行交互而设计。它提供了直观的卡片式界面，支持多种交互类型，并通过 iframe 通信实现安全的跨域数据传输。

## 功能特性

### 核心功能
- 🏠 **智能卡片系统**：支持多种类型的交互卡片（按钮、输入框、行程规划等）
- 💬 **LLM 通信**：通过 iframe 和 postMessage 实现与 LLM 的安全通信
- 📊 **参数管理**：支持参数预定义、动态填充和验证
- 🎨 **自定义 UI**：灵活的卡片样式和配置选项
- 📱 **响应式设计**：适配不同屏幕尺寸和设备

### 交互类型
- **Button 类型**：简单的确认按钮
- **Input 类型**：支持多个参数的输入表单
- **Journey 类型**：行程规划，包含起始和结束位置输入

### 高级功能
- 支持 SVG 图片显示
- 自定义卡片图片和提示词
- 参数预填充功能
- 卡片方法调用参数传递

## 快速开始

### 项目设置
```sh
# 克隆项目
git clone <repository-url>
cd AUI

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 架构设计

### 项目结构
```
src/
├── api/
│   └── llm-api.js          # LLM API 通信层
├── components/
│   ├── aui-main.vue        # 主组件
│   ├── aui-win.vue         # 卡片窗口组件
│   └── aui-card.vue        # 卡片组件
├── App.vue                 # 根组件
└── main.js                 # 应用入口
```

### 核心组件

#### AUI-Main 组件
- 主应用组件，负责整体布局和状态管理
- 处理 LLM 响应和消息通信
- 管理卡片窗口的创建和销毁

#### AUI-Win 组件
- 卡片窗口容器，负责显示单个卡片
- 管理卡片的生命周期
- 提供卡片回复方法 `replyCard`

#### AUI-Card 组件
- 具体的卡片实现，支持多种类型
- 处理用户输入和确认事件
- 支持 SVG 和图片显示

## 使用指南

### 基础使用

1. 在你的项目中引入 AUI 插件
2. 配置 LLM 服务器地址
3. 使用 `requestLLM` 方法发送请求
4. 处理卡片回复事件

### 卡片配置

#### 简单按钮卡片
```javascript
{
  description: "确认操作",
  method: "confirmAction",
  params: [],
  ui: {
    type: "button",
    cardImg: "<svg>...</svg>", // 支持 SVG 或图片 URL
    attention: "请确认您的操作"
  }
}
```

#### 输入框卡片
```javascript
{
  description: "用户信息填写",
  method: "submitForm",
  params: [
    {
      name: "username",
      description: "用户名"
    },
    {
      name: "email",
      description: "邮箱"
    }
  ],
  ui: {
    type: "input",
    cardImg: "https://example.com/avatar.png",
    attention: "请填写以下信息"
  }
}
```

#### 行程规划卡片
```javascript
{
  description: "路线规划",
  method: "planRoute",
  params: [],
  ui: {
    type: "journey",
    start: "startLocation",
    end: "endLocation",
    cardImg: "https://example.com/map.svg",
    attention: "请输入起始和终点位置"
  }
}
```

## API 文档

### requestLLM 方法
```javascript
import { requestLLM } from './api/llm-api';

// 发送请求到 LLM
const response = await requestLLM(message, options);
```

#### 参数
- `message`：发送给 LLM 的消息内容
- `options`：请求选项，包括参数和配置

#### 返回值
Promise，解析为 LLM 的响应数据

### handleMessage 方法
处理从 LLM 接收到的消息
```javascript
const handleMessage = (event) => {
  // 处理 LLM 响应
  if (event.data.type === 'card') {
    // 显示卡片
    winRef.value.replyCard(event.data.data);
  }
};
```

### replyCard 方法
在卡片窗口中显示卡片
```javascript
winRef.value.replyCard(cardData, params);
```

#### 参数
- `cardData`：卡片配置数据
- `params`：预定义的参数值（可选）

## 通信机制

### 与 LLM 通信
AUI 使用 iframe 和 postMessage 实现与 LLM 服务器的安全通信：
1. 创建隐藏的 iframe，指向 LLM 服务器的加载页面
2. 通过 postMessage 发送消息
3. 监听 LLM 服务器的响应
4. 显示相应的交互卡片

### 参数传递
卡片的参数可以通过以下方式传递：
1. 预定义参数：在创建卡片时传递
2. 用户输入：卡片显示后用户输入
3. 参数引用：支持通过 `$` 符号引用其他参数值

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开发说明

### 开发流程
1. 克隆项目
2. 安装依赖
3. 启动开发服务器
4. 修改代码并实时预览
5. 运行测试
6. 提交代码

### 调试方法
1. 使用 Vue DevTools 调试 Vue 组件
2. 在浏览器控制台查看日志
3. 检查网络请求和响应

## 常见问题

### 1. 跨域请求问题
使用 iframe 通信机制避免了直接的跨域请求问题。

### 2. 卡片不显示
检查 LLM 响应是否包含有效的卡片配置数据。

### 3. 参数未传递
确保参数名称与卡片配置中的参数名称匹配。

## 许可证

MIT License

## 联系方式

如果您有任何问题或建议，请通过以下方式联系我们：

- 邮箱：support@example.com
- 仓库：https://github.com/your-repo/aui
- 文档：https://docs.example.com/aui
