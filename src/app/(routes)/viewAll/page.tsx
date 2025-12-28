"use client";
import CatagoryProducts from "@/components/products/CatagoryProducts";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@/app/loader";
import { useTranslations } from "next-intl";
import ForProducts from "@/components/home/ForProducts";
import { useQuery } from "@tanstack/react-query";
import { getProductsBYDiscountAndCategoryAndSale } from "@/lib/action/dashboard";
import useFilterProducts from "@/lib/store/filterProducts";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
const Page = () => {
  const [type, setType] = useState<string | null>(null);
  const { category } = useFilterProducts();
  const t = useTranslations("viewAll");

  // Get type from URL params safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setType(params.get("type"));
    }
  }, []);

  // GSAP refs
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const productsRef = useRef(null);
  const errorRef = useRef(null);
  const loadingRef = useRef(null);

  const {
    data: products,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", category, type],
    queryFn: async () => {
      try {
        const getProducts = await getProductsBYDiscountAndCategoryAndSale({
          category: category,
          col: type ? type : "date",
        });
        console.log(getProducts[0]);
        return getProducts || [];
      } catch (error) {
        console.error("Failed to fetch products:", error);
        throw new Error("Failed to load products. Please try again.");
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, categoryRef.current], {
        opacity: 0.9,
        y: 50,
      });

      // Animate container on mount
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.9 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        }
      );

      // Animate title and category
      gsap.to([titleRef.current, categoryRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate products when they load
  useEffect(() => {
    if (!isLoading && products && productsRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          productsRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          }
        );
      }, productsRef);

      return () => ctx.revert();
    }
  }, [isLoading, products]);

  // Animate loading states
  useEffect(() => {
    if (isLoading && loadingRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          loadingRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
          }
        );
      }, loadingRef);

      return () => ctx.revert();
    }
  }, [isLoading]);

  // Animate error state
  useEffect(() => {
    if (isError && errorRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          errorRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        );
      }, errorRef);

      return () => ctx.revert();
    }
  }, [isError]);

  const handleRetry = () => {
    // Animate out error message before retry
    if (errorRef.current) {
      gsap.to(errorRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => refetch(),
      });
    } else {
      refetch();
    }
  };

  const getTitle = () => {
    if (type === "New") return "last7NewProducts";
    if (type === "discount") return "last4DiscountProducts";
    return "last7NumberSaleProducts";
  };

  const getProductCount = () => {
    if (isLoading) return "30";
    if (!products) return "0";
    return products.length < 30 ? products.length.toString() : "30";
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center w-full py-4 sm:py-8 gap-4 sm:gap-6 justify-center flex-col min-h-screen  dark:bg-gray-900"
    >
      {/* Header Section */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        <h1
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6"
        >
          {t("last")} {getProductCount()} {t(getTitle())}
        </h1>

        <div ref={categoryRef} className="w-full">
          <CatagoryProducts />
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
          <div
            ref={errorRef}
            className="flex flex-col items-center justify-center gap-4 my-8 sm:my-12 p-6 sm:p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 shadow-lg"
          >
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">
                {t("error.title") || "Oops! Something went wrong"}
              </h2>
              <p className="text-red-600 dark:text-red-300 mb-6 text-sm sm:text-base">
                {error?.message || "Failed to load products. Please try again."}
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {t("error.retry") || "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
          <div
            ref={loadingRef}
            className="flex flex-col items-center justify-center gap-4 my-8 sm:my-12"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Loader />
              <Loader />
              <Loader />
              <Loader />
            </div>
            <p className="text-gray-600 dark:text-gray-400 animate-pulse text-sm sm:text-base">
              {t("loading") || "Loading products..."}
            </p>
          </div>
        </div>
      )}

      {/* Products Content */}
      {!isLoading && !isError && (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
          {products && products.length > 0 ? (
            <div ref={productsRef} className="w-full">
              <ForProducts
                load={false}
                products={products}
                title="viewAll"
                displayAsColumns={true}
              />
            </div>
          ) : products && products.length === 0 ? (
            <div
              ref={productsRef}
              className="flex flex-col items-center justify-center my-12 sm:my-16 p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
                {t("noProducts.title") || "No Products Found"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base max-w-md">
                {t("noProducts.description") ||
                  "We couldn't find any products matching your criteria. Try selecting a different category."}
              </p>
            </div>
          ) : (
            <div
              ref={productsRef}
              className="flex flex-col items-center justify-center my-12 sm:my-16 p-8 sm:p-12"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400 text-center">
                {t("message")}
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
