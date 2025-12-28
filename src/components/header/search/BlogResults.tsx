"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import ReactPlayer from "react-player";
import { SearchBlogsProps } from "@/lib/action";

interface BlogResultsProps {
  blogs: SearchBlogsProps[];
  searchQuery: string;
  onClose?: () => void;
}

const BlogResults: React.FC<BlogResultsProps> = ({
  blogs,
  searchQuery,
  onClose,
}) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No blogs found for &quot;{searchQuery}&quot;
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.id}`}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            {(blog.image || blog.video) && (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                {blog.image ? (
                  <>
                    <Image
                      src={blog.image}
                      alt={blog.name}
                      fill
                      className="object-cover"
                    />
                    {blog.video && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </>
                ) : blog.video ? (
                  <ReactPlayer
                    url={blog.video}
                    width="100%"
                    height="100%"
                    controls={false}
                    playing={false}
                    light={true}
                    className="w-full h-full"
                  />
                ) : null}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-16 text-gray-900 dark:text-white">
                {blog.name}
              </h4>
              {blog.description && (
                <p className="text-[14px] line-clamp-1 text-gray-500 dark:text-gray-400 mt-1">
                  {blog.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {blog.numberOfSearches} searches
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogResults;
