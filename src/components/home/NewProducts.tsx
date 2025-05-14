"use client";
import React from "react";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ProductFormInput, Productsprops } from "@/lib/action";
import { Loader } from "@/app/[locale]/loader";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { addfavorite, deleteFavorite } from "@/lib/action/fovarit";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FileEdit } from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NewProducts = ({
  title,
  itemDb,
  load,
  favoriteId,
  addFavoriteid,
  deleteFavoriteId,
  deleteProducts,
}: {
  title?: string;
  itemDb?: ProductFormInput;
  load?: boolean;
  favoriteId?: string[];
  addFavoriteid?: () => void;
  deleteFavoriteId?: () => void;
  deleteProducts?: () => void;
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const router = useRouter();
  const product: ProductFormInput | undefined = itemDb;
  const { user } = useUser();

  if (load) return <Loader />;

  if (!product) return null;

  const isDashboard = title === "dashboard";
  const isSale = title === "sale";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => {
        router.push(
          isDashboard
            ? `/dashboard/Products/${product.id}`
            : `/products/${product.category}/${product.id}`
        );
      }}
      className={`
        group relative flex flex-col 
        overflow-hidden rounded-xl border
        transition-all duration-300 hover:shadow-xl
      h-full sm:h-full max-w-[250px] lg:min-w-[230px] lg:max-w-[230px] sm:w-full
        border-neutral-200 bg-white dark:border-secondary dark:bg-neutral-900
        dark:shadow-secondary-500 h dark:hover:shadow-secondary
        sm:p-3 sm:pb-4
      `}
    >
      {/* Favorite Button */}
      {user && user?.id && !isDashboard && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-all duration-200 dark:bg-neutral-800/80">
          {favoriteId && favoriteId.some((item) => item === product.id) ? (
            <FaHeart
              color="#f45e0c"
              size={20}
              className="transition-transform duration-200 hover:scale-110"
              onClick={(e) => {
                handleFavoriteClick(e);
                deleteFavorite(user?.id, product.numberFavorite, product.id);
                deleteFavoriteId && deleteFavoriteId();
              }}
            />
          ) : (
            <FaRegHeart
              color="#f45e0c"
              size={20}
              className="transition-transform duration-200 hover:scale-110"
              onClick={(e) => {
                handleFavoriteClick(e);
                addfavorite({
                  id: user.id,
                  item: {
                    name: product.name,
                    categroy: product.category,
                    price: product.price,
                    colors: product.colors,
                    id: product.id,
                    image: product.bigimageUrl,
                    numberFavorite: product.numberFavorite,
                  },
                });
                addFavoriteid && addFavoriteid();
              }}
            />
          )}
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full overflow-hidden rounded-lg">
        <div className="product-image-container overflow-hidden rounded-lg">
          <Image
            src={product.bigimageUrl}
            alt={product.name}
            width={200}
            height={200}
            className={`
              w-full rounded-lg object-cover bg-neutral-50 
              transition-all duration-300 group-hover:scale-105
              ${
                isSale
                  ? "above-405:h-[170px] min-h-[160px] max-h-[160px] sm:h-[180px]"
                  : "above-405:h-[190px] min-h-[190px] max-h-[190px] sm:h-[200px]"
              }
            `}
          />
        </div>

        {/* Discount Tag */}
        {product.isDiscount && product.discount && product.discount > 0 && (
          <div className="absolute left-2 top-2 z-[2] rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-xs font-medium text-white shadow-md">
            -{product.discount}%
          </div>
        )}

        {/* Color Options */}
        {product.colors && (
          <div className="absolute -right-1 top-10 hidden flex-col gap-1.5 sm:flex">
            {product.colors.slice(0, 3).map((color: any) => (
              <span
                key={color.name}
                className="h-4 w-4 rounded-full border border-white shadow-md"
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium shadow-md dark:bg-neutral-700">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-3 flex w-full flex-1 flex-col p-1 sm:p-0">
        <h3 className="mb-1 line-clamp-2 h-10 text-sm font-medium sm:text-base text-neutral-800 dark:text-neutral-200">
          {product.name}
        </h3>

        <div className="mt-auto flex w-full flex-col">
          {/* Price Section */}
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-base font-semibold text-neutral-900 dark:text-white">
              ${product.price}
            </span>
            {product.isDiscount && (
              <span className="text-xs line-through text-neutral-500 dark:text-neutral-400">
                $
                {product.discount &&
                  (
                    product.price +
                    product.discount * 0.01 * product.price
                  ).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewProducts;
