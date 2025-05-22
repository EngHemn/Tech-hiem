"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { getFireBase } from "@/lib/action/uploadimage";
import { catagoryProps } from "@/lib/action";
import { Skeleton } from "../ui/skeleton";
import useFilterProducts from "@/lib/store/filterProducts";
import gsap from "gsap";

const CatagoryProducts = ({}: {}) => {
  const { setCategory, category: selected, resetAll } = useFilterProducts();

  const [category, setcategory] = useState<catagoryProps[]>([]);
  const [loadCategory, setloadCategory] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      // console.log("header products aaaaa");
      const cate: catagoryProps[] = await getFireBase("category");
      // console.log(cate[0]);
      setloadCategory(false);
      setcategory(cate);
      // console.log(selected, cate);
    };
    getdata();
  }, [selected]);
  const fadeInUp = {
    initial: { opacity: 0, translateY: 50 },
    whileInView: { opacity: 1, translateY: 0 },
    transition: { duration: 0.5 },
  };
  if (loadCategory)
    return (
      <div className="flex w-full justify-center gap-4">
        {" "}
        <CategorySkeleton />
      </div>
    );
  return (
    <div className="flex lg:gap-4 md:gap-3 py-3 gap-2 overflow-x-auto sm:overflow-hidden sm:flex-wrap justify-start sm:justify-center items-center w-full">
      {category.map((item: any, index) => (
        <motion.div
          initial={{
            translateY: index % 2 === 0 ? 80 : -80,
          }}
          animate={{ translateY: 0 }}
          whileTap={{ scale: 0.9 }} // Ensure active scaling works
          key={item.name}
          onClick={() => {
            resetAll();

            setCategory(item.name);
          }}
          className={`${
            item.name.trim() === selected.trim()
              ? "shadow-secondary-200 text-secondary dark:shadow-secondary shadow-md rounded-sm border-secondary"
              : "shadow-slate-100 shadow-lg dark:shadow-secondary rounded-sm"
          } flex min-w-[120px] active:scale-[0.55] active:bg-gray-300 text-center border flex-col dark:bg-neutral-200 hover:bg-slate-50 md:hover:scale-[1.1] px-3 py-1 duration-100 transition-all cursor-pointer items-center justify-center gap-2`}
        >
          <div className="text-16 flex justify-center items-center dark:text-black gap-2 w-full text-center">
            {item.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
{
  /* <Image
  src={item.image.link}
  alt="image"
  width={20}
  height={20}
  className="w-6 md:min-w-[25px] md:min-h-[25px] h-6"
/> */
}

const CategorySkeleton = () => {
  const skeletonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!skeletonRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        ".skeleton-item",
        {
          opacity: 0,
          scale: 0.8,
          rotateY: -20,
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.1,
        }
      );

      // Continuous shimmer animation
      gsap.to(".skeleton-shimmer", {
        x: "200%",
        duration: 1.5,
        repeat: -1,
        ease: "power2.inOut",
      });

      // Breathing animation
      gsap.to(".skeleton-item", {
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.2,
      });
    }, skeletonRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={skeletonRef} className="flex w-full justify-center gap-4 px-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="skeleton-item relative h-[60px] w-[120px] bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden"
        >
          <div className="absolute inset-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-500 rounded-xl" />
          <div className="skeleton-shimmer absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full" />

          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div
            className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      ))}
    </div>
  );
};
export default CatagoryProducts;
