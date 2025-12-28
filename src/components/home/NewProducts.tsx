"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ProductFormInput, Productsprops } from "@/lib/action";
import { Loader } from "@/app/loader";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { addfavorite, deleteFavorite } from "@/lib/action/fovarit";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  FileEdit,
  Trash2,
  AlertTriangle,
  Package,
  AlertCircle,
} from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NewProducts = ({
  title,
  itemDb,
  load,
  favoriteId,
  addFavoriteid,
  deleteFavoriteId,
  deleteProducts,
  className,
}: {
  title?: string;
  itemDb?: ProductFormInput;
  load?: boolean;
  favoriteId?: string[];
  addFavoriteid?: () => void;
  deleteFavoriteId?: () => void;
  deleteProducts?: () => void;
  className?: string;
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const router = useRouter();
  const product: ProductFormInput | undefined = itemDb;
  const { user } = useUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (load) return <Loader />;

  if (!product) return null;

  const isDashboard = title === "dashboard";
  const isSale = title === "sale";

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/dashboard/AddItem?id=${product.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteProducts) {
      deleteProducts();
    }
    setShowDeleteDialog(false);
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // Stock warning logic
  const stock = product.stock ?? 0;
  const isLowStock = stock > 0 && stock < 12;
  const isOutOfStock = stock === 0;

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
        transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
        cursor-pointer
        w-[240px]
        border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
        shadow-sm hover:border-blue-300 dark:hover:border-blue-600
        ${isLowStock ? "ring-1 ring-amber-200 dark:ring-amber-800" : ""}
        ${isOutOfStock ? "opacity-75" : ""}
        ${className || ""}
      `}
    >
      {/* Low Stock Warning Badge */}
      {isLowStock && (
        <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 shadow-md backdrop-blur-sm">
          <AlertCircle className="h-3 w-3 text-white" />
          <span className="text-[10px] font-semibold text-white">
            Low Stock
          </span>
        </div>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 shadow-md backdrop-blur-sm">
          <AlertTriangle className="h-3 w-3 text-white" />
          <span className="text-[10px] font-semibold text-white">
            Out of Stock
          </span>
        </div>
      )}

      {/* Favorite Button */}
      {user && user?.id && !isDashboard && (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-1.5 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800">
          {favoriteId && favoriteId.some((item) => item === product.id) ? (
            <FaHeart
              color="#f45e0c"
              size={16}
              className="transition-transform duration-200 hover:scale-110"
              onClick={(e) => {
                handleFavoriteClick(e);
                deleteFavorite(
                  user?.id,
                  product.numberFavorite,
                  product.id,
                  user.fullName
                );
                deleteFavoriteId && deleteFavoriteId();
              }}
            />
          ) : (
            <FaRegHeart
              color="#f45e0c"
              size={16}
              className="transition-transform duration-200 hover:scale-110"
              onClick={(e) => {
                handleFavoriteClick(e);
                addfavorite({
                  id: user.id,
                  userName: user?.fullName,
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

      {/* Edit and Delete Buttons for Dashboard */}
      {isDashboard && (
        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1.5">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleEditClick}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white p-1.5 shadow-md backdrop-blur-md transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
            title="Edit Product"
          >
            <FileEdit size={14} />
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleDeleteClick}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white p-1.5 shadow-md backdrop-blur-md transition-all duration-200 dark:bg-red-500 dark:hover:bg-red-600"
            title="Delete Product"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <div className="product-image-container overflow-hidden">
          <Image
            src={product.bigimageUrl}
            alt={product.name}
            width={300}
            height={300}
            className={`
              w-full object-cover bg-gray-50 dark:bg-gray-800
              transition-all duration-500 group-hover:scale-110
              ${isSale ? "h-[140px]" : isDashboard ? "h-[160px]" : "h-[150px]"}
            `}
          />
        </div>

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount Tag - Positioned to avoid conflict with stock badges */}
        {product.isDiscount && product.discount && product.discount > 0 && (
          <div
            className={`absolute z-10 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white shadow-md ${
              isLowStock || isOutOfStock ? "right-2 top-2" : "left-2 top-2"
            }`}
          >
            -{product.discount}%
          </div>
        )}

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1">
            {product.colors.slice(0, 4).map((color: any) => (
              <span
                key={color.name}
                className="h-4 w-4 rounded-full border border-white shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/90 text-[9px] font-semibold text-gray-700 shadow-md backdrop-blur-sm dark:bg-gray-800/90 dark:text-gray-300">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3 gap-2">
        {/* Product Name */}
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              {product.brand}
            </p>
          )}
        </div>

        {/* Stock Information - Dashboard View */}
        {isDashboard && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
            <Package
              className={`h-3.5 w-3.5 ${isLowStock ? "text-amber-500" : isOutOfStock ? "text-red-500" : "text-green-500"}`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                  Stock
                </span>
                <span
                  className={`text-xs font-bold ${
                    isLowStock
                      ? "text-amber-600 dark:text-amber-400"
                      : isOutOfStock
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {stock} units
                </span>
              </div>
              {isLowStock && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
                  ⚠️ Running low
                </p>
              )}
              {isOutOfStock && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5 font-medium">
                  Out of stock
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stock Badge - End User View (subtle) */}
        {!isDashboard && isLowStock && (
          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" />
            <span className="font-medium">Only {stock} left</span>
          </div>
        )}

        {/* Price Section */}
        <div className="mt-auto flex items-baseline justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.isDiscount && product.discount && (
              <span className="text-[10px] line-through text-gray-400 dark:text-gray-500">
                $
                {(
                  product.price +
                  product.discount * 0.01 * product.price
                ).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock indicator for end users (small badge) */}
          {!isDashboard && !isLowStock && !isOutOfStock && stock > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
              <Package className="h-3 w-3" />
              <span className="font-medium">{stock}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDashboard && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Delete Product
                </DialogTitle>
              </div>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300 pt-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  &ldquo;{product?.name}&rdquo;
                </span>
                ? This action cannot be undone and will permanently remove the
                product from your inventory.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:gap-0 mt-6">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowDeleteDialog(false)}
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Cancel
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Product
              </motion.button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default NewProducts;
