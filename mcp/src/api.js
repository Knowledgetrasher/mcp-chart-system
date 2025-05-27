import axios from 'axios';

const apiKey = '';//替换为实际的 API 密钥
const appId = ''; // 替换为实际的应用 ID

export const callBailianAgent = async (prompt) => {
  try {
    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;

    const data = {
      input: {
        prompt: prompt,
      },
      parameters: {},
      debug: {}
    };

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log(response); // 打印响应内容，便于调试
      return response; // 返回 API 响应内容
       

    } else {
      console.error(`API 调用失败: ${response.status}`);
      console.error(`Response data: ${JSON.stringify(response.data, null, 2)}`);
      throw new Error(`API 调用失败: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error calling DashScope: ${error.message}`);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error; // 将错误抛出，以便调用者处理
  }
};


export const callBailianAgent_again = async (promptall) => {
  try {
    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;

    const data = {
      input: {
        prompt: promptall.prompt,
        session_id: promptall.session_id, // 替换为实际的 session_id,
      },
      parameters: {},
      debug: {}
    };

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log(response); // 打印响应内容，便于调试
      return response; // 返回 API 响应内容
       

    } else {
      console.error(`API 调用失败: ${response.status}`);
      console.error(`Response data: ${JSON.stringify(response.data, null, 2)}`);
      throw new Error(`API 调用失败: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error calling DashScope: ${error.message}`);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error; // 将错误抛出，以便调用者处理
  }
};
