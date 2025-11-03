"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/components/Message";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_QUESTIONS = [
  "初学者适合的三款高球配方",
  "家用工具如何替代摇壶",
  "低酒精度自调思路",
];

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("deepseek-chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: messageContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    currentMessageRef.current = "";

    try {
      console.log("Sending chat request:", {
        messageCount: messages.length + 1,
        model,
      });
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model,
          temperature: 0.7,
        }),
      });
      
      console.log("Response status:", response.status, response.statusText);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API error:", response.status, errorData);
        throw new Error(
          `API请求失败 (${response.status}): ${
            errorData || "请检查网络连接"
          }`
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }
      
      console.log("Response reader obtained, starting to read stream...");

      // Create assistant message for streaming
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      let hasReceivedData = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream ended, total content length:", currentMessageRef.current.length);
          break;
        }

        if (value) {
          hasReceivedData = true;
          const chunk = decoder.decode(value, { stream: true });
          console.log("Received chunk:", chunk.substring(0, 50));
          
          // Check for error messages in the stream
          if (chunk.includes("[错误]")) {
            const errorMatch = chunk.match(/\[错误\](.+)/);
            if (errorMatch) {
              throw new Error(errorMatch[1].trim());
            }
          }
          
          currentMessageRef.current += chunk;

          // Update the last message
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                role: "assistant",
                content: currentMessageRef.current,
              };
            }
            return updated;
          });
        }
      }
      
      // Ensure we have content or show a message
      if (!hasReceivedData || !currentMessageRef.current.trim()) {
        throw new Error("未收到回复内容，请检查API配置和网络连接");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "抱歉，发生了错误。请稍后重试。";
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].content === "") {
          updated[updated.length - 1] = {
            role: "assistant",
            content: errorMessage,
          };
        } else {
          updated.push({
            role: "assistant",
            content: errorMessage,
          });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    currentMessageRef.current = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[70vh] border rounded-2xl bg-card shadow-sm overflow-hidden">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <div className="flex items-center gap-4">
          <Label htmlFor="model-select">模型</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model-select" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
              <SelectItem value="deepseek-reasoner">DeepSeek Reasoner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
              <p className="text-lg mb-4">让我们从调一杯酒开始</p>
              <p className="text-sm mb-6">选择一个问题或输入您的问题</p>
              <div className="flex flex-col gap-2 w-full max-w-md">
                {EXAMPLE_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSend(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <Message
              key={index}
              role={message.role}
              content={message.content}
              isStreaming={
                isLoading && index === messages.length - 1 && message.role === "assistant"
              }
            />
          ))}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t bg-muted/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题...（Enter 发送，Shift+Enter 换行）"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px]"
              aria-label="发送消息"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="icon"
              className="h-[60px]"
              aria-label="清空消息"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

