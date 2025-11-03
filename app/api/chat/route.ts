import { NextRequest } from "next/server";
import { z } from "zod";
import { streamChatResponse } from "@/lib/openai";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  model: z.string().optional().default("deepseek-chat"),
  temperature: z.number().min(0).max(2).optional().default(0.7),
});

export async function POST(req: NextRequest) {
  try {
    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Rate limiting
    const identifier = getClientIdentifier(req.headers);
    const rateLimit = checkRateLimit(identifier);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          resetAt: rateLimit.resetAt,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // Parse and validate request
    const body = await req.json();
    const { messages, model, temperature } = ChatRequestSchema.parse(body);
    
    console.log("Chat request:", { model, temperature, messageCount: messages.length });

    // Create a readable stream
    const encoder = new TextEncoder();
    let hasSentData = false;
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting stream for OpenAI API...");
          for await (const chunk of streamChatResponse(
            messages,
            model,
            temperature
          )) {
            if (chunk) {
              hasSentData = true;
              controller.enqueue(encoder.encode(chunk));
            }
          }
          console.log("Stream completed, sent data:", hasSentData);
          if (!hasSentData) {
            controller.enqueue(
              encoder.encode("[错误] 未收到任何回复内容，请检查API配置")
            );
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "发生未知错误";
          // Send error as text so frontend can display it
          controller.enqueue(
            encoder.encode(`\n\n[错误] ${errorMessage}`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid request", details: error.errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

