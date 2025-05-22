"use client";
import CatagoryProducts from "@/components/products/CatagoryProducts";
import React, { useEffect, useRef } from "react";
import { Loader } from "@/app/[locale]/loader";
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
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const { category } = useFilterProducts();
  const t = useTranslations("viewAll");

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
      className="flex items-center w-full py-8 gap-3 justify-center flex-col"
    >
      <h1
        ref={titleRef}
        className="self-start px-3 dark:text-gray-600 text-26 sm:text-30 my-3 font-semibold"
      >
        {t("last")} {getProductCount()} {t(getTitle())}
      </h1>

      <div ref={categoryRef}>
        <CatagoryProducts />
      </div>

      {/* Error State */}
      {isError && (
        <div
          ref={errorRef}
          className="flex flex-col items-center justify-center gap-4 my-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
              {t("error.title") || "Oops! Something went wrong"}
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {error?.message || "Failed to load products. Please try again."}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              {t("error.retry") || "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div
          ref={loadingRef}
          className="flex flex-col items-center justify-center gap-4 my-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Loader />
            <Loader />
            <Loader />
            <Loader />
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">
            {t("loading") || "Loading products..."}
          </p>
        </div>
      )}

      {/* Products Content */}
      {!isLoading && !isError && (
        <>
          {!category && products && products.length > 0 ? (
            <div ref={productsRef} className="w-full">
              <ForProducts load={false} products={products} title="viewAll" />
            </div>
          ) : !category && products && products.length === 0 ? (
            <div
              ref={productsRef}
              className="flex flex-col items-center justify-center my-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                {t("noProducts.title") || "No Products Found"}
              </h2>
              <p className="text-gray-500 dark:text-gray-500 text-center">
                {t("noProducts.description") ||
                  "We couldn't find any products matching your criteria."}
              </p>
            </div>
          ) : (
            <h1
              ref={productsRef}
              className="text-30 font-black my-[200px] text-gray-600 dark:text-gray-400"
            >
              {t("message")}
            </h1>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
