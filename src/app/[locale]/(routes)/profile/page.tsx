"use client";
import { getOrder, getUserById } from "@/lib/action/dashboard";
import { getfavorite, getSaveBlog } from "@/lib/action/fovarit";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Heart,
  Package,
  Bookmark,
  User,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import CardFavorite from "../favorite/_components/CardFavorite";
import OrderCard from "../historyOrder/_compoents/CardHistory";
import SaveBlogCard from "@/components/blog/SaveBlogCard";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const getblog = await getSaveBlog(user?.id);
      const getfavoritedata = await getfavorite(user?.id);
      const getorder = await getOrder(user?.id);
      return {
        orders: getorder,
        favorites: getfavoritedata,
        savedBlogs: getblog,
      };
    },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="bg-gray-200 h-24 w-24 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-60"></div>
          <div className="h-32 bg-gray-200 rounded w-80"></div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 h-48">
      <p className="text-gray-400 font-medium mb-2">No {type} yet</p>
      <p className="text-gray-400 text-sm text-center">
        Items you{" "}
        {type === "Orders"
          ? "purchase"
          : type === "Favorites"
            ? "favorite"
            : "save"}{" "}
        will appear here
      </p>
    </div>
  );

  return (
    <div className="flex justify-center py-8 px-4 bg-gray-50 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-6xl"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/30 blur-md transform scale-110"></div>
              <Image
                width={120}
                height={120}
                src={user.imageUrl}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            <div className="flex flex-col text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-blue-100 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} />
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <User size={14} />
                  <span>{user.username || "No username"}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Phone size={14} />
                  <span>
                    {user.phoneNumbers?.[0]?.phoneNumber || "No phone"}
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Favorites Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-red-50 p-4 border-b border-red-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                  <Heart
                    size={20}
                    className="text-red-500"
                    fill="currentColor"
                  />
                  Favorites
                </h3>
                <Link
                  href="/favorite"
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  View All <ExternalLink size={14} />
                </Link>
              </div>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse h-24 bg-gray-100 rounded"
                    ></div>
                  ))}
                </div>
              ) : data?.favorites?.length > 0 ? (
                <div className="space-y-3">
                  {data.favorites.slice(0, 3).map((item, index) => (
                    <CardFavorite key={index} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState type="Favorites" />
              )}
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                  <Package size={20} className="text-blue-500" />
                  Orders
                </h3>
                <Link
                  href="/historyOrder"
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All <ExternalLink size={14} />
                </Link>
              </div>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse h-24 bg-gray-100 rounded"
                    ></div>
                  ))}
                </div>
              ) : data?.orders?.length > 0 ? (
                <div className="space-y-3">
                  {data.orders.slice(0, 3).map((order, index) => {
                    const date: any = order.orderDate;
                    const formattedDate = new Date(
                      (date.seconds || 0) * 1000
                    ).toLocaleDateString("en-US");
                    return (
                      <OrderCard
                        key={index}
                        order={order}
                        date={formattedDate}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState type="Orders" />
              )}
            </div>
          </motion.div>

          {/* Saved Blogs Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-yellow-50 p-4 border-b border-yellow-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-700">
                  <Bookmark
                    size={20}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                  Saved Blogs
                </h3>
                <Link
                  href="/saveBlog"
                  className="flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-800 transition-colors"
                >
                  View All <ExternalLink size={14} />
                </Link>
              </div>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse h-24 bg-gray-100 rounded"
                    ></div>
                  ))}
                </div>
              ) : data?.savedBlogs?.length > 0 ? (
                <div className="space-y-3">
                  {data.savedBlogs.slice(0, 3).map((blog) => (
                    <SaveBlogCard key={blog.blogId} blog={blog} />
                  ))}
                </div>
              ) : (
                <EmptyState type="Saved Blogs" />
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
