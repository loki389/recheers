// Import survey data as a module for Edge Runtime compatibility
import surveyData from "@/data/survey.json";

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

export interface FilterParams {
  ageGroup?: string;
  gender?: string;
  region?: string;
  frequencyPerWeek?: string;
  isAlcoholic?: boolean;
  flavors?: string[];
}

export function filterSurveyData(
  filters: FilterParams
): SurveyRecord[] {
  let filtered = [...surveyData] as SurveyRecord[];

  if (filters.ageGroup) {
    filtered = filtered.filter((r) => r.ageGroup === filters.ageGroup);
  }

  if (filters.gender) {
    filtered = filtered.filter((r) => r.gender === filters.gender);
  }

  if (filters.region) {
    filtered = filtered.filter((r) => r.region === filters.region);
  }

  if (filters.frequencyPerWeek) {
    const freq = parseInt(filters.frequencyPerWeek);
    filtered = filtered.filter((r) => r.frequencyPerWeek === freq);
  }

  if (filters.isAlcoholic !== undefined) {
    filtered = filtered.filter((r) => r.isAlcoholic === filters.isAlcoholic);
  }

  if (filters.flavors && filters.flavors.length > 0) {
    filtered = filtered.filter((r) => filters.flavors!.includes(r.flavor));
  }

  return filtered;
}

export function aggregateFlavorDistribution(
  data: SurveyRecord[]
): Array<{ name: string; value: number }> {
  const flavorCount: Record<string, number> = {};
  data.forEach((record) => {
    flavorCount[record.flavor] = (flavorCount[record.flavor] || 0) + 1;
  });
  return Object.entries(flavorCount).map(([name, value]) => ({ name, value }));
}

export function aggregateIngredients(
  data: SurveyRecord[]
): Array<{ name: string; value: number }> {
  const ingredientCount: Record<string, number> = {};
  data.forEach((record) => {
    record.topIngredients.forEach((ingredient) => {
      ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
    });
  });
  return Object.entries(ingredientCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

export function getMonthlyTrend(data: SurveyRecord[]): Array<{
  month: string;
  count: number;
}> {
  const monthCount: Record<string, number> = {};
  data.forEach((record) => {
    monthCount[record.month] = (monthCount[record.month] || 0) + 1;
  });
  return Object.entries(monthCount)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getToolOwnership(data: SurveyRecord[]): Array<{
  name: string;
  value: number;
}> {
  const toolCount: Record<string, number> = {
    shaker: 0,
    jigger: 0,
    barSpoon: 0,
    strainer: 0,
    muddler: 0,
  };
  const total = data.length || 1;

  data.forEach((record) => {
    Object.entries(record.tools).forEach(([tool, owned]) => {
      if (owned) {
        toolCount[tool]++;
      }
    });
  });

  const toolNames: Record<string, string> = {
    shaker: "摇壶",
    jigger: "量杯",
    barSpoon: "吧勺",
    strainer: "滤网",
    muddler: "捣棒",
  };

  return Object.entries(toolCount).map(([tool, count]) => ({
    name: toolNames[tool] || tool,
    value: Math.round((count / total) * 100),
  }));
}

export function getStatistics(data: SurveyRecord[]): {
  totalCount: number;
  avgCost: number;
  avgFrequency: number;
  alcoholicPercentage: number;
  regionDistribution: Array<{ name: string; value: number }>;
  genderDistribution: Array<{ name: string; value: number }>;
  ageGroupDistribution: Array<{ name: string; value: number }>;
} {
  const total = data.length;
  if (total === 0) {
    return {
      totalCount: 0,
      avgCost: 0,
      avgFrequency: 0,
      alcoholicPercentage: 0,
      regionDistribution: [],
      genderDistribution: [],
      ageGroupDistribution: [],
    };
  }

  // 平均成本和频率
  const totalCost = data.reduce((sum, r) => sum + r.avgCostPerDrink, 0);
  const totalFrequency = data.reduce((sum, r) => sum + r.frequencyPerWeek, 0);
  const avgCost = Math.round(totalCost / total);
  const avgFrequency = Math.round((totalFrequency / total) * 10) / 10;

  // 含酒精比例
  const alcoholicCount = data.filter((r) => r.isAlcoholic).length;
  const alcoholicPercentage = Math.round((alcoholicCount / total) * 100);

  // 地区分布
  const regionCount: Record<string, number> = {};
  data.forEach((r) => {
    regionCount[r.region] = (regionCount[r.region] || 0) + 1;
  });
  const regionDistribution = Object.entries(regionCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 性别分布
  const genderCount: Record<string, number> = {};
  data.forEach((r) => {
    genderCount[r.gender] = (genderCount[r.gender] || 0) + 1;
  });
  const genderDistribution = Object.entries(genderCount).map(([name, value]) => ({
    name,
    value,
  }));

  // 年龄段分布
  const ageGroupCount: Record<string, number> = {};
  data.forEach((r) => {
    ageGroupCount[r.ageGroup] = (ageGroupCount[r.ageGroup] || 0) + 1;
  });
  const ageGroupDistribution = Object.entries(ageGroupCount).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    totalCount: total,
    avgCost,
    avgFrequency,
    alcoholicPercentage,
    regionDistribution,
    genderDistribution,
    ageGroupDistribution,
  };
}

