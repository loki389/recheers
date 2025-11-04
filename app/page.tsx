"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowUp, Users, DollarSign, TrendingUp, MapPin, BarChart3, Loader2, RotateCcw, ClipboardList, Sparkles, ChevronDown } from "lucide-react";
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
import { ChatPanel } from "@/components/ChatPanel";
import { HistoryTimeline } from "@/components/HistoryTimeline";
import { SurveyForm } from "@/components/SurveyForm";
// Dynamically import charts to avoid SSR issues
const FlavorChart = React.lazy(() => import("@/components/Charts").then(m => ({ default: m.FlavorChart })));
const ScatterChart = React.lazy(() => import("@/components/Charts").then(m => ({ default: m.ScatterChart })));
const RadarChart = React.lazy(() => import("@/components/Charts").then(m => ({ default: m.RadarChart })));
const IngredientsChart = React.lazy(() => import("@/components/Charts").then(m => ({ default: m.IngredientsChart })));
const TrendChart = React.lazy(() => import("@/components/Charts").then(m => ({ default: m.TrendChart })));
import { HistoryContent } from "@/types/history";

const FLAVOR_OPTIONS = [
  "清爽",
  "酸甜",
  "果香",
  "苦味",
  "草本",
  "奶香",
  "气泡",
];

export default function Home() {
  const [historyContent, setHistoryContent] =
    useState<HistoryContent | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 切换逻辑：同值则清空，异值则设置
  const handleSelectYear = useCallback((y: number) => {
    setSelectedYear(prev => (prev === y ? null : y));
  }, []);
  const handleClearYear = useCallback(() => setSelectedYear(null), []);
  const [metrics, setMetrics] = useState<{
    flavorDistribution?: Array<{ name: string; value: number }>;
    scatterData?: number[][];
    toolOwnership?: Array<{ name: string; value: number }>;
    topIngredients?: Array<{ name: string; value: number }>;
    monthlyTrend?: Array<{ month: string; count: number }>;
    statistics?: {
      totalCount: number;
      avgCost: number;
      avgFrequency: number;
      alcoholicPercentage: number;
      regionDistribution: Array<{ name: string; value: number }>;
      genderDistribution: Array<{ name: string; value: number }>;
      ageGroupDistribution: Array<{ name: string; value: number }>;
    };
  } | null>(null);
  const [filters, setFilters] = useState({
    ageGroup: "",
    gender: "",
    region: "",
    frequencyPerWeek: "",
    isAlcoholic: undefined as boolean | undefined,
    flavors: [] as string[],
  });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["hero"]));
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const loadMetrics = async () => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    setIsLoadingMetrics(true);
    try {
      const params = new URLSearchParams();
      if (filters.ageGroup) params.append("ageGroup", filters.ageGroup);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.region) params.append("region", filters.region);
      if (filters.frequencyPerWeek)
        params.append("frequencyPerWeek", filters.frequencyPerWeek);
      if (filters.isAlcoholic !== undefined)
        params.append("isAlcoholic", String(filters.isAlcoholic));
      filters.flavors.forEach((f) => params.append("flavor", f));

      const res = await fetch(`/api/metrics?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Metrics API error:", errorData.error, errorData.details);
        setMetrics(null);
        return;
      }
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error loading metrics:", error);
      setMetrics(null);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      ageGroup: "",
      gender: "",
      region: "",
      frequencyPerWeek: "",
      isAlcoholic: undefined,
      flavors: [],
    });
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Load history content
    fetch("/api/history")
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error || `HTTP error! status: ${res.status}`);
          }).catch(() => {
            throw new Error(`HTTP error! status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("History data loaded:", data);
        if (data.error) {
          console.error("History API error:", data.error, data.details);
          setHistoryContent({ items: [], content: "" });
        } else {
          setHistoryContent(data);
          if (data.items && data.items.length > 0) {
            setSelectedYear(data.items[0].year);
          } else {
            console.warn("No timeline items found in history data");
          }
        }
      })
      .catch((error) => {
        console.error("Error loading history:", error);
        setHistoryContent({ items: [], content: "" });
      });

    // Load initial metrics
    loadMetrics();

    // Scroll handler
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      // Hide scroll indicator when scrolled down
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowScrollIndicator(window.scrollY < heroBottom - window.innerHeight + 100);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for section animations
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set(prev).add(entry.target.id));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Debounce the API call to avoid too many requests
    const timeoutId = setTimeout(() => {
      loadMetrics();
    }, 300); // Wait 300ms after the last filter change

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFlavorToggle = (flavor: string) => {
    setFilters((prev) => ({
      ...prev,
      flavors: prev.flavors.includes(flavor)
        ? prev.flavors.filter((f) => f !== flavor)
        : [...prev.flavors, flavor],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/98 backdrop-blur-xl border-b border-border/50 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          {/* Main Title and Navigation Links in one row */}
          <div className="flex items-center justify-between gap-4 md:gap-6 py-4 md:py-5">
            {/* Left side: Logo and Title */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 group cursor-pointer" onClick={() => scrollToSection("hero")}>
              {/* Logo */}
              <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105 h-10 md:h-14 flex items-center justify-center overflow-visible">
                <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm group-hover:bg-primary/20 transition-colors -z-10 pointer-events-none"></div>
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={300}
                  height={56}
                  className="object-contain rounded-lg h-full w-auto"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm md:text-lg font-bold text-foreground leading-tight">
                  大学生创业训练项目
                </h1>
                <span className="text-[10px] md:text-xs text-muted-foreground font-normal hidden sm:inline">
                  自调酒灵感与知识助手
                </span>
              </div>
            </div>
            
            {/* Right side: Navigation Links */}
            <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => scrollToSection("hero")}
              className="relative px-4 md:px-5 py-2 text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-all duration-300 rounded-lg hover:bg-primary/10 group whitespace-nowrap flex-shrink-0"
            >
              <span className="relative z-10">AI 调酒助手</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("visualization")}
              className="relative px-4 md:px-5 py-2 text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-all duration-300 rounded-lg hover:bg-primary/10 group whitespace-nowrap flex-shrink-0"
            >
              <span className="relative z-10">数据面板</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => {
                setShowSurveyForm(true);
                scrollToSection("visualization");
                setTimeout(() => {
                  const formElement = document.getElementById("survey-form-container");
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 500);
              }}
              className="relative px-4 md:px-5 py-2 text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-all duration-300 rounded-lg hover:bg-primary/10 group whitespace-nowrap flex-shrink-0"
            >
              <span className="relative z-10">参与调研</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("history")}
              className="relative px-4 md:px-5 py-2 text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-all duration-300 rounded-lg hover:bg-primary/10 group whitespace-nowrap flex-shrink-0"
            >
              <span className="relative z-10">发展历程</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
            </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero + AI Chat */}
      <section
        id="hero"
        className="container mx-auto px-4 py-16 lg:py-24 relative"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            让我们从调一杯酒开始
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            在家用简单材料与工具，找到你的第一杯自调
          </p>
          <p className="text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
            一个关于自调酒的灵感与知识助手
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <ChatPanel />
        </div>
        
        {/* Scroll Down Indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-300">
            <button
              onClick={() => scrollToSection("visualization")}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group"
              aria-label="向下滚动"
            >
              <span className="text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">向下滑动</span>
              <ChevronDown className="h-6 w-6 animate-pulse group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </section>

      {/* Section 2: Data Visualization */}
      <section
        id="visualization"
        className={`container mx-auto px-4 py-16 lg:py-24 bg-muted/30 transition-all duration-1000 ${
          visibleSections.has("visualization")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left">
            青年群体自调酒调研数据
          </h2>
          <Button
            onClick={() => {
              setShowSurveyForm(true);
              setTimeout(() => {
                const formElement = document.getElementById("survey-form-container");
                if (formElement) {
                  formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 100);
            }}
            className="flex items-center gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            参与调研
          </Button>
        </div>

        {/* Survey Form - Only show when showSurveyForm is true */}
        {showSurveyForm && (
          <div 
            id="survey-form-container" 
            className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500"
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>参与调研</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSurveyForm(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  帮助我们了解青年群体的自调酒习惯，您的回答将被匿名处理
                </p>
              </CardHeader>
              <CardContent>
                <SurveyForm
                  onSuccess={() => {
                    // Reload metrics after successful submission
                    loadMetrics();
                    setShowSurveyForm(false);
                    setTimeout(() => {
                      scrollToSection("visualization");
                    }, 500);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>筛选条件</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                重置筛选
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="age-group">年龄段</Label>
                <Select
                  value={filters.ageGroup || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      ageGroup: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger id="age-group">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="18-22">18-22</SelectItem>
                    <SelectItem value="23-26">23-26</SelectItem>
                    <SelectItem value="27-30">27-30</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender">性别</Label>
                <Select
                  value={filters.gender || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      gender: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="男">男</SelectItem>
                    <SelectItem value="女">女</SelectItem>
                    <SelectItem value="其他/不便透露">其他/不便透露</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">地区</Label>
                <Select
                  value={filters.region || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      region: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
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
                <Label htmlFor="frequency">调酒频率</Label>
                <Select
                  value={filters.frequencyPerWeek || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      frequencyPerWeek: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="0">0次/周</SelectItem>
                    <SelectItem value="1">1次/周</SelectItem>
                    <SelectItem value="2">2次/周</SelectItem>
                    <SelectItem value="3">3次/周</SelectItem>
                    <SelectItem value="4">4次/周</SelectItem>
                    <SelectItem value="5">5次/周</SelectItem>
                    <SelectItem value="6">6次/周</SelectItem>
                    <SelectItem value="7">7次/周</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label>是否含酒精</Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.isAlcoholic === true}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          isAlcoholic: checked ? true : undefined,
                        }))
                      }
                    />
                    <span>含酒精</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.isAlcoholic === false}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
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
                <Label>味型偏好</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {FLAVOR_OPTIONS.map((flavor) => (
                    <label
                      key={flavor}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.flavors.includes(flavor)}
                        onCheckedChange={() => handleFlavorToggle(flavor)}
                      />
                      <span>{flavor}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Indicator */}
        {isLoadingMetrics && (
          <div className="flex items-center justify-center py-8 mb-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>正在更新数据...</span>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {!isLoadingMetrics && metrics && metrics.statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">总参与人数</p>
                    <p className="text-3xl font-bold">{metrics.statistics.totalCount.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">平均成本</p>
                    <p className="text-3xl font-bold">¥{metrics.statistics.avgCost}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">平均频率</p>
                    <p className="text-3xl font-bold">{metrics.statistics.avgFrequency}次/周</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">含酒精比例</p>
                    <p className="text-3xl font-bold">{metrics.statistics.alcoholicPercentage}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Distribution Cards */}
        {!isLoadingMetrics && metrics && metrics.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  地区分布 TOP 3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.statistics.regionDistribution.slice(0, 3).map((region, index) => {
                    const percentage = Math.round((region.value / metrics.statistics!.totalCount) * 100);
                    return (
                      <div key={region.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{region.name}</span>
                          <span className="text-sm text-muted-foreground">{region.value} 人 ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  性别分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.statistics.genderDistribution.map((gender) => {
                    const percentage = Math.round((gender.value / metrics.statistics!.totalCount) * 100);
                    return (
                      <div key={gender.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{gender.name}</span>
                          <span className="text-sm text-muted-foreground">{gender.value} 人 ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  年龄段分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.statistics.ageGroupDistribution.map((ageGroup) => {
                    const percentage = Math.round((ageGroup.value / metrics.statistics!.totalCount) * 100);
                    return (
                      <div key={ageGroup.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{ageGroup.name}</span>
                          <span className="text-sm text-muted-foreground">{ageGroup.value} 人 ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        {!isLoadingMetrics && metrics && (
          <React.Suspense fallback={<div className="text-center py-8 text-muted-foreground">加载图表中...</div>}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center">加载中...</div>}>
                    <FlavorChart data={metrics.flavorDistribution || []} />
                  </React.Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center">加载中...</div>}>
                    <ScatterChart data={metrics.scatterData || []} />
                  </React.Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center">加载中...</div>}>
                    <RadarChart data={metrics.toolOwnership || []} />
                  </React.Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center">加载中...</div>}>
                    <IngredientsChart data={metrics.topIngredients || []} />
                  </React.Suspense>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center">加载中...</div>}>
                    <TrendChart data={metrics.monthlyTrend || []} />
                  </React.Suspense>
                </CardContent>
              </Card>
            </div>
          </React.Suspense>
        )}

        {/* No data message */}
        {!isLoadingMetrics && !metrics && (
          <div className="text-center py-12 text-muted-foreground">
            <p>暂无数据，请调整筛选条件</p>
          </div>
        )}
      </section>

      {/* Section 3: History */}
      <section
        id="history"
        className={`container mx-auto px-4 py-16 lg:py-24 transition-all duration-1000 ${
          visibleSections.has("history")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          发展历程
        </h2>

        {historyContent && historyContent.items && historyContent.items.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <HistoryTimeline
              items={historyContent.items}
              selectedYear={selectedYear}
              onSelectYear={handleSelectYear}
              onClearYear={handleClearYear}
              content={historyContent.content}
            />
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {historyContent === null ? (
              <p>加载中...</p>
            ) : (
              <p>暂无历史数据</p>
            )}
          </div>
        )}
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 rounded-full shadow-lg"
          aria-label="返回顶部"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

