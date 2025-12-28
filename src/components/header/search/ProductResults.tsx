"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { searchProps } from "@/lib/action";

interface ProductResultsProps {
  products: searchProps[];
  searchQuery: string;
  onClose?: () => void;
}

const ProductResults: React.FC<ProductResultsProps> = ({
  products,
  searchQuery,
  onClose,
}) => {
  console.log(products[0]);

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No products found for &quot;{searchQuery}&quot;
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${encodeURIComponent(product.category)}/${product.id}`}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            {product.bigimageUrl && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={product.bigimageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-16 text-gray-900 dark:text-white">
                {product.name}
              </h4>
              <p className="text-14 text-gray-500 dark:text-gray-400">
                Category: {product.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {product.numSearch} searches
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductResults;
