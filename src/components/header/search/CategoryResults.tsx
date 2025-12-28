"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchCategoryProps } from "@/lib/action";

interface CategoryResultsProps {
  categories: SearchCategoryProps[];
  searchQuery: string;
  onClose?: () => void;
}

const CategoryResults: React.FC<CategoryResultsProps> = ({
  categories,
  searchQuery,
  onClose,
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No categories found for &quot;{searchQuery}&quot;
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products/${encodeURIComponent(category.name)}`}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            {category.image?.link && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={category.image.link}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-16 text-gray-900 dark:text-white">
                {category.name}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {category.numberOfSearches} searches
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryResults;
