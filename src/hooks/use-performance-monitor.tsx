import { useEffect, useState } from "react";
import { useIsMobile } from "./use-mobile";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  isLowEndDevice: boolean;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    isLowEndDevice: false,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Detect low-end devices based on hardware concurrency and memory
    const detectLowEndDevice = () => {
      const cores = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || 4;
      const isLowEnd = cores <= 2 || memory <= 2 || isMobile;

      setMetrics((prev) => ({
        ...prev,
        isLowEndDevice: isLowEnd,
      }));
    };

    // Monitor render performance
    const measureRenderTime = () => {
      const start = performance.now();

      requestAnimationFrame(() => {
        const end = performance.now();
        setMetrics((prev) => ({
          ...prev,
          renderTime: end - start,
        }));
      });
    };

    detectLowEndDevice();
    measureRenderTime();

    // Monitor memory usage if available
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
      }));
    }

    // Set up performance monitoring interval
    const interval = setInterval(measureRenderTime, 5000);

    return () => clearInterval(interval);
  }, [isMobile]);

  return {
    metrics,
    isLowEndDevice: metrics.isLowEndDevice,
    shouldOptimize: metrics.isLowEndDevice || metrics.renderTime > 16, // 60fps threshold
  };
}
