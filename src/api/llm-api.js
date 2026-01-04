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