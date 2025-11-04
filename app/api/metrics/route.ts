import { NextRequest } from "next/server";
import {
  filterSurveyData,
  aggregateFlavorDistribution,
  aggregateIngredients,
  getMonthlyTrend,
  getToolOwnership,
  getStatistics,
} from "@/lib/survey";
import { getSurveyData } from "@/lib/kv";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse filters
    const filters = {
      ageGroup: searchParams.get("ageGroup") || undefined,
      gender: searchParams.get("gender") || undefined,
      region: searchParams.get("region") || undefined,
      frequencyPerWeek: searchParams.get("frequencyPerWeek") || undefined,
      isAlcoholic:
        searchParams.get("isAlcoholic") === "true"
          ? true
          : searchParams.get("isAlcoholic") === "false"
            ? false
            : undefined,
      flavors: searchParams.getAll("flavor"),
    };

    // Get survey data from KV storage
    const surveyData = await getSurveyData();

    // Filter data
    const filteredData = filterSurveyData(filters, surveyData);

    // Aggregate metrics
    const flavorDistribution = aggregateFlavorDistribution(filteredData);
    const ingredients = aggregateIngredients(filteredData);
    const monthlyTrend = getMonthlyTrend(filteredData);
    const toolOwnership = getToolOwnership(filteredData);
    const statistics = getStatistics(filteredData);

    // Prepare scatter data
    const scatterData = filteredData.map((record) => [
      record.frequencyPerWeek,
      record.avgCostPerDrink,
    ]);

    return new Response(
      JSON.stringify({
        flavorDistribution,
        scatterData,
        toolOwnership,
        topIngredients: ingredients,
        monthlyTrend,
        total: filteredData.length,
        statistics,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Metrics API error:", error);
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

