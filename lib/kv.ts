// Support both Vercel KV and Upstash Redis
let kv: any;

// Initialize KV client based on available environment variables
async function initializeKV() {
  if (kv) return kv; // Already initialized
  
  try {
    // Priority 1: Try Upstash Redis (if KV_URL or KV_REST_API_URL is present)
    if ((process.env.KV_URL || process.env.KV_REST_API_URL) && process.env.KV_REST_API_TOKEN) {
      try {
        // Use Upstash Redis
        const { Redis } = await import("@upstash/redis");
        kv = new Redis({
          url: process.env.KV_REST_API_URL || process.env.KV_URL,
          token: process.env.KV_REST_API_TOKEN,
        });
        console.log("Using Upstash Redis", {
          hasURL: !!(process.env.KV_REST_API_URL || process.env.KV_URL),
          hasToken: !!process.env.KV_REST_API_TOKEN,
        });
        return kv;
      } catch (error) {
        console.error("Failed to import @upstash/redis:", error);
        throw error;
      }
    }
    
    // Priority 2: Try Vercel KV (if only Vercel KV variables are present)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && !process.env.KV_URL) {
      try {
        // Try Vercel KV
        const { kv: vercelKv } = await import("@vercel/kv");
        kv = vercelKv;
        console.log("Using Vercel KV");
        return kv;
      } catch (error) {
        console.warn("Failed to import @vercel/kv:", error);
        throw error;
      }
    }
    
    console.warn("No KV storage configured. Env vars:", {
      hasKV_URL: !!process.env.KV_URL,
      hasKV_REST_API_URL: !!process.env.KV_REST_API_URL,
      hasKV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    });
  } catch (error) {
    console.error("Error initializing KV storage:", error);
  }
  
  return null;
}

const SURVEY_DATA_KEY = "survey:data";

export interface SurveyRecord {
  id: string;
  ageGroup: "18-22" | "23-26" | "27-30";
  gender: "男" | "女" | "其他/不便透露";
  region:
    | "华北"
    | "华东"
    | "华南"
    | "西南"
    | "西北"
    | "华中"
    | "东北";
  frequencyPerWeek: number;
  avgCostPerDrink: number;
  isAlcoholic: boolean;
  flavor:
    | "清爽"
    | "酸甜"
    | "果香"
    | "苦味"
    | "草本"
    | "奶香"
    | "气泡";
  tools: {
    shaker: boolean;
    jigger: boolean;
    barSpoon: boolean;
    strainer: boolean;
    muddler: boolean;
  };
  topIngredients: string[];
  month: string;
}

/**
 * Get all survey records from KV storage
 * Falls back to local JSON file if KV is not available (for local development only)
 */
export async function getSurveyData(): Promise<SurveyRecord[]> {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  try {
    // Initialize KV if not already initialized
    const kvClient = await initializeKV();
    
    // In production, KV must be configured
    if (!kvClient && !isDevelopment) {
      throw new Error("KV storage not configured in production. Please check environment variables.");
    }
    
    // If KV is available, use it
    if (kvClient) {
      const data = await kvClient.get<SurveyRecord[]>(SURVEY_DATA_KEY);
      if (data && Array.isArray(data)) {
        return data;
      }
      
      // If KV is empty, try to load from local file and initialize KV (only in development)
      if (isDevelopment && typeof window === "undefined") {
        try {
          const fs = await import("fs");
          const path = await import("path");
          const surveyPath = path.join(process.cwd(), "data", "survey.json");
          const fileData = JSON.parse(fs.readFileSync(surveyPath, "utf8"));
          if (Array.isArray(fileData) && fileData.length > 0) {
            // Initialize KV with existing data
            await kvClient.set(SURVEY_DATA_KEY, fileData);
            return fileData;
          }
        } catch (error) {
          console.warn("Could not load survey data from file:", error);
        }
      }
      
      // Return empty array if KV is empty
      return [];
    }
    
    // Only in development: fallback to local file if KV is not configured
    if (isDevelopment && typeof window === "undefined") {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const surveyPath = path.join(process.cwd(), "data", "survey.json");
        const fileData = JSON.parse(fs.readFileSync(surveyPath, "utf8"));
        return fileData;
      } catch (fileError) {
        console.warn("Could not load survey data from file:", fileError);
        return [];
      }
    }
    
    // In production without KV, return empty array
    return [];
  } catch (error) {
    console.error("Error getting survey data from KV:", error);
    
    // Only in development: fallback to local file
    if (isDevelopment && typeof window === "undefined") {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const surveyPath = path.join(process.cwd(), "data", "survey.json");
        const fileData = JSON.parse(fs.readFileSync(surveyPath, "utf8"));
        return fileData;
      } catch (fileError) {
        console.error("Error loading from file:", fileError);
      }
    }
    
    // In production, if KV fails, return empty array
    return [];
  }
}

/**
 * Save survey data to KV storage
 */
export async function saveSurveyData(data: SurveyRecord[]): Promise<void> {
  const kvClient = await initializeKV();
  if (!kvClient) {
    throw new Error("KV storage not configured. Please check environment variables: KV_REST_API_URL and KV_REST_API_TOKEN");
  }
  try {
    await kvClient.set(SURVEY_DATA_KEY, data);
    console.log("Survey data saved successfully to KV");
  } catch (error) {
    console.error("Error saving survey data to KV:", error);
    throw error;
  }
}

/**
 * Add a new survey record
 */
export async function addSurveyRecord(record: Omit<SurveyRecord, "id">): Promise<SurveyRecord> {
  const existingData = await getSurveyData();
  const newId = String(existingData.length + 1);
  const newRecord: SurveyRecord = {
    ...record,
    id: newId,
  };
  
  const updatedData = [...existingData, newRecord];
  await saveSurveyData(updatedData);
  
  return newRecord;
}

