import { useEffect, useRef } from "react";

// Type definitions
interface LoaderProps {
  variant?: "default" | "minimal" | "detailed";
  size?: "small" | "medium" | "large";
  className?: string;
  animate?: boolean;
}

interface SizeConfig {
  container: string;
  image: string;
  imageInner: string;
  text: string;
  textInner: string;
  textHeight: string;
  textInnerHeight: string;
}

type SizeConfigMap = {
  [K in "small" | "medium" | "large"]: SizeConfig;
};

export function Loader({
  variant = "default",
  size = "medium",
  className = "",
  animate = true,
}: LoaderProps): JSX.Element {
  // Refs with proper typing
  const containerRef = useRef<HTMLDivElement>(null);
  const imageSkeletonRef = useRef<HTMLDivElement>(null);
  const titleSkeletonRef = useRef<HTMLDivElement>(null);
  const priceSkeletonRef = useRef<HTMLDivElement>(null);

  // Size configurations with proper typing
  const sizeConfig: SizeConfigMap = {
    small: {
      container: "w-[120px]",
      image: "h-[120px] w-[120px]",
      imageInner: "h-[110px] w-[110px]",
      text: "w-[120px]",
      textInner: "w-[100px]",
      textHeight: "h-[20px]",
      textInnerHeight: "h-[15px]",
    },
    medium: {
      container: "w-[150px] sm:w-[240px]",
      image: "h-[155px] w-[150px] sm:w-[240px]",
      imageInner: "h-[140px] w-[140px] sm:w-[230px]",
      text: "w-[150px] sm:w-[240px]",
      textInner: "w-[130px] sm:w-[220px]",
      textHeight: "h-[30px]",
      textInnerHeight: "h-[20px]",
    },
    large: {
      container: "w-[200px] sm:w-[300px]",
      image: "h-[200px] w-[200px] sm:w-[300px]",
      imageInner: "h-[185px] w-[185px] sm:w-[285px]",
      text: "w-[200px] sm:w-[300px]",
      textInner: "w-[180px] sm:w-[280px]",
      textHeight: "h-[35px]",
      textInnerHeight: "h-[25px]",
    },
  };

  const config: SizeConfig = sizeConfig[size];

  useEffect(() => {
    if (!animate || !containerRef.current) return;

    const elements = {
      container: containerRef.current,
      image: imageSkeletonRef.current,
      title: titleSkeletonRef.current,
      price: priceSkeletonRef.current,
    };

    // Enhanced CSS animations using Web Animations API
    const animateEntrance = () => {
      if (!elements.container) return;

      elements.container.style.opacity = "0";
      elements.container.style.transform = "scale(0.8) rotateY(-15deg)";

      elements.container.animate(
        [
          { opacity: 0, transform: "scale(0.8) rotateY(-15deg)" },
          { opacity: 1, transform: "scale(1) rotateY(0deg)" },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          fill: "forwards",
        }
      );

      // Floating animation
      setTimeout(() => {
        elements.container?.animate(
          [
            { transform: "translateY(0px)" },
            { transform: "translateY(-5px)" },
            { transform: "translateY(0px)" },
          ],
          {
            duration: 2000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      }, 600);
    };

    const animateShimmer = () => {
      const shimmerElements =
        containerRef.current?.querySelectorAll(".shimmer-effect");
      shimmerElements?.forEach((element) => {
        (element as HTMLElement).animate(
          [
            { transform: "translateX(-100%)" },
            { transform: "translateX(100%)" },
          ],
          {
            duration: 2000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      });
    };

    const animatePulse = () => {
      const pulseElements = [elements.title, elements.price].filter(Boolean);
      pulseElements.forEach((element, index) => {
        if (element) {
          setTimeout(() => {
            element.animate(
              [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
              {
                duration: 1000,
                iterations: Infinity,
                easing: "ease-in-out",
              }
            );
          }, index * 200);
        }
      });
    };

    animateEntrance();
    animateShimmer();
    animatePulse();

    // Cleanup function
    return () => {
      // Cancel all animations if needed
    };
  }, [variant, size, animate]);

  // Minimal variant component
  const MinimalLoader = (): JSX.Element => (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-3 transform-gpu ${className}`}
    >
      <div className="relative overflow-hidden">
        <div
          ref={imageSkeletonRef}
          className={`${config.image} flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 animate-pulse`}
        >
          <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute inset-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-500 rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <div
          ref={titleSkeletonRef}
          className={`${config.textHeight} ${config.text} bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg border border-slate-200 dark:border-slate-600 animate-pulse relative overflow-hidden`}
        >
          <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg" />
        </div>
      </div>
    </div>
  );

  // Detailed variant component
  const DetailedLoader = (): JSX.Element => (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-4 transform-gpu ${className}`}
    >
      {/* Enhanced Image Skeleton */}
      <div className="relative overflow-hidden group">
        <div
          ref={imageSkeletonRef}
          className={`${config.image} flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-400 dark:from-indigo-800 dark:via-purple-700 dark:to-pink-600 rounded-2xl shadow-2xl border-2 border-indigo-200 dark:border-indigo-600 transition-all duration-500 group-hover:shadow-3xl animate-pulse relative overflow-hidden`}
        >
          <div
            className={`${config.imageInner} bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-300 dark:from-indigo-700 dark:via-purple-600 dark:to-pink-500 rounded-xl border border-white/50 dark:border-white/20`}
          />

          {/* Enhanced shimmer effect */}
          <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-2xl" />

          {/* Animated corner accents */}
          <div className="absolute top-3 right-3 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg" />
          <div
            className="absolute bottom-3 left-3 w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse shadow-lg"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Advanced loading bar */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-white/30 dark:bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="loading-bar h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Enhanced Text Skeletons */}
      <div className="space-y-3">
        <div className="relative overflow-hidden">
          <div
            ref={titleSkeletonRef}
            className={`${config.textHeight} flex items-center justify-center bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 ${config.text} rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-600 animate-pulse relative overflow-hidden`}
          >
            <div
              className={`${config.textInnerHeight} bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-500 dark:to-slate-400 ${config.textInner} rounded-lg border border-white/50`}
            />
            <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl" />
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={priceSkeletonRef}
            className={`${config.textHeight} bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-300 dark:from-emerald-700 dark:via-teal-600 dark:to-cyan-700 flex items-center justify-center ${config.text} rounded-xl shadow-lg border-2 border-emerald-200 dark:border-emerald-600 animate-pulse relative overflow-hidden`}
          >
            <div
              className={`${config.textInnerHeight} bg-gradient-to-r from-emerald-100 to-teal-200 dark:from-emerald-600 dark:to-teal-500 ${config.textInner} rounded-lg border border-white/50`}
            />
            <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl" />
          </div>

          {/* Animated price indicator */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-ping shadow-lg" />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
      </div>

      {/* Enhanced rating and meta info */}
      <div className="flex justify-between items-center mt-3 px-1">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-pulse shadow-sm"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="w-16 h-5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 rounded-lg animate-pulse" />
      </div>

      {/* Additional detail indicators */}
      <div className="flex justify-center space-x-2 mt-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );

  // Default variant component
  const DefaultLoader = (): JSX.Element => (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-3 transform-gpu ${className}`}
    >
      {/* Modern Image Skeleton */}
      <div className="relative overflow-hidden">
        <div
          ref={imageSkeletonRef}
          className={`${config.image} flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 dark:from-gray-600 dark:via-gray-500 dark:to-gray-400 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 animate-pulse relative overflow-hidden`}
        >
          <div
            className={`${config.imageInner} bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-500 dark:via-gray-400 dark:to-gray-300 rounded-xl border border-white/30`}
          />

          {/* Enhanced shimmer overlay */}
          <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-2xl" />

          {/* Subtle corner accent */}
          <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-70 animate-pulse" />
        </div>
      </div>

      {/* Modern Text Skeletons */}
      <div className="space-y-3">
        <div className="relative overflow-hidden">
          <div
            ref={titleSkeletonRef}
            className={`${config.textHeight} flex items-center justify-center bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 dark:from-gray-500 dark:via-gray-400 dark:to-gray-500 ${config.text} rounded-xl shadow-md border border-gray-300 dark:border-gray-600 animate-pulse relative overflow-hidden`}
          >
            <div
              className={`${config.textInnerHeight} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-400 dark:via-gray-300 dark:to-gray-400 ${config.textInner} rounded-lg border border-white/30`}
            />
            <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl" />
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={priceSkeletonRef}
            className={`${config.textHeight} bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 dark:from-gray-500 dark:via-gray-400 dark:to-gray-500 flex items-center justify-center ${config.text} rounded-xl shadow-md border border-gray-300 dark:border-gray-600 animate-pulse relative overflow-hidden`}
          >
            <div
              className={`${config.textInnerHeight} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-400 dark:via-gray-300 dark:to-gray-400 ${config.textInner} rounded-lg border border-white/30`}
            />
            <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case "minimal":
      return <MinimalLoader />;
    case "detailed":
      return <DetailedLoader />;
    default:
      return <DefaultLoader />;
  }
}

// Export types for external use
export type { LoaderProps, SizeConfig, SizeConfigMap };
