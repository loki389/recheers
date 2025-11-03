import fs from "fs";
import path from "path";
import { TimelineItem } from "@/components/HistoryTimeline";
import { HistoryContent } from "@/types/history";

export type { HistoryContent };

export async function parseHistoryMarkdown(): Promise<HistoryContent> {
  const filePath = path.join(process.cwd(), "data", "history.md");
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`History file not found at: ${filePath}`);
  }
  
  // Try to read with UTF-8 encoding
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read history file: ${err}`);
  }

  // Find frontmatter between first --- and second ---
  // Handle both Unix and Windows line endings
  const lines = fileContent.split(/\r?\n/);
  let frontmatterStart = -1;
  let frontmatterEnd = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      if (frontmatterStart === -1) {
        frontmatterStart = i + 1;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }
  
  if (frontmatterStart === -1 || frontmatterEnd === -1) {
    console.error("No frontmatter delimiters found in history.md");
    return { items: [], content: fileContent };
  }

  const frontmatter = lines.slice(frontmatterStart, frontmatterEnd).join("\n").trim();
  const content = lines.slice(frontmatterEnd + 1).join("\n").trim();
  
  console.log("Frontmatter extracted:", frontmatter.substring(0, 150));
  
  // Parse YAML-like structure for items
  const items: TimelineItem[] = [];
  const frontmatterLines = frontmatter.split("\n");
  let currentItem: Partial<TimelineItem> | null = null;
  
  console.log("Frontmatter lines count:", frontmatterLines.length);

  for (let i = 0; i < frontmatterLines.length; i++) {
    const line = frontmatterLines[i];
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      continue;
    }
    
    // Skip the items: line
    if (trimmed === "items:" || trimmed.startsWith("items:")) {
      continue;
    }
    
    // Check if line contains - and year: (new item with year on same line)
    // Format: "  - year: 1920" or just "- year: 1920"
    if (trimmed.includes("-") && trimmed.includes("year:")) {
      // New item, save previous one
      if (currentItem && currentItem.year && currentItem.title) {
        items.push(currentItem as TimelineItem);
      }
      currentItem = {};
      // Parse year from this line
      const yearMatch = trimmed.match(/year:\s*(\d+)/);
      if (yearMatch && currentItem) {
        currentItem.year = parseInt(yearMatch[1]);
      }
    } else if (trimmed.startsWith("-")) {
      // Just a dash line (unlikely but handle it)
      if (currentItem && currentItem.year && currentItem.title) {
        items.push(currentItem as TimelineItem);
      }
      currentItem = {};
    } else if (trimmed.includes("year:") && currentItem) {
      // year: on separate line (unlikely in this format)
      const yearMatch = trimmed.match(/year:\s*(\d+)/);
      if (yearMatch) {
        currentItem.year = parseInt(yearMatch[1]);
      }
    } else if (trimmed.includes("title:") && currentItem) {
      // title: field
      const titleMatch = trimmed.match(/title:\s*(.+)$/);
      if (titleMatch) {
        currentItem.title = titleMatch[1].trim();
      }
    } else if (trimmed.includes("link:") && currentItem) {
      // link: field
      const linkMatch = trimmed.match(/link:\s*(.+)$/);
      if (linkMatch) {
        currentItem.link = linkMatch[1].trim();
      }
    }
  }

  // Save last item
  if (currentItem && currentItem.year && currentItem.title) {
    items.push(currentItem as TimelineItem);
  }

  console.log(`Parsed ${items.length} timeline items`);

  return {
    items: items.sort((a, b) => a.year - b.year),
    content: content,
  };
}

