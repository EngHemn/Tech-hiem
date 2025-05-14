"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GrFormNextLink } from "react-icons/gr";
import { IoArrowBackOutline } from "react-icons/io5";
import NewProducts from "./NewProducts";
import { Loader } from "@/app/[locale]/loader";
import { getAllItemNames } from "@/lib/action/fovarit";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getProductsBYDiscountAndCategoryAndSale } from "@/lib/action/dashboard";
import { queryClient } from "@/app/[locale]/ClientProviders";
// Import GSAP and plugins
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    CustomEase,
    MorphSVGPlugin,
    SplitText,
    DrawSVGPlugin
  );

  // Create custom eases for more dynamic animations
  CustomEase.create("bounce", "0.175, 0.885, 0.32, 1.275");
  CustomEase.create("elastic", "0.64, 0.57, 0.67, 1.53");
  CustomEase.create("superSine", ".47,.76,.47,1.25");
}

const Sales = () => {
  const { user } = useUser();
  const t = useTranslations("sales");
  const [start, setStart] = useState(0);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  // Enhanced ref structure for granular animation control
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const shapeRef = useRef(null);
  const productsRef = useRef(null);
  const navRef = useRef(null);

  // Additional refs for more complex animations
  const productItemRefs = useRef([]);
  const bgLayerRef = useRef(null);
  const titleCharRefs = useRef([]);
  const hoverEffectsRef = useRef(null);

  // Store animation timelines to control them later
  const masterTimeline = useRef(null);
  const productTimeline = useRef(null);
  const hoverTimelines = useRef({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["sale"],
    queryFn: async () => {
      try {
        const getAllid = (await getAllItemNames(user?.id)) || [];
        const getdata =
          (await getProductsBYDiscountAndCategoryAndSale({
            category: "",
            col: "discount",
          })) || [];
        return { products: getdata, favoriteId: getAllid };
      } catch (err) {
        console.error("Error fetching data:", err);
        return { products: [], favoriteId: [] };
      }
    },
  });

  // Safe access to data
  const products = data?.products || [];
  const favoriteIds = data?.favoriteId || [];

  // Initialize complex GSAP animations
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || isLoading)
      return;
    if (animationsInitialized) return;

    const ctx = gsap.context(() => {
      // Create master timeline to orchestrate all animations
      masterTimeline.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      // Create dynamic 3D perspective effect for container
      gsap.set(containerRef.current, {
        perspective: 1000,
        transformStyle: "preserve-3d",
      });

      // Create a decorative background animation layer
      if (!bgLayerRef.current) {
        const bgLayer = document.createElement("div");
        bgLayer.className = "absolute inset-0 overflow-hidden z-0";

        // Create multiple decorative elements
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement("div");
          particle.className = "absolute rounded-full";
          particle.style.width = `${Math.random() * 30 + 10}px`;
          particle.style.height = particle.style.width;
          particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`;
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          bgLayer.appendChild(particle);

          // Animate each particle
          gsap.to(particle, {
            x: `${Math.random() * 200 - 100}`,
            y: `${Math.random() * 200 - 100}`,
            opacity: Math.random() * 0.5 + 0.2,
            scale: Math.random() * 2 + 0.5,
            duration: Math.random() * 15 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 5,
          });
        }

        containerRef.current.prepend(bgLayer);
        bgLayerRef.current = bgLayer;
      }

      // Create a ripple effect that emanates from the container center
      const createRippleEffect = () => {
        const ripple = document.createElement("div");
        ripple.className =
          "absolute rounded-full bg-white/10 pointer-events-none";
        ripple.style.width = "10px";
        ripple.style.height = "10px";
        ripple.style.left = "50%";
        ripple.style.top = "50%";
        ripple.style.transform = "translate(-50%, -50%)";
        containerRef.current.appendChild(ripple);

        gsap.to(ripple, {
          scale: 50,
          opacity: 0,
          duration: 3,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        });
      };

      // Trigger ripple effect periodically
      const rippleInterval = setInterval(createRippleEffect, 5000);

      // Split title text for character-by-character animation if SplitText is available
      if (titleRef.current) {
        try {
          const splitTitle = new SplitText(titleRef.current, {
            type: "chars,words",
          });
          titleCharRefs.current = splitTitle.chars;

          // Staggered entrance for title characters
          masterTimeline.current.fromTo(
            titleCharRefs.current,
            {
              y: -100,
              opacity: 0,
              rotationX: -90,
              transformOrigin: "50% 50% -20",
            },
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 1.2,
              stagger: 0.05,
              ease: "elastic",
            },
            0.3
          );

          // Add a continuous wave animation to the characters
          const waveTimeline = gsap.timeline({
            repeat: -1,
            delay: 2,
          });

          titleCharRefs.current.forEach((char, index) => {
            waveTimeline
              .to(
                char,
                {
                  y: -10,
                  duration: 0.4,
                  ease: "sine.inOut",
                },
                index * 0.05
              )
              .to(
                char,
                {
                  y: 0,
                  duration: 0.4,
                  ease: "sine.inOut",
                },
                index * 0.05 + 0.4
              );
          });
        } catch (e) {
          // Fallback animation if SplitText fails
          masterTimeline.current.fromTo(
            titleRef.current,
            { y: -50, opacity: 0, scale: 0.8 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "elastic" },
            0.3
          );
        }
      } else {
        // Fallback animation if SplitText is not available
        masterTimeline.current.fromTo(
          titleRef.current,
          { y: -50, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: "elastic" },
          0.3
        );
      }

      // Add 3D rotation to container based on mouse position
      const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate rotation angles
        const rotateY = ((mouseX - centerX) / rect.width) * 5; // Max 5 degrees
        const rotateX = ((centerY - mouseY) / rect.height) * 5; // Max 5 degrees

        gsap.to(containerRef.current, {
          rotationY: rotateY,
          rotationX: rotateX,
          duration: 0.5,
          ease: "power1.out",
        });
      };

      document.addEventListener("mousemove", handleMouseMove);

      // Animate shape with complex movement
      if (shapeRef.current) {
        masterTimeline.current.fromTo(
          shapeRef.current,
          {
            x: -200,
            y: -100,
            opacity: 0,
            rotation: -30,
            scale: 0.5,
          },
          {
            x: 0,
            y: 0,
            opacity: 0.8,
            rotation: 0,
            scale: 1,
            duration: 1.5,
            ease: "elastic",
          },
          0
        );

        // Create floating animation with random movement
        gsap.to(shapeRef.current, {
          x: "+=20",
          y: "+=15",
          rotation: "+=5",
          scale: 1.05,
          duration: 8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true, // Changes the values slightly on each repeat
        });

        // Add subtle color pulse
        if (shapeRef.current.style) {
          gsap.to(shapeRef.current, {
            filter: "hue-rotate(30deg) brightness(1.1)",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }

      // Subtlitle animation with bounce and glow
      if (subtitleRef.current) {
        masterTimeline.current.fromTo(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.8,
            textShadow: "0 0 0 rgba(255,255,255,0)",
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            textShadow:
              "0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(100,200,255,0.3)",
            duration: 0.8,
            ease: "bounce",
          },
          0.8
        );

        // Subtle breathing animation for subtitle
        gsap.to(subtitleRef.current, {
          textShadow:
            "0 0 15px rgba(255,255,255,0.7), 0 0 25px rgba(100,200,255,0.5)",
          scale: 1.05,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Button animation with complex effects
      if (buttonRef.current) {
        masterTimeline.current.fromTo(
          buttonRef.current,
          {
            scale: 0.5,
            opacity: 0,
            rotation: -10,
            boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
            duration: 0.8,
            ease: "elastic",
          },
          1.2
        );

        // Subtle bounce and glow animation
        gsap.to(buttonRef.current, {
          y: -7,
          boxShadow: "0 10px 25px rgba(59, 130, 246, 0.9)",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "superSine",
        });

        // Add hover effect
        buttonRef.current.addEventListener("mouseenter", () => {
          gsap.to(buttonRef.current, {
            scale: 1.1,
            backgroundColor: "#1c64f2", // Brighter blue
            boxShadow:
              "0 0 30px rgba(59, 130, 246, 0.9), 0 0 60px rgba(59, 130, 246, 0.4)",
            duration: 0.3,
          });

          // Create quick pulse effect on hover
          const buttonPulse = document.createElement("div");
          buttonPulse.className =
            "absolute inset-0 rounded-lg bg-white/30 pointer-events-none";
          buttonRef.current.style.position = "relative";
          buttonRef.current.appendChild(buttonPulse);

          gsap.to(buttonPulse, {
            scale: 1.5,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => buttonPulse.remove(),
          });
        });

        buttonRef.current.addEventListener("mouseleave", () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            backgroundColor: "#3b82f6", // Back to original
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
            duration: 0.3,
          });
        });
      }

      // Navigation animation with staggered effects
      if (navRef.current) {
        const navButtons = navRef.current.querySelectorAll("button");

        masterTimeline.current.fromTo(
          navButtons,
          {
            y: 30,
            opacity: 0,
            scale: 0.5,
            rotation: (index) => index * 180, // Different rotation for each button
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "elastic",
          },
          1.6
        );

        // Create hover effects for nav buttons
        navButtons.forEach((button, index) => {
          // Create a unique hover animation for each button
          button.addEventListener("mouseenter", () => {
            gsap.to(button, {
              scale: 1.3,
              backgroundColor: "rgba(255,255,255,0.2)",
              rotation: index === 0 ? -15 : 15, // Different rotation based on button
              duration: 0.3,
              ease: "power2.out",
            });

            // Add spark effect
            const sparks = [];
            for (let i = 0; i < 5; i++) {
              const spark = document.createElement("div");
              spark.className =
                "absolute rounded-full bg-white/80 pointer-events-none";
              spark.style.width = "3px";
              spark.style.height = "3px";
              button.appendChild(spark);
              sparks.push(spark);

              gsap.fromTo(
                spark,
                {
                  x: 0,
                  y: 0,
                  scale: 0.5,
                  opacity: 1,
                },
                {
                  x: `${Math.random() * 60 - 30}`,
                  y: `${Math.random() * 60 - 30}`,
                  scale: 0,
                  opacity: 0,
                  duration: 0.6 + Math.random() * 0.4,
                  ease: "power2.out",
                  onComplete: () => spark.remove(),
                }
              );
            }
          });

          button.addEventListener("mouseleave", () => {
            gsap.to(button, {
              scale: 1,
              backgroundColor: "transparent",
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });
      }

      // Master container animation with 3D effect
      masterTimeline.current.fromTo(
        containerRef.current,
        {
          y: 100,
          opacity: 0,
          rotationX: 15,
          boxShadow: "0 0 0 rgba(0, 0, 50, 0)",
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          boxShadow: "0 20px 50px rgba(0, 0, 50, 0.3)",
          duration: 1.2,
          ease: "power3.out",
        },
        0
      );

      // Add scroll-triggered animations
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          onEnter: () => masterTimeline.current.play(0),
          once: true,
        });

        // Add parallax effect to the shape
        if (shapeRef.current) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.to(shapeRef.current, {
                x: progress * 50,
                y: progress * -30,
                duration: 0.1,
                overwrite: true,
              });
            },
          });
        }
      } else {
        // If ScrollTrigger is not available, just play the timeline
        masterTimeline.current.play(0);
      }

      // Clean up function to remove all event listeners and intervals
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        clearInterval(rippleInterval);
      };
    }, containerRef);

    setAnimationsInitialized(true);

    return () => {
      ctx.revert();
      if (masterTimeline.current) masterTimeline.current.kill();
      if (productTimeline.current) productTimeline.current.kill();
    };
  }, [isLoading]);

  // Products animation effect with staggered card reveals
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      isLoading ||
      !productsRef.current ||
      !products.length
    )
      return;

    const ctx = gsap.context(() => {
      // Clear any existing product timeline
      if (productTimeline.current) {
        productTimeline.current.kill();
      }

      // Create new timeline for products
      productTimeline.current = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Get all product items
      const productItems = productsRef.current.children;

      // Reset products for animation
      gsap.set(productItems, { clearProps: "all" });

      // Complex staggered entrance animation for products
      productTimeline.current.fromTo(
        productItems,
        {
          y: 80,
          x: (i) => (i % 2 === 0 ? -30 : 30), // Alternating x positions
          opacity: 0,
          rotationY: (i) => (i % 2 === 0 ? -30 : 30), // Alternating rotations
          transformOrigin: "50% 50% -50",
          scale: 0.8,
          filter: "blur(10px)",
        },
        {
          y: 0,
          x: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: {
            each: 0.15,
            from: "center",
          },
          ease: "elastic",
        }
      );

      // Add hover effects to product items
      Array.from(productItems).forEach((item: any, index) => {
        // Create hover effect
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            y: -15,
            scale: 1.05,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            zIndex: 10,
            duration: 0.3,
            ease: "power2.out",
          });

          // Create subtle glow effect behind the product
          const glow = document.createElement("div");
          glow.className =
            "absolute inset-0 rounded-lg bg-gradient-to-t from-blue-500/30 to-transparent -z-10";
          item.style.position = "relative";
          item.appendChild(glow);

          gsap.fromTo(
            glow,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4 }
          );
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            y: 0,
            scale: 1,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            zIndex: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          // Remove glow
          const glow = item.querySelector(".rounded-lg.bg-gradient-to-t");
          if (glow) {
            gsap.to(glow, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => glow.remove(),
            });
          }
        });
      });
    }, productsRef);

    return () => ctx.revert();
  }, [products, start, isLoading]);

  // Enhanced navigation button animations
  const handleNextClick = () => {
    if (!products || products.length === 0) return;

    // Enhanced animation for product transition
    if (productsRef.current && productsRef.current.children.length > 0) {
      const productItems = productsRef.current.children;

      // Complex exit animation
      gsap.to(productItems, {
        x: (i) => -50 - i * 15, // Cascading x movement
        y: (i) => Math.sin(i) * 20, // Sine wave pattern
        opacity: 0,
        scale: 0.8,
        rotationY: -45,
        filter: "blur(8px)",
        stagger: 0.05,
        duration: 0.4,
        onComplete: () => {
          setStart((prev) => (prev >= products.length - 4 ? prev : prev + 1));
        },
      });
    } else {
      setStart((prev) => (prev >= products.length - 4 ? prev : prev + 1));
    }
  };

  const handlePrevClick = () => {
    if (!products || products.length === 0) return;

    // Enhanced animation for product transition
    if (productsRef.current && productsRef.current.children.length > 0) {
      const productItems = productsRef.current.children;

      // Complex exit animation
      gsap.to(productItems, {
        x: (i) => 50 + i * 15, // Cascading x movement
        y: (i) => Math.sin(i) * 20, // Sine wave pattern
        opacity: 0,
        scale: 0.8,
        rotationY: 45,
        filter: "blur(8px)",
        stagger: 0.05,
        duration: 0.4,
        onComplete: () => {
          setStart((prev) => (prev === 0 ? 0 : prev - 1));
        },
      });
    } else {
      setStart((prev) => (prev === 0 ? 0 : prev - 1));
    }
  };

  if (error) return <h1>{error.message}</h1>;

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:max-w-[1200px] sm:flex-row rounded-2xl overflow-hidden dark:bg-primary-700 bg-primary-500 h-full w-full py-3 pb-7 px-3 items-center justify-center shadow-blue-950 shadow-md relative sm:rounded-md text-white gap-4"
    >
      <Image
        src="/shape.png"
        width={400}
        height={400}
        alt="decorative shape"
        className="absolute left-0 z-0 -top-5"
        ref={shapeRef}
      />

      <div className="flex w-full sm:w-[20%] z-20 text-white items-center flex-col gap-3">
        <h1
          ref={titleRef}
          className="text-white text-center mt-8 font-bold text-29 sm:text-23"
        >
          {t("title")}
        </h1>
        <h2 ref={subtitleRef}>{t("button_shop_now")}</h2>
        <br />
        <button
          ref={buttonRef}
          className="mt-auto bg-blue-500 z-30 sm:hover:bg-blue-700 text-white mb-3 font-bold py-2 px-12 rounded-lg relative overflow-hidden"
        >
          <Link href="/viewAll?type=discount">{t("button_view_all")}</Link>
        </button>
      </div>

      {isLoading && (
        <div className="sm:grid w-full sm:w-[80%] gap-3 items-center flex overflow-x-auto sm:overflow-hidden sm:grid-cols-4 justify-start">
          <Loader />
          <Loader />
          <div className="hidden sm:flex">
            <Loader />
            <Loader />
          </div>
        </div>
      )}

      {!isLoading && data && (
        <div
          ref={productsRef}
          className="sm:grid w-full sm:w-[80%] gap-3 items-center flex overflow-x-auto sm:overflow-hidden sm:grid-cols-4 justify-start"
        >
          {data.products.slice(start, 4 + start).map((item) => (
            <NewProducts
              favoriteId={data.favoriteId}
              addFavoriteid={() => {
                queryClient.setQueryData(["sale"], (oldData: any) => {
                  return {
                    products: oldData.products.filter((itemp) =>
                      itemp.id !== item.id
                        ? itemp
                        : { ...itemp, numberFavorite: itemp.numberFavorite + 1 }
                    ),
                    favoriteId: [...oldData.favoriteId, item.id],
                  };
                });
              }}
              deleteFavoriteId={() => {
                queryClient.setQueryData(["sale"], (oldData: any) => {
                  return {
                    products: oldData.products.filter((itemp) =>
                      itemp.id !== item.id
                        ? itemp
                        : {
                            ...itemp,
                            numberFavorite: itemp.numberFavorite - 1,
                          }
                    ),
                    favoriteId: oldData.favoriteId.filter(
                      (prev) => prev !== item.id // Remove the product if it exists
                    ),
                  };
                });
              }}
              key={item.id || item.name}
              itemDb={item}
              title="sale"
            />
          ))}
        </div>
      )}

      <div
        ref={navRef}
        className="flex items-center gap-4 absolute bottom-1 right-3"
      >
        <button
          onClick={handlePrevClick}
          className="p-1 rounded-full hover:bg-slate-50/15 relative"
          aria-label="Previous products"
        >
          <IoArrowBackOutline color="white" className="scale-125" />
        </button>
        <button
          onClick={handleNextClick}
          className="p-1 rounded-full hover:bg-slate-50/15 relative"
          aria-label="Next products"
        >
          <GrFormNextLink color="white" className="scale-125" />
        </button>
      </div>
    </div>
  );
};

export default Sales;
