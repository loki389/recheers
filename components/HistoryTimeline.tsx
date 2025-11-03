"use client";

import React from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  year: number;
  title: string;
  link?: string;
}

interface HistoryTimelineProps {
  items: TimelineItem[];
  selectedYear?: number | null;
  onSelectYear?: (year: number) => void;
  onClearYear?: () => void;
  content?: string; // 完整的历史内容文本
}

export function HistoryTimeline({
  items,
  selectedYear,
  onSelectYear,
  onClearYear,
  content = "",
}: HistoryTimelineProps) {
  const sortedItems = [...items].sort((a, b) => a.year - b.year);


  // 解析内容，提取每个年份对应的详细内容
  const getYearContent = (year: number, title: string): string => {
    if (!content) return "";
    
    // 尝试多种匹配模式
    // 模式1: ## 年份：标题 或 ## 年份年代：标题
    const patterns = [
      new RegExp(`##\\s*.*?${year}.*?：.*?${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=##|$)`, 'i'),
      new RegExp(`##\\s*.*?${year}.*?${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=##|$)`, 'i'),
      new RegExp(`##\\s*.*?${year}.*?([\\s\\S]*?)(?=##|$)`, 'i'),
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        let text = match[1].trim();
        // 移除可能的标题行
        const lines = text.split('\n');
        const firstLine = lines[0]?.trim() || '';
        
        // 如果第一行包含标题或年份，跳过它
        if (firstLine.includes(title) || firstLine.includes(String(year)) || firstLine.startsWith('#')) {
          text = lines.slice(1).join('\n').trim();
        }
        
        // 移除开头的空行
        text = text.replace(/^\n+/, '');
        
        if (text) {
          return text;
        }
      }
    }
    
    return "";
  };

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
      <div className="space-y-8">
        {sortedItems.map((item) => {
          const isSelected = selectedYear === item.year;
          const isExpanded = isSelected;
          const yearContent = isExpanded ? getYearContent(item.year, item.title) : "";

          return (
            <div key={item.year} className="relative">
              <div className="relative flex items-start gap-6">
                {/* Year marker */}
                <button
                  onClick={() => (isSelected ? onClearYear?.() : onSelectYear?.(item.year))}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 bg-background font-bold text-lg transition-all duration-300 ease-out",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground scale-110"
                      : "border-border hover:border-primary/50 hover:scale-110 hover:shadow-lg cursor-pointer"
                  )}
                  aria-label={`${isSelected ? '收起' : '展开'} ${item.year} 年内容`}
                >
                  {item.year}
                </button>

                {/* Content Card */}
                <Card
                  className={cn(
                    "flex-1 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] duration-300 ease-out",
                    isSelected && "ring-2 ring-primary shadow-md"
                  )}
                >
                  <CardContent 
                    className="p-6 cursor-pointer"
                    onClick={() => (isSelected ? onClearYear?.() : onSelectYear?.(item.year))}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <ChevronDown 
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-300",
                              isExpanded && "transform rotate-180"
                            )}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.year} 年
                        </p>
                      </div>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm whitespace-nowrap"
                          aria-label={`查看 ${item.title} 的参考资料`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          参考资料
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Expanded Content */}
              {isExpanded && yearContent && (
                <div className="relative ml-[88px] mt-4">
                  <Card className="bg-muted/50 border-primary/20">
                    <CardContent className="p-6">
                      <div 
                        className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: yearContent
                            .split('\n')
                            .map(line => {
                              // 简单的 Markdown 段落处理
                              if (line.trim()) {
                                return `<p class="mb-4">${line.trim()}</p>`;
                              }
                              return '';
                            })
                            .join('')
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

