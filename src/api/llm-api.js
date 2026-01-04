// LLM API 交互模块
/**
 * 
 * @param {string} message 用户询问大模型的问题
 * @param {object} options 选项对象，即开发者传入的描述和可用方法的json
 * @returns 
 */
export const getLLMReply = async (message, options) => {
  try {
    console.log(options);
    return "good";
  } catch (error) {
    return "Error: please retry later.";
  }
};
/**
 * 生成llm所需的上下文信息
 * @param {*} options 选项对象，即开发者传入的描述和可用方法的json
 * @returns 上下文信息 string 形式
 */
const createContext = (options) => {
  let baseInfo = `你是一个智能助手，你的任务是根据用户的问题和可用的方法，生成符合要求的卡片或普通文本回复。`;
  return {
    message: options.message,
    methods: options.methods,
  }
}

const requestLLM = async (message, options) => {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    return "Error: please retry later.";
  }
};