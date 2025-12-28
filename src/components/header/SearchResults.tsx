"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductResults from "./search/ProductResults";
import BlogResults from "./search/BlogResults";
import CategoryResults from "./search/CategoryResults";
import TeamResults from "./search/TeamResults";
import {
  searchProps,
  SearchBlogsProps,
  SearchCategoryProps,
  SearchTeamProps,
  SearchUserProps,
} from "@/lib/action";

interface SearchResultsProps {
  searchQuery: string;
  products: searchProps[];
  blogs: SearchBlogsProps[];
  categories: SearchCategoryProps[];
  team: SearchTeamProps[];
  users: SearchUserProps[];
  isLoading?: boolean;
  onClose?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  products,
  blogs,
  categories,
  team,
  users,
  isLoading = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("products");

  const counts = {
    products: products.length,
    blogs: blogs.length,
    categories: categories.length,
    team: team.length,
    users: users.length,
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-[600px] overflow-hidden flex flex-col">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </p>
          </div>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <TabsTrigger
              value="products"
              className="relative text-18 font-normal data-[state=active]:text-secondary-300 data-[state=active]:border-secondary-300"
            >
              Products
              {counts.products > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-secondary-300 text-white rounded-full">
                  {counts.products}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="relative text-18 font-normal data-[state=active]:text-secondary-300 data-[state=active]:border-secondary-300"
            >
              Blog
              {counts.blogs > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-secondary-300 text-white rounded-full">
                  {counts.blogs}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="relative text-18 font-normal data-[state=active]:text-secondary-300 data-[state=active]:border-secondary-300"
            >
              Category
              {counts.categories > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-secondary-300 text-white rounded-full">
                  {counts.categories}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="relative text-18 font-normal data-[state=active]:text-secondary-300 data-[state=active]:border-secondary-300"
            >
              Team
              {counts.team > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-secondary-300 text-white rounded-full">
                  {counts.team}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            <TabsContent value="products" className="mt-0 text-20 font-thin">
              <ProductResults
                products={products}
                searchQuery={searchQuery}
                onClose={onClose}
              />
            </TabsContent>
            <TabsContent value="blogs" className="mt-0 text-20 font-thin">
              <BlogResults
                blogs={blogs}
                searchQuery={searchQuery}
                onClose={onClose}
              />
            </TabsContent>
            <TabsContent value="categories" className="mt-0 text-20 font-thin">
              <CategoryResults
                categories={categories}
                searchQuery={searchQuery}
                onClose={onClose}
              />
            </TabsContent>
            <TabsContent value="team" className="mt-0 text-20 font-thin">
              <TeamResults
                team={team}
                searchQuery={searchQuery}
                onClose={onClose}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default SearchResults;
