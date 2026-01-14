// LLM API 交互模块

// 服务器地址配置
const LLM_SERVER_BASE_URL = 'http://localhost:8080';
const LLM_LOADER_PATH = '/loader.html';
const LLM_SERVER_URL = `${LLM_SERVER_BASE_URL}${LLM_LOADER_PATH}`;



/**
 * 
 * @param {string} message 用户询问大模型的问题
 * @param {object} options 选项对象，即开发者传入的描述和可用方法的json
 * @returns 
 */
export const getLLMReply = async (message, options) => {
  try {
    console.log(options);
    const reply = await requestLLM(message, options);
    return reply;
  } catch (error) {
    console.error('LLM API error:', error);
    return "Error: please retry later.";
  }
};
/**
 * 生成llm所需的上下文信息
 * @param {*} options 选项对象，即开发者传入的描述和可用方法的json
 * @returns 上下文信息 string 形式
 */
const createContext = (options) => {

  let methodsInfo = {};
  for(let method in options.methods){
    methodsInfo[method] = {};
    methodsInfo[method].description = options.methods[method].description;
    methodsInfo[method].params = options.methods[method].params;
  }
  let baseInfo = `
  你是一个只输出 JSON 的 API 接口，不要输出任何解释性文字,
  严禁使用 ${"```"} 代码块包裹，严禁在 JSON 前后添加任何问候语.
  该网站的介绍为${options.introduction};
  可供选择的方法为 ${JSON.stringify(methodsInfo)}
  你输出的json格式为：
  {
    "type": "method", // 可以是 method 或 text
    "method": "方法名", //当type为method时，必填
    "arguments": { //参数名和参数值, 该方法有参数时必填
      "参数名": "参数值"
    },
    "text": "普通文本回复" //当type为text时，必填
  }
  你可以根据用户的问题和上下文信息，选择合适的方法或直接回复文本,但回复文本也必须符合json格式
  `;

  return baseInfo;
}

const requestLLM = async (message, options) => {
  return new Promise((resolve, reject) => {
    console.log('开始创建 iframe 请求');
    
    // 创建一个没有大小的 iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // 隐藏 iframe
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.src = LLM_SERVER_URL; // 指向指定的页面

    // 消息监听器
    const messageHandler = (event) => {
      // 验证消息来源，确保安全性
      if (event.origin !== LLM_SERVER_BASE_URL) {
        console.log('消息来源不匹配，忽略:', event.origin);
        return;
      }

      // 处理来自 iframe 的响应
      const data = event.data;
      if (data.type === 'response') {
        console.log('收到响应:', data);
        // 移除事件监听器和 iframe
        window.removeEventListener('message', messageHandler);
        document.body.removeChild(iframe);
        
        if (data.success) {
          resolve(data.content);
        } else {
          reject(new Error(data.content || 'Request failed'));
        }
      }
    };

    // 添加事件监听器
    window.addEventListener('message', messageHandler);

    // 处理 iframe 加载状态
    iframe.onload = () => {
      
      try {
        // 去除 options 中的所有函数属性，但保留原数据结构
        const context = createContext(options);
        
        
        // 发送消息
        iframe.contentWindow.postMessage({
          type: 'request',
          message: message,
          options: context,
          passKey: options.passKey
        }, LLM_SERVER_BASE_URL);
        
      } catch (error) {
        reject(error);
        // 清理资源
        window.removeEventListener('message', messageHandler);
        document.body.removeChild(iframe);
      }
    };

    // iframe 加载错误处理
    iframe.onerror = (error) => {
      reject(new Error('iframe loading failed'));
      window.removeEventListener('message', messageHandler);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };

    // 将 iframe 添加到 DOM 中
    document.body.appendChild(iframe);

    // 确认 iframe 是否成功添加到 DOM
    if (!document.body.contains(iframe)) {
      console.error('iframe 未能成功添加到 DOM');
      reject(new Error('Failed to append iframe to DOM'));
    }

    // 设置超时机制，防止无限等待
    const timeout = setTimeout(() => {
      console.log('请求超时');
      window.removeEventListener('message', messageHandler);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      reject(new Error('Request timeout'));
    }, 30000); // 30秒超时
  });
};