"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoChevronBack } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import NewProducts from "./NewProducts";
import { newProdcuts } from "@/util/data";
import { ProductFormInput } from "@/lib/action";
import { Loader } from "@/app/[locale]/loader";
import { useUser } from "@clerk/nextjs";
import { getAllItemNames } from "@/lib/action/fovarit";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Observer } from "gsap/dist/Observer";

const ForProducts = ({
  products,
  load,
  title,
}: {
  load?: boolean;
  products?: ProductFormInput[];
  title?: "dashboard" | "viewAll";
}) => {
  const [startProducts, setStartProducts] = useState(0);
  const [pro, setpro] = useState<ProductFormInput[]>(products);
  const [limit, setLimit] = useState(5);
  const [favoriteId, setfavoriteId] = useState<string[]>();
  const { user } = useUser();

  const containerRef = useRef(null);
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
  ``;
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

  return (
    <div
      ref={containerRef}
      className="mt-3 w-full md:flex-wrap overflow-hidden sm:flex grid grid-cols-2 bg-blue-10 gap-2 md:gap-6 relative justify-center items-center"
    >
      {pro &&
        pro
          .slice(
            !title ? startProducts : 0,
            !title ? startProducts + limit : products.length
          )
          .map((product, index) => (
            <div
              key={product.id || index}
              ref={(el): any => (productRefs.current[index] = el)}
              className={`${index === 4 && "hidden sm:block"} py-2 md:py-6 product-item`}
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
                          : { ...item, numberFavorite: item.numberFavorite + 1 }
                      );
                    });
                    setfavoriteId((pre) => [product.id, ...pre]);
                  }}
                  deleteFavoriteId={() => {
                    setpro((pre) =>
                      pre.map((item) =>
                        item.id !== product.id
                          ? item
                          : { ...item, numberFavorite: item.numberFavorite - 1 }
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
  );
};

export default ForProducts;
