import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }
  // Use DeepSeek API endpoint
  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
    maxRetries: 2,
    timeout: 30000, // 30秒超时
  });
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function* streamChatResponse(
  messages: ChatMessage[],
  model: string = "deepseek-chat",
  temperature: number = 0.7
): AsyncGenerator<string, void, unknown> {
  const systemMessage: ChatMessage = {
    role: "system",
    content:
      "你是自调酒知识助手，专门帮助用户学习和实践调酒。你的回答应该包含原理解释、详细步骤、注意事项和酒精安全提示。使用清晰的结构和友好的语气。",
  };

  const chatMessages = [systemMessage, ...messages];

  try {
    const openai = getOpenAIClient();
    console.log("Calling OpenAI API with model:", model);
    
    const stream = await openai.chat.completions.create({
      model,
      messages: chatMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      stream: true,
    });

    let totalChunks = 0;
    for await (const chunk of stream) {
      totalChunks++;
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
    console.log(`OpenAI stream completed, received ${totalChunks} chunks`);
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);
    
    const errorObj = error as {
      name?: string;
      message?: string;
      code?: string;
      status?: number;
      type?: string;
    };
    
    console.error("Error details:", {
      name: errorObj?.name,
      message: errorObj?.message,
      code: errorObj?.code,
      status: errorObj?.status,
      type: errorObj?.type,
    });
    
    // Provide more detailed error messages
    if (errorObj?.name === "AbortError" || errorObj?.message?.includes("timeout")) {
      throw new Error("请求超时，请检查网络连接或稍后重试");
    } else if (errorObj?.code === "ECONNREFUSED" || errorObj?.code === "ETIMEDOUT" || errorObj?.message?.includes("Connection")) {
      throw new Error("无法连接到DeepSeek服务器，请检查网络连接或稍后重试");
    } else if (errorObj?.status === 401) {
      throw new Error("DeepSeek API密钥无效，请检查.env.local中的OPENAI_API_KEY");
    } else if (errorObj?.status === 402) {
      throw new Error("DeepSeek账户余额不足，请前往 https://platform.deepseek.com 充值后使用");
    } else if (errorObj?.status === 429) {
      throw new Error("API请求频率过高，请稍后再试");
    } else if (errorObj?.status === 500 || errorObj?.status === 502 || errorObj?.status === 503) {
      throw new Error("DeepSeek服务器暂时不可用，请稍后重试");
    } else if (errorObj?.message) {
      throw new Error(`DeepSeek API错误: ${errorObj.message}`);
    } else {
      throw new Error("生成聊天回复失败，请检查网络连接后重试");
    }
  }
}

