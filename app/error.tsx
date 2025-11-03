"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">出现错误</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || "页面加载时发生错误"}
        </p>
        <Button onClick={reset}>重试</Button>
      </div>
    </div>
  );
}


