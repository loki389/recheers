import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

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

    // Read existing survey data
    const dataPath = path.join(process.cwd(), "data", "survey.json");
    const existingData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    // Generate new ID
    const newId = String(existingData.length + 1);

    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Create new survey record
    const newRecord = {
      id: newId,
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
    };

    // Add new record to data
    existingData.push(newRecord);

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2), "utf8");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Survey submitted successfully",
        id: newId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error submitting survey:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

