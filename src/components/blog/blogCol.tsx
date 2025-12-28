import Image from "next/image";
import React from "react";
import { LuTimer } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import { BlogProps } from "@/lib/action";
import { lang } from "@/lib/action/uploadimage";
import { motion } from "framer-motion";
const BlogCol = ({ blog }: { blog: BlogProps }) => {
  const formattedDate = new Date(blog.date).toLocaleDateString(); // Format date for better readability
  const l = lang().startsWith("ar") || lang().startsWith("ku");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="group flex border w-full  text-left flex-col gap-0 rounded-2xl overflow-hidden 
                 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300
                 transform hover:-translate-y-1"
    >
      {/* Image Container with Overlay */}
      <div className="relative w-full overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          width={350}
          height={200}
          className="w-full md:min-h-[230px] min-h-[170px] max-h-[170px] md:max-h-[230px] 
                     object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-3 p-4 md:p-5">
        {/* Metadata */}
        <div className="flex w-full items-center justify-between text-xs md:text-sm text-gray-500 dark:text-gray-400">
          <div className="flex gap-1.5 items-center">
            <MdOutlineDateRange className="w-3 h-3" />
            <time dateTime={blog.date.toISOString()} className="text-12">
              {formattedDate}
            </time>
          </div>
          <div className="flex gap-1.5 items-center">
            <LuTimer className="w-3 h-3" />
            <span className="text-12">3 min read</span>
          </div>
        </div>

        {/* Title */}
        <h2
          className="md:text-16 text-base capitalize font-bold text-gray-900 dark:text-gray-100 
                       line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 
                       transition-colors duration-300"
        >
          {blog.title}
        </h2>

        {/* Description */}
        <p
          className="text-gray-600 dark:text-gray-300 text-14 line-clamp-2 
                      leading-relaxed"
        >
          {blog.description}
        </p>
      </div>
    </motion.div>
  );
};

export default BlogCol;
