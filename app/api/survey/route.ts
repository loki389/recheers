import { NextRequest } from "next/server";
import { addSurveyRecord } from "@/lib/kv";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "ageGroup",
      "gender",
      "region",
      "frequencyPerWeek",
      "avgCostPerDrink",
      "flavor",
      "isAlcoholic",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === "") {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Create new survey record (without id, will be generated)
    const newRecord = await addSurveyRecord({
      ageGroup: body.ageGroup,
      gender: body.gender,
      region: body.region,
      frequencyPerWeek: parseInt(body.frequencyPerWeek) || 0,
      avgCostPerDrink: parseInt(body.avgCostPerDrink) || 0,
      isAlcoholic: body.isAlcoholic === true || body.isAlcoholic === "true",
      flavor: body.flavor,
      tools: body.tools || {
        shaker: false,
        jigger: false,
        barSpoon: false,
        strainer: false,
        muddler: false,
      },
      topIngredients: body.topIngredients || [],
      month: currentMonth,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Survey submitted successfully",
        id: newRecord.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error submitting survey:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      envVars: {
        hasUPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        hasUPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      }
    });
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        hint: "Please check Vercel logs for more details",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

