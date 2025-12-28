"use client";
import React, { useEffect, useState, useRef } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { IoArrowBackOutline } from "react-icons/io5";
import NewProducts from "./NewProducts";
import { ProductFormInput } from "@/lib/action";
import { Loader } from "@/app/loader";
import { useUser } from "@clerk/nextjs";
import { getAllItemNames } from "@/lib/action/fovarit";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Observer } from "gsap/dist/Observer";

const ForProducts = ({
  products,
  load,
  title,
  displayAsColumns = false,
}: {
  load?: boolean;
  products?: ProductFormInput[];
  title?: "dashboard" | "viewAll";
  displayAsColumns?: boolean;
}) => {
  const [startProducts, setStartProducts] = useState(0);
  const [pro, setpro] = useState<ProductFormInput[]>(products);
  const [limit, setLimit] = useState(5);
  const [favoriteId, setfavoriteId] = useState<string[]>();
  const { user } = useUser();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef([]);

  // Register GSAP plugins
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger, Observer);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1300) {
        setLimit(4);
      } else {
        setLimit(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const getdata = async () => {
      const data = await getAllItemNames(user?.id);
      setfavoriteId(data as string[]);
    };
    getdata();
  }, [user]);

  useEffect(() => {
    if (!load && pro?.length > 0) {
      const ctx = gsap.context(() => {
        gsap.set(productRefs.current, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotation: -2,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            // start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(productRefs.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.7)",
          stagger: {
            amount: 0.6,
            from: "start",
          },
        });

        // Hover animations
        const cleanupFns: (() => void)[] = [];

        productRefs.current.forEach((product) => {
          if (!product) return;

          // Create GSAP Observer for pointer movement
          Observer.create({
            target: product,
            type: "pointer",
            onMove: (self) => {
              const bounds = self.target.getBoundingClientRect();
              const centerX = bounds.left + bounds.width / 2;
              const centerY = bounds.top + bounds.height / 2;
              const distanceX = (self.x - centerX) / 20;
              const distanceY = (self.y - centerY) / 20;

              gsap.to(self.target, {
                // rotationY: -distanceX,
                // rotationX: distanceY,
                // boxShadow: `${distanceX * 0.5}px ${distanceY * 0.5}px 20px rgba(0, 0, 0, 0.15)`,
                // duration: 0.5,
                // ease: "power2.out",
              });
            },
          });

          // Add mouseleave event to reset on hover leave
          const handleLeave = () => {
            gsap.to(product, {
              // rotationY: 0,
              // rotationX: 0,
              // boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
              // duration: 0.8,
              // ease: "elastic.out(1, 0.7)",
            });
          };

          product.addEventListener("mouseleave", handleLeave);

          // Push cleanup function for this product
          cleanupFns.push(() => {
            product.removeEventListener("mouseleave", handleLeave);
          });
        });

        // Cleanup when component unmounts
        return () => {
          cleanupFns.forEach((fn) => fn());
        };
      }, containerRef);

      return () => ctx.revert();
    }
  }, [load, pro]);

  // Reset refs when products change
  useEffect(() => {
    productRefs.current = productRefs.current.slice(0, pro?.length || 0);
  }, [pro]);

  if (load)
    return (
      <div className="flex mt-4 px-3 py-8 justify-center w-full items-center gap-4">
        <Loader />
        <Loader />
        <div className="hidden sm:flex w-full items-center justify-center gap-2">
          <Loader />
          <Loader />
        </div>
      </div>
    );

  // Don't show scroll buttons for dashboard or viewAll pages, or when displaying as columns
  const showScrollButtons = !title && !displayAsColumns;

  return (
    <div ref={containerRef} className="mt-3 w-full relative">
      {/* Products Container - Row or Column Layout */}
      <div
        ref={scrollContainerRef}
        className={
          displayAsColumns
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-4"
            : "flex overflow-x-auto scrollbar-hide gap-2 md:gap-6 pb-4 scroll-smooth"
        }
        style={
          displayAsColumns
            ? {}
            : {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }
        }
      >
        {pro &&
          pro.map((product, index) => (
            <div
              key={product.id || index}
              ref={(el): any => (productRefs.current[index] = el)}
              className={
                displayAsColumns
                  ? `py-2 md:py-6 product-item`
                  : `flex-shrink-0 py-2 md:py-6 product-item ${
                      index === 4 && "hidden sm:block"
                    }`
              }
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <div
                className="product-content"
                style={{ transformStyle: "preserve-3d" }}
              >
                <NewProducts
                  favoriteId={favoriteId}
                  title={title ? title : "single_product"}
                  itemDb={product}
                  addFavoriteid={() => {
                    setpro((pre) => {
                      return pre.filter((item) =>
                        item.id !== product.id
                          ? item
                          : {
                              ...item,
                              numberFavorite: item.numberFavorite + 1,
                            }
                      );
                    });
                    setfavoriteId((pre) => [product.id, ...pre]);
                  }}
                  deleteFavoriteId={() => {
                    setpro((pre) =>
                      pre.map((item) =>
                        item.id !== product.id
                          ? item
                          : {
                              ...item,
                              numberFavorite: item.numberFavorite - 1,
                            }
                      )
                    );
                    setfavoriteId((prev) =>
                      prev.includes(product.id)
                        ? prev.filter((itemid) => itemid !== product.id)
                        : [...prev, product.id]
                    );
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Scroll Navigation Buttons - Only show on home page */}
      {showScrollButtons && pro && pro.length > 0 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <IoArrowBackOutline className="text-gray-700 dark:text-gray-300 text-2xl" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <GrFormNextLink className="text-gray-700 dark:text-gray-300 text-2xl" />
          </button>
        </>
      )}

      {/* Hide scrollbar for webkit browsers - only when in row mode */}
      {!displayAsColumns && (
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      )}
    </div>
  );
};

export default ForProducts;
