import { parseHistoryMarkdown } from "@/lib/history";

export const runtime = "nodejs";

export async function GET() {
  try {
    const content = await parseHistoryMarkdown();
    return new Response(JSON.stringify(content), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("History API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

