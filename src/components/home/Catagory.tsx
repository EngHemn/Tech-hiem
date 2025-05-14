"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Catagory = () => {
  const t = useTranslations("category");
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  const catagory = [
    {
      name: t("accessories"),
      image: "/a.png",
      path: "accessoiries",
    },
    {
      name: t("camera"),
      image: "/c.png",
      path: "camera",
    },
    {
      name: t("laptop"),
      image: "/l.png",
      path: "laptop",
    },
    {
      name: t("smart Phone"),
      image: "/s.png",
      path: "smartPhone",
    },
    {
      name: t("gaming"),
      image: "/g.png",
      path: "gaming",
    },
    {
      name: t("smart Watch"),
      image: "/sw.png",
      path: "smartWatch",
    },
  ];

  const setItemRef = (el, index) => {
    itemsRef.current[index] = el;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {});

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    gsap.set(itemsRef.current, {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotation: -5,
    });

    itemsRef.current.forEach((item, index) => {
      const itemTl = gsap.timeline();

      itemTl
        .to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        })
        .to(
          item,
          {
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.3"
        )
        .fromTo(
          item.querySelector("img"),
          {
            opacity: 0,
            scale: 0.5,
            y: 20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .fromTo(
          item.querySelector("h3"),
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power1.out",
          },
          "-=0.1"
        );

      // Add this timeline to master timeline with staggered delay
      masterTl.add(itemTl, index * 0.15);
    });

    // Setup hover animations for each item
    itemsRef.current.forEach((item) => {
      // Create hover animation
      item.addEventListener("mouseenter", () => {
        gsap.to(item, {
          scale: 1.08,
          boxShadow: "0 10px 25px rgba(0, 145, 255, 0.2)",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(item.querySelector("img"), {
          scale: 1.1,
          rotation: 5,
          duration: 0.4,
          ease: "back.out(1.5)",
        });

        gsap.to(item.querySelector("h3"), {
          color: "#ff4d00",
          fontWeight: "bold",
          duration: 0.2,
        });
      });

      // Reset on mouse leave
      item.addEventListener("mouseleave", () => {
        gsap.to(item, {
          scale: 1,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.5,
          ease: "power1.inOut",
        });

        gsap.to(item.querySelector("img"), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power1.out",
        });

        gsap.to(item.querySelector("h3"), {
          color: "",
          fontWeight: "",
          duration: 0.2,
        });
      });
    });

    // Cleanup function
    return () => {
      // Kill all animations and ScrollTriggers created in this context
      ctx.revert();

      // Remove event listeners
      itemsRef.current.forEach((item) => {
        if (item) {
          item.removeEventListener("mouseenter", () => {});
          item.removeEventListener("mouseleave", () => {});
        }
      });
    };
  }, []);

  return (
    <ul
      ref={containerRef}
      className="flex overflow-x-auto w-full gap-2 px-1 xl:gap-6 items-center lg:gap-3 md:gap-2 py-6 sm:justify-center justify-start"
    >
      {catagory.map((item, index) => (
        <li
          ref={(el) => setItemRef(el, index)}
          key={item.path}
          className="2xl:w-[184px] min-w-[120px] dark:bg-neutral-900 dark:text-secondary-300 dark:border-secondary dark:shadow-secondary lg:w-[140px] md:w-[100px] duration-200 transition-all flex flex-col rounded-lg shadow-md border gap-4 border-slate-100 items-center justify-between md:px-2 lg:px-6 py-2"
        >
          <Image
            alt="image"
            src={item.image}
            width={148}
            height={148}
            className="sm:w-full sm:h-full w-[70px] h-[80px]"
          />
          <h3 className="capitalize lg:text-sm text-12 text-center md:text-10 w-full">
            {item.name}
          </h3>
        </li>
      ))}
    </ul>
  );
};

export default Catagory;
