import { BlogProps } from "@/lib/action";
import { lang } from "@/lib/action/uploadimage";
import Image from "next/image";
import React from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { LuTimer } from "react-icons/lu";

const BlogRow = ({
  item,
  type,
}: {
  item: BlogProps;
  type?: "blog_single_page";
}) => {
  const l = lang().startsWith("ar") || lang().startsWith("ku");
  return (
    <div
      className={`w-full text-left h-[160px] md:h-[180px] flex-row-reverse flex items-center 
                  border border-gray-200 dark:border-gray-700 overflow-hidden rounded-2xl group 
                  bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 
                  transform hover:-translate-y-1 justify-start gap-0`}
    >
      {/* Image Container */}
      <div className="relative min-w-[140px] md:min-w-[180px] max-w-[140px] md:max-w-[180px] 
                      h-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={240}
          height={156}
          className="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent 
                        to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-full px-4 md:px-6 py-4 h-full justify-between">
        {/* Title */}
        <h3
          className={`lg:text-lg md:text-base text-sm font-bold text-gray-900 dark:text-gray-100 
                      line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 
                      transition-colors duration-300 leading-tight`}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          className={`min-h-[40px] max-h-[50px] md:min-h-[45px] md:max-h-[55px] 
                      text-xs md:text-sm dark:text-gray-400 overflow-hidden mt-2 
                      text-gray-600 line-clamp-2 leading-relaxed`}
        >
          {item.description}
        </p>

        {/* Metadata Section */}
        <div className="flex mt-3 md:mt-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <MdOutlineDateRange
                className={`text-gray-500 dark:text-gray-400 ${
                  type === "blog_single_page" && "lg:w-[15px] lg:h-[15px]"
                } w-4 h-4`}
              />
              <span
                className={`${
                  type === "blog_single_page" && "lg:text-xs md:text-sm"
                } text-xs md:text-sm text-gray-500 dark:text-gray-400`}
              >
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuTimer className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">3 min</span>
            </div>
          </div>
          <Image
            src={"/save-2.svg"}
            alt="Save icon"
            width={20}
            height={20}
            className={`${
              type === "blog_single_page" && "lg:w-[15px] lg:h-[15px]"
            } opacity-0 group-hover:opacity-100 w-5 h-5 transition-all duration-300 
            cursor-pointer hover:scale-110`}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogRow;
