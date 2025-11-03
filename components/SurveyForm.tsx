"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

const FLAVOR_OPTIONS = [
  "清爽",
  "酸甜",
  "果香",
  "苦味",
  "草本",
  "奶香",
  "气泡",
];

export function SurveyForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    ageGroup: "",
    gender: "",
    region: "",
    frequencyPerWeek: "",
    avgCostPerDrink: "",
    isAlcoholic: undefined as boolean | undefined,
    flavor: "",
    tools: {
      shaker: false,
      jigger: false,
      barSpoon: false,
      strainer: false,
      muddler: false,
    },
    topIngredients: [] as string[],
  });
  const [ingredientInput, setIngredientInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          frequencyPerWeek: parseInt(formData.frequencyPerWeek) || 0,
          avgCostPerDrink: parseInt(formData.avgCostPerDrink) || 0,
          topIngredients: formData.topIngredients.filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("提交失败");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form
        setFormData({
          ageGroup: "",
          gender: "",
          region: "",
          frequencyPerWeek: "",
          avgCostPerDrink: "",
          isAlcoholic: undefined,
          flavor: "",
          tools: {
            shaker: false,
            jigger: false,
            barSpoon: false,
            strainer: false,
            muddler: false,
          },
          topIngredients: [],
        });
        setIngredientInput("");
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("提交失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !formData.topIngredients.includes(ingredientInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        topIngredients: [...prev.topIngredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      topIngredients: prev.topIngredients.filter((i) => i !== ingredient),
    }));
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">提交成功！</h3>
          <p className="text-muted-foreground">感谢您的参与，您的数据已成功提交</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="age-group">年龄段 *</Label>
              <Select
                value={formData.ageGroup}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, ageGroup: value }))
                }
                required
              >
                <SelectTrigger id="age-group">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-22">18-22</SelectItem>
                  <SelectItem value="23-26">23-26</SelectItem>
                  <SelectItem value="27-30">27-30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">性别 *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                required
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                  <SelectItem value="其他/不便透露">其他/不便透露</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">地区 *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, region: value }))
                }
                required
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="华北">华北</SelectItem>
                  <SelectItem value="华东">华东</SelectItem>
                  <SelectItem value="华南">华南</SelectItem>
                  <SelectItem value="西南">西南</SelectItem>
                  <SelectItem value="西北">西北</SelectItem>
                  <SelectItem value="华中">华中</SelectItem>
                  <SelectItem value="东北">东北</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency">每周调酒频率 *</Label>
              <Select
                value={formData.frequencyPerWeek}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, frequencyPerWeek: value }))
                }
                required
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0次</SelectItem>
                  <SelectItem value="1">1次</SelectItem>
                  <SelectItem value="2">2次</SelectItem>
                  <SelectItem value="3">3次</SelectItem>
                  <SelectItem value="4">4次</SelectItem>
                  <SelectItem value="5">5次</SelectItem>
                  <SelectItem value="6">6次</SelectItem>
                  <SelectItem value="7">7次</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cost">平均每杯成本（元）*</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                value={formData.avgCostPerDrink}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, avgCostPerDrink: e.target.value }))
                }
                placeholder="例如：30"
                required
              />
            </div>

            <div>
              <Label htmlFor="flavor">偏好的味型 *</Label>
              <Select
                value={formData.flavor}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, flavor: value }))
                }
                required
              >
                <SelectTrigger id="flavor">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {FLAVOR_OPTIONS.map((flavor) => (
                    <SelectItem key={flavor} value={flavor}>
                      {flavor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>是否含酒精 *</Label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.isAlcoholic === true}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAlcoholic: checked ? true : undefined,
                    }))
                  }
                />
                <span>含酒精</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.isAlcoholic === false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAlcoholic: checked ? false : undefined,
                    }))
                  }
                />
                <span>不含酒精</span>
              </label>
            </div>
          </div>

          <div>
            <Label>拥有的调酒工具（可多选）</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
              {[
                { key: "shaker", label: "摇壶" },
                { key: "jigger", label: "量杯" },
                { key: "barSpoon", label: "吧勺" },
                { key: "strainer", label: "滤网" },
                { key: "muddler", label: "捣棒" },
              ].map((tool) => (
                <label key={tool.key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.tools[tool.key as keyof typeof formData.tools]}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        tools: {
                          ...prev.tools,
                          [tool.key]: checked,
                        },
                      }))
                    }
                  />
                  <span>{tool.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="ingredients">常用原料（可添加多个）</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="ingredients"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
                placeholder="输入原料名称，按回车添加"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddIngredient}
              >
                添加
              </Button>
            </div>
            {formData.topIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.topIngredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              "提交问卷"
            )}
          </Button>
        </form>
  );
}

