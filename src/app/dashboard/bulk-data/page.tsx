"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getFirestore,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { app } from "@/config/firebaseConfig";
import { catagoryProps, ProductFormInput } from "@/lib/action";
import { Loader2, Plus, Package, Trash2, Image, Video } from "lucide-react";

const db = getFirestore(app);

const BulkDataPage = () => {
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDeleteCategories, setLoadingDeleteCategories] = useState(false);
  const [loadingDeleteProducts, setLoadingDeleteProducts] = useState(false);
  const [loadingBlogsWithPhotos, setLoadingBlogsWithPhotos] = useState(false);
  const [loadingBlogsWithVideos, setLoadingBlogsWithVideos] = useState(false);
  const { toast } = useToast();

  // Sample categories data
  const sampleCategories: Omit<catagoryProps, "numberOfSearches">[] = [
    {
      name: "Laptop",
      image: {
        fileName: "laptop.jpg",
        link: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      },
      brands: ["ASUS", "Dell", "HP", "Lenovo"],
      colors: [
        { name: "Black", color: "#000000" },
        { name: "Gray", color: "#808080" },
        { name: "Silver", color: "#C0C0C0" },
        { name: "Blue", color: "#0000FF" },
        { name: "Red", color: "#FF0000" },
      ],
    },
    {
      name: "Mobile",
      image: {
        fileName: "mobile.jpg",
        link: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
      },
      brands: ["Apple", "Samsung", "Xiaomi", "OnePlus"],
      colors: [
        { name: "Black", color: "#000000" },
        { name: "White", color: "#FFFFFF" },
        { name: "Blue", color: "#0000FF" },
        { name: "Red", color: "#FF0000" },
        { name: "Gold", color: "#FFD700" },
        { name: "Purple", color: "#800080" },
      ],
    },
    {
      name: "Smart Watch",
      image: {
        fileName: "smart-watch.jpg",
        link: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      },
      brands: ["Apple", "Samsung", "Fitbit", "Garmin"],
      colors: [
        { name: "Black", color: "#000000" },
        { name: "Silver", color: "#C0C0C0" },
        { name: "Gold", color: "#FFD700" },
        { name: "Rose Gold", color: "#E8B4B8" },
        { name: "Blue", color: "#0000FF" },
        { name: "Red", color: "#FF0000" },
      ],
    },
    {
      name: "Headset",
      image: {
        fileName: "headset.jpg",
        link: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      },
      brands: ["Sony", "Bose", "JBL", "Sennheiser"],
      colors: [
        { name: "Black", color: "#000000" },
        { name: "White", color: "#FFFFFF" },
        { name: "Blue", color: "#0000FF" },
        { name: "Red", color: "#FF0000" },
        { name: "Green", color: "#008000" },
        { name: "Pink", color: "#FFC0CB" },
      ],
    },
    {
      name: "Keyboard & Mouse",
      image: {
        fileName: "keyboard-mouse.jpg",
        link: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      },
      brands: ["Logitech", "Corsair", "Razer", "SteelSeries"],
      colors: [
        { name: "Black", color: "#000000" },
        { name: "White", color: "#FFFFFF" },
        { name: "Gray", color: "#808080" },
        { name: "Blue", color: "#0000FF" },
        { name: "Red", color: "#FF0000" },
        { name: "RGB", color: "#FF00FF" },
      ],
    },
  ];

  // Generate sample products - 4 brands per category, 4 products per brand (16 products per category)
  const generateSampleProducts = (): Omit<ProductFormInput, "id">[] => {
    const products: Omit<ProductFormInput, "id">[] = [];
    const categories = sampleCategories.map((cat) => cat.name);

    // Product templates organized by category and brand
    // Each category has 4 brands, each brand has 4 products
    const productTemplates: Record<
      string,
      Record<
        string,
        Array<{
          name: string;
          basePrice: number;
          colors: { name: string; color: string }[];
          discount?: number;
          specs?: any;
        }>
      >
    > = {
      Laptop: {
        ASUS: [
          {
            name: "ROG Strix G15",
            basePrice: 1299,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Gray", color: "#808080" },
            ],
            discount: 10,
            specs: {
              ram: 16,
              storage: 512,
              display: 15.6,
              processor: "AMD Ryzen 7 5800H",
            },
          },
          {
            name: "TUF Gaming A15",
            basePrice: 999,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Gray", color: "#808080" },
            ],
            discount: 20,
            specs: {
              ram: 8,
              storage: 256,
              display: 15.6,
              processor: "AMD Ryzen 5 4600H",
            },
          },
          {
            name: "ZenBook 13",
            basePrice: 999,
            colors: [
              { name: "Silver", color: "#C0C0C0" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 10,
            specs: {
              ram: 16,
              storage: 512,
              display: 13.3,
              processor: "AMD Ryzen 7 5800U",
            },
          },
          {
            name: "VivoBook S15",
            basePrice: 899,
            colors: [
              { name: "Silver", color: "#C0C0C0" },
              { name: "Black", color: "#000000" },
            ],
            discount: 18,
            specs: {
              ram: 8,
              storage: 512,
              display: 15.6,
              processor: "AMD Ryzen 5 5500U",
            },
          },
        ],
        Dell: [
          {
            name: "XPS 13",
            basePrice: 1299,
            colors: [
              { name: "Silver", color: "#C0C0C0" },
              { name: "Black", color: "#000000" },
            ],
            discount: 8,
            specs: {
              ram: 16,
              storage: 512,
              display: 13.4,
              processor: "Intel Core i7-1165G7",
            },
          },
          {
            name: "Alienware m15 R6",
            basePrice: 1899,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            specs: {
              ram: 32,
              storage: 1000,
              display: 15.6,
              processor: "Intel Core i9-11980HK",
            },
          },
          {
            name: "G5 15",
            basePrice: 949,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Gray", color: "#808080" },
            ],
            discount: 15,
            specs: {
              ram: 8,
              storage: 256,
              display: 15.6,
              processor: "Intel Core i5-10300H",
            },
          },
          {
            name: "Latitude 7420",
            basePrice: 1099,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 15,
            specs: {
              ram: 16,
              storage: 256,
              display: 14.0,
              processor: "Intel Core i7-1185G7",
            },
          },
        ],
        HP: [
          {
            name: "Omen 15",
            basePrice: 1099,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 10,
            specs: {
              ram: 16,
              storage: 512,
              display: 15.6,
              processor: "AMD Ryzen 7 5800H",
            },
          },
          {
            name: "EliteBook 840",
            basePrice: 1199,
            colors: [
              { name: "Silver", color: "#C0C0C0" },
              { name: "Gray", color: "#808080" },
            ],
            discount: 12,
            specs: {
              ram: 16,
              storage: 512,
              display: 14.0,
              processor: "Intel Core i7-1165G7",
            },
          },
          {
            name: "Spectre x360",
            basePrice: 1299,
            colors: [
              { name: "Silver", color: "#C0C0C0" },
              { name: "Rose Gold", color: "#E8B4B8" },
            ],
            discount: 12,
            specs: {
              ram: 16,
              storage: 512,
              display: 13.5,
              processor: "Intel Core i7-1165G7",
            },
          },
          {
            name: "Pavilion 15",
            basePrice: 649,
            colors: [
              { name: "Silver", color: "#C0C0C0" },
              { name: "Blue", color: "#87CEEB" },
            ],
            discount: 20,
            specs: {
              ram: 8,
              storage: 256,
              display: 15.6,
              processor: "AMD Ryzen 5 5500U",
            },
          },
        ],
        Lenovo: [
          {
            name: "Legion 5 Pro",
            basePrice: 1399,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 15,
            specs: {
              ram: 16,
              storage: 512,
              display: 16.0,
              processor: "Intel Core i7-11800H",
            },
          },
          {
            name: "ThinkPad X1 Carbon",
            basePrice: 1399,
            colors: [{ name: "Black", color: "#000000" }],
            discount: 10,
            specs: {
              ram: 16,
              storage: 512,
              display: 14.0,
              processor: "Intel Core i7-1165G7",
            },
          },
          {
            name: "ThinkPad T14",
            basePrice: 999,
            colors: [{ name: "Black", color: "#000000" }],
            discount: 20,
            specs: {
              ram: 8,
              storage: 256,
              display: 14.0,
              processor: "Intel Core i5-1135G7",
            },
          },
          {
            name: "IdeaPad 5",
            basePrice: 849,
            colors: [
              { name: "Gray", color: "#808080" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 16,
            specs: {
              ram: 8,
              storage: 256,
              display: 15.6,
              processor: "AMD Ryzen 5 5500U",
            },
          },
        ],
      },
      Mobile: {
        Apple: [
          {
            name: "iPhone 15 Pro",
            basePrice: 999,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Blue", color: "#0000FF" },
              { name: "Gold", color: "#FFD700" },
            ],
            discount: 5,
            specs: { storage: 256, display: 6.1, processor: "A17 Pro", ram: 8 },
          },
          {
            name: "iPhone 14",
            basePrice: 699,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 10,
            specs: {
              storage: 128,
              display: 6.1,
              processor: "A15 Bionic",
              ram: 6,
            },
          },
          {
            name: "iPhone 13",
            basePrice: 599,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "Pink", color: "#FFC0CB" },
            ],
            discount: 15,
            specs: {
              storage: 128,
              display: 6.1,
              processor: "A15 Bionic",
              ram: 4,
            },
          },
          {
            name: "iPhone SE",
            basePrice: 429,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Red", color: "#FF0000" },
            ],
            discount: 12,
            specs: {
              storage: 64,
              display: 4.7,
              processor: "A15 Bionic",
              ram: 3,
            },
          },
        ],
        Samsung: [
          {
            name: "Galaxy S24 Ultra",
            basePrice: 1199,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Purple", color: "#800080" },
              { name: "Gold", color: "#FFD700" },
            ],
            discount: 8,
            specs: {
              storage: 512,
              display: 6.8,
              processor: "Snapdragon 8 Gen 3",
              ram: 12,
            },
          },
          {
            name: "Galaxy S23",
            basePrice: 799,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Green", color: "#008000" },
              { name: "Purple", color: "#800080" },
            ],
            discount: 10,
            specs: {
              storage: 256,
              display: 6.1,
              processor: "Snapdragon 8 Gen 2",
              ram: 8,
            },
          },
          {
            name: "Galaxy A54",
            basePrice: 449,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Purple", color: "#800080" },
            ],
            discount: 22,
            specs: {
              storage: 128,
              display: 6.4,
              processor: "Exynos 1380",
              ram: 6,
            },
          },
          {
            name: "Galaxy Z Fold 5",
            basePrice: 1799,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 5,
            specs: {
              storage: 512,
              display: 7.6,
              processor: "Snapdragon 8 Gen 2",
              ram: 12,
            },
          },
        ],
        Xiaomi: [
          {
            name: "Xiaomi 14 Pro",
            basePrice: 799,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 12,
            specs: {
              storage: 256,
              display: 6.73,
              processor: "Snapdragon 8 Gen 3",
              ram: 12,
            },
          },
          {
            name: "Redmi Note 13 Pro",
            basePrice: 399,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "Purple", color: "#800080" },
            ],
            discount: 20,
            specs: {
              storage: 128,
              display: 6.67,
              processor: "Snapdragon 7s Gen 2",
              ram: 8,
            },
          },
          {
            name: "Xiaomi 13",
            basePrice: 699,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 15,
            specs: {
              storage: 256,
              display: 6.36,
              processor: "Snapdragon 8 Gen 2",
              ram: 12,
            },
          },
          {
            name: "POCO X6 Pro",
            basePrice: 349,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Yellow", color: "#FFFF00" },
            ],
            discount: 18,
            specs: {
              storage: 256,
              display: 6.67,
              processor: "MediaTek Dimensity 8300",
              ram: 12,
            },
          },
        ],
        OnePlus: [
          {
            name: "OnePlus 12",
            basePrice: 899,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Green", color: "#008000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 10,
            specs: {
              storage: 256,
              display: 6.82,
              processor: "Snapdragon 8 Gen 3",
              ram: 12,
            },
          },
          {
            name: "OnePlus 11",
            basePrice: 699,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Green", color: "#008000" },
            ],
            discount: 12,
            specs: {
              storage: 256,
              display: 6.7,
              processor: "Snapdragon 8 Gen 2",
              ram: 12,
            },
          },
          {
            name: "OnePlus Nord 3",
            basePrice: 449,
            colors: [
              { name: "Gray", color: "#808080" },
              { name: "Green", color: "#008000" },
            ],
            discount: 15,
            specs: {
              storage: 256,
              display: 6.74,
              processor: "MediaTek Dimensity 9000",
              ram: 8,
            },
          },
          {
            name: "OnePlus 10 Pro",
            basePrice: 799,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Green", color: "#008000" },
            ],
            discount: 20,
            specs: {
              storage: 256,
              display: 6.7,
              processor: "Snapdragon 8 Gen 1",
              ram: 12,
            },
          },
        ],
      },
      "Smart Watch": {
        Apple: [
          {
            name: "Apple Watch Series 9",
            basePrice: 399,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
              { name: "Gold", color: "#FFD700" },
              { name: "Rose Gold", color: "#E8B4B8" },
            ],
            discount: 5,
            specs: {
              display: 1.9,
              battery: "18 hours",
              processor: "S9 SiP",
              storage: 64,
            },
          },
          {
            name: "Apple Watch SE",
            basePrice: 249,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 10,
            specs: {
              display: 1.78,
              battery: "18 hours",
              processor: "S8 SiP",
              storage: 32,
            },
          },
          {
            name: "Apple Watch Ultra 2",
            basePrice: 799,
            colors: [
              { name: "Titanium", color: "#878681" },
              { name: "Black", color: "#000000" },
            ],
            discount: 3,
            specs: {
              display: 2.0,
              battery: "36 hours",
              processor: "S9 SiP",
              storage: 64,
            },
          },
          {
            name: "Apple Watch Series 8",
            basePrice: 399,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
              { name: "Gold", color: "#FFD700" },
            ],
            discount: 8,
            specs: {
              display: 1.9,
              battery: "18 hours",
              processor: "S8 SiP",
              storage: 32,
            },
          },
        ],
        Samsung: [
          {
            name: "Galaxy Watch 6 Classic",
            basePrice: 349,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 8,
            specs: {
              display: 1.4,
              battery: "40 hours",
              processor: "Exynos W930",
              storage: 16,
            },
          },
          {
            name: "Galaxy Watch 6",
            basePrice: 299,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 10,
            specs: {
              display: 1.3,
              battery: "40 hours",
              processor: "Exynos W930",
              storage: 16,
            },
          },
          {
            name: "Galaxy Watch 5 Pro",
            basePrice: 449,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Titanium", color: "#878681" },
            ],
            discount: 12,
            specs: {
              display: 1.4,
              battery: "80 hours",
              processor: "Exynos W920",
              storage: 16,
            },
          },
          {
            name: "Galaxy Watch 4",
            basePrice: 249,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
              { name: "Pink", color: "#FFC0CB" },
            ],
            discount: 15,
            specs: {
              display: 1.2,
              battery: "40 hours",
              processor: "Exynos W920",
              storage: 16,
            },
          },
        ],
        Fitbit: [
          {
            name: "Fitbit Versa 4",
            basePrice: 199,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "Pink", color: "#FFC0CB" },
            ],
            discount: 15,
            specs: {
              display: 1.58,
              battery: "6+ days",
              processor: "Fitbit OS",
              storage: 4,
            },
          },
          {
            name: "Fitbit Sense 2",
            basePrice: 299,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 12,
            specs: {
              display: 1.58,
              battery: "6+ days",
              processor: "Fitbit OS",
              storage: 4,
            },
          },
          {
            name: "Fitbit Charge 6",
            basePrice: 159,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 18,
            specs: {
              display: 1.04,
              battery: "7 days",
              processor: "Fitbit OS",
              storage: 4,
            },
          },
          {
            name: "Fitbit Inspire 3",
            basePrice: 99,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Pink", color: "#FFC0CB" },
            ],
            discount: 20,
            specs: {
              display: 0.96,
              battery: "10 days",
              processor: "Fitbit OS",
              storage: 4,
            },
          },
        ],
        Garmin: [
          {
            name: "Garmin Forerunner 265",
            basePrice: 449,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 10,
            specs: {
              display: 1.3,
              battery: "13 days",
              processor: "Garmin OS",
              storage: 32,
            },
          },
          {
            name: "Garmin Venu 3",
            basePrice: 449,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 8,
            specs: {
              display: 1.4,
              battery: "5 days",
              processor: "Garmin OS",
              storage: 8,
            },
          },
          {
            name: "Garmin Fenix 7",
            basePrice: 699,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Titanium", color: "#878681" },
            ],
            discount: 5,
            specs: {
              display: 1.3,
              battery: "18 days",
              processor: "Garmin OS",
              storage: 32,
            },
          },
          {
            name: "Garmin Instinct 2",
            basePrice: 349,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "Orange", color: "#FFA500" },
            ],
            discount: 12,
            specs: {
              display: 1.1,
              battery: "28 days",
              processor: "Garmin OS",
              storage: 32,
            },
          },
        ],
      },
      Headset: {
        Sony: [
          {
            name: "WH-1000XM5",
            basePrice: 399,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 10,
            specs: {
              battery: "30 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "30mm",
            },
          },
          {
            name: "WH-1000XM4",
            basePrice: 349,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 12,
            specs: {
              battery: "30 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "40mm",
            },
          },
          {
            name: "WF-1000XM5",
            basePrice: 299,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 15,
            specs: {
              battery: "8 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "8.4mm",
            },
          },
          {
            name: "WH-CH720N",
            basePrice: 149,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 18,
            specs: {
              battery: "35 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "30mm",
            },
          },
        ],
        Bose: [
          {
            name: "QuietComfort 45",
            basePrice: 329,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 12,
            specs: {
              battery: "24 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "40mm",
            },
          },
          {
            name: "QuietComfort Earbuds II",
            basePrice: 279,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 10,
            specs: {
              battery: "6 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "Custom",
            },
          },
          {
            name: "SoundLink Around-Ear",
            basePrice: 199,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 15,
            specs: {
              battery: "20 hours",
              noiseCancel: "No",
              wireless: "Yes",
              driver: "40mm",
            },
          },
          {
            name: "Sport Earbuds",
            basePrice: 179,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 20,
            specs: {
              battery: "5 hours",
              noiseCancel: "No",
              wireless: "Yes",
              driver: "Custom",
            },
          },
        ],
        JBL: [
          {
            name: "Tune 770NC",
            basePrice: 149,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 15,
            specs: {
              battery: "50 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "40mm",
            },
          },
          {
            name: "Live 660NC",
            basePrice: 199,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
            ],
            discount: 12,
            specs: {
              battery: "30 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "40mm",
            },
          },
          {
            name: "Tune 230NC TWS",
            basePrice: 99,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0000FF" },
              { name: "Pink", color: "#FFC0CB" },
            ],
            discount: 18,
            specs: {
              battery: "10 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "10mm",
            },
          },
          {
            name: "Quantum 910",
            basePrice: 249,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 10,
            specs: {
              battery: "40 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "50mm",
            },
          },
        ],
        Sennheiser: [
          {
            name: "Momentum 4",
            basePrice: 379,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 8,
            specs: {
              battery: "60 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "42mm",
            },
          },
          {
            name: "Momentum True Wireless 3",
            basePrice: 249,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "Silver", color: "#C0C0C0" },
            ],
            discount: 12,
            specs: {
              battery: "7 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "7mm",
            },
          },
          {
            name: "HD 450BT",
            basePrice: 179,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 15,
            specs: {
              battery: "30 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "32mm",
            },
          },
          {
            name: "CX Plus True Wireless",
            basePrice: 149,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 18,
            specs: {
              battery: "8 hours",
              noiseCancel: "Yes",
              wireless: "Yes",
              driver: "7mm",
            },
          },
        ],
      },
      "Keyboard & Mouse": {
        Logitech: [
          {
            name: "MX Keys Mini",
            basePrice: 99,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Rose", color: "#E8B4B8" },
            ],
            discount: 10,
            specs: {
              type: "Wireless",
              switches: "Scissor",
              layout: "Compact",
              battery: "5 months",
            },
          },
          {
            name: "MX Master 3S",
            basePrice: 99,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
              { name: "Gray", color: "#808080" },
            ],
            discount: 12,
            specs: {
              type: "Wireless",
              dpi: "8000",
              buttons: 7,
              battery: "70 days",
            },
          },
          {
            name: "G915 TKL",
            basePrice: 229,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 8,
            specs: {
              type: "Wireless",
              switches: "GL Tactile",
              layout: "TKL",
              rgb: "Yes",
            },
          },
          {
            name: "MX Mechanical Mini",
            basePrice: 149,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 12,
            specs: {
              type: "Wireless",
              switches: "Tactile",
              layout: "Compact",
              battery: "6 months",
            },
          },
        ],
        Corsair: [
          {
            name: "K70 RGB TKL",
            basePrice: 149,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 12,
            specs: {
              type: "Wired",
              switches: "Cherry MX",
              layout: "TKL",
              rgb: "Yes",
            },
          },
          {
            name: "K100 RGB",
            basePrice: 229,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 10,
            specs: {
              type: "Wired",
              switches: "Cherry MX Speed",
              layout: "Full",
              rgb: "Yes",
            },
          },
          {
            name: "Dark Core RGB Pro",
            basePrice: 99,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 15,
            specs: {
              type: "Wireless",
              dpi: "18000",
              buttons: 8,
              battery: "50 hours",
            },
          },
          {
            name: "K65 RGB Mini",
            basePrice: 99,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 18,
            specs: {
              type: "Wired",
              switches: "Cherry MX",
              layout: "60%",
              rgb: "Yes",
            },
          },
        ],
        Razer: [
          {
            name: "BlackWidow V4 Pro",
            basePrice: 229,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 8,
            specs: {
              type: "Wired",
              switches: "Razer Green",
              layout: "Full",
              rgb: "Yes",
            },
          },
          {
            name: "DeathAdder V3 Pro",
            basePrice: 149,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 8,
            specs: {
              type: "Wireless",
              dpi: "30000",
              buttons: 5,
              battery: "90 hours",
            },
          },
          {
            name: "Huntsman V3 Pro",
            basePrice: 249,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 10,
            specs: {
              type: "Wired",
              switches: "Razer Analog",
              layout: "Full",
              rgb: "Yes",
            },
          },
          {
            name: "Viper V3 Pro",
            basePrice: 159,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 12,
            specs: {
              type: "Wireless",
              dpi: "35000",
              buttons: 5,
              battery: "80 hours",
            },
          },
        ],
        SteelSeries: [
          {
            name: "Apex Pro TKL",
            basePrice: 199,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 15,
            specs: {
              type: "Wired",
              switches: "OmniPoint",
              layout: "TKL",
              rgb: "Yes",
            },
          },
          {
            name: "Aerox 9 Wireless",
            basePrice: 129,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "White", color: "#FFFFFF" },
            ],
            discount: 15,
            specs: {
              type: "Wireless",
              dpi: "18000",
              buttons: 9,
              battery: "180 hours",
            },
          },
          {
            name: "Apex 9 Pro",
            basePrice: 219,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 12,
            specs: {
              type: "Wired",
              switches: "OmniPoint 2.0",
              layout: "Full",
              rgb: "Yes",
            },
          },
          {
            name: "Rival 5",
            basePrice: 79,
            colors: [
              { name: "Black", color: "#000000" },
              { name: "RGB", color: "#FF00FF" },
            ],
            discount: 20,
            specs: { type: "Wired", dpi: "8500", buttons: 9, battery: "N/A" },
          },
        ],
      },
    };

    let productIndex = 0;
    // Generate products: 4 brands per category, 4 products per brand (16 products per category)
    categories.forEach((category) => {
      const categoryTemplates = productTemplates[category];
      if (!categoryTemplates) return;

      // Get brands for this category
      const categoryData = sampleCategories.find(
        (cat) => cat.name === category
      );
      const brands = categoryData?.brands || [];

      // Generate products for each brand
      brands.forEach((brand) => {
        const brandProducts = categoryTemplates[brand] || [];
        brandProducts.forEach((template) => {
          const price = template.discount
            ? Math.round(
                template.basePrice -
                  (template.basePrice * template.discount) / 100
              )
            : template.basePrice;

          const specs = template.specs || {};

          // Generate details based on category and specs
          const details: { title: string; description: string }[] = [];

          if (category === "Laptop") {
            details.push(
              {
                title: "Processor",
                description: `${specs.processor || "High-performance processor"} - Powerful CPU for professional tasks`,
              },
              {
                title: "Memory",
                description: `${specs.ram || 16}GB DDR4 RAM for smooth multitasking and performance`,
              },
              {
                title: "Storage",
                description: `${specs.storage || 512}GB NVMe SSD for fast boot times and data access`,
              },
              {
                title: "Display",
                description: `${specs.display || 15.6}" Full HD IPS display with excellent color accuracy`,
              },
              {
                title: "Graphics",
                description:
                  "Dedicated graphics card for gaming and professional work",
              }
            );
          } else if (category === "Mobile") {
            details.push(
              {
                title: "Processor",
                description: `${specs.processor || "High-performance chip"} - Advanced mobile processor`,
              },
              {
                title: "Memory",
                description: `${specs.ram || 8}GB RAM for smooth multitasking`,
              },
              {
                title: "Storage",
                description: `${specs.storage || 256}GB internal storage`,
              },
              {
                title: "Display",
                description: `${specs.display || 6.7}" AMOLED display with high refresh rate`,
              },
              {
                title: "Camera",
                description: "Advanced camera system with multiple lenses",
              }
            );
          } else if (category === "Smart Watch") {
            details.push(
              {
                title: "Display",
                description: `${specs.display || 1.4}" AMOLED always-on display`,
              },
              {
                title: "Battery",
                description: `${specs.battery || "24 hours"} battery life`,
              },
              {
                title: "Processor",
                description: `${specs.processor || "Advanced chip"} for smooth performance`,
              },
              {
                title: "Storage",
                description: `${specs.storage || 16}GB storage for apps and music`,
              },
              {
                title: "Health Features",
                description:
                  "Heart rate monitor, sleep tracking, and fitness features",
              }
            );
          } else if (category === "Headset") {
            details.push(
              {
                title: "Driver Size",
                description: `${specs.driver || "40mm"} drivers for rich sound quality`,
              },
              {
                title: "Battery Life",
                description: `${specs.battery || "30 hours"} of continuous playback`,
              },
              {
                title: "Noise Cancellation",
                description:
                  specs.noiseCancel === "Yes"
                    ? "Active noise cancellation technology"
                    : "Passive noise isolation",
              },
              {
                title: "Connectivity",
                description:
                  specs.wireless === "Yes"
                    ? "Wireless Bluetooth connectivity"
                    : "Wired connection",
              },
              {
                title: "Comfort",
                description: "Ergonomic design with comfortable ear cushions",
              }
            );
          } else if (category === "Keyboard & Mouse") {
            if (template.name.toLowerCase().includes("mouse")) {
              details.push(
                {
                  title: "DPI",
                  description: `Up to ${specs.dpi || "16000"} DPI for precise tracking`,
                },
                {
                  title: "Buttons",
                  description: `${specs.buttons || 6} programmable buttons`,
                },
                {
                  title: "Battery",
                  description: specs.battery
                    ? `${specs.battery} battery life`
                    : "Long-lasting battery",
                },
                {
                  title: "Connectivity",
                  description:
                    specs.type === "Wireless"
                      ? "Wireless connectivity"
                      : "Wired connection",
                },
                {
                  title: "Design",
                  description: "Ergonomic design for comfortable use",
                }
              );
            } else {
              details.push(
                {
                  title: "Switch Type",
                  description: `${specs.switches || "Mechanical"} switches for responsive typing`,
                },
                {
                  title: "Layout",
                  description: `${specs.layout || "Full"} keyboard layout`,
                },
                {
                  title: "RGB Lighting",
                  description:
                    specs.rgb === "Yes"
                      ? "Customizable RGB backlighting"
                      : "Standard backlighting",
                },
                {
                  title: "Battery",
                  description: specs.battery
                    ? `${specs.battery} battery life`
                    : "Wired connection",
                },
                {
                  title: "Connectivity",
                  description:
                    specs.type === "Wireless"
                      ? "Wireless connectivity"
                      : "Wired connection",
                }
              );
            }
          }

          // Generate unique image URLs for each product
          // Large pool of unique Unsplash photo IDs (50+ unique IDs)
          const uniquePhotoPool = [
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
            "1496181133206-80ce9b88a853",
            "1525547719571-a2d4ac8945e2",
            "1517336714731-489689fd1ca8",
            "1511707171634-5f897ff02aa9",
            "1523275335684-37898b6baf30",
            "1505740420928-5e560c06d30e",
            "1587829741301-dc798b83add3",
          ];

          // Each product gets 5 different photo IDs using productIndex with different calculations
          const poolSize = uniquePhotoPool.length;
          const mainPhotoIndex = (productIndex * 3) % poolSize;
          const smallPhotoIndex1 = (productIndex * 5 + 7) % poolSize;
          const smallPhotoIndex2 = (productIndex * 7 + 11) % poolSize;
          const smallPhotoIndex3 = (productIndex * 11 + 13) % poolSize;
          const smallPhotoIndex4 = (productIndex * 13 + 17) % poolSize;

          const mainImageId = uniquePhotoPool[mainPhotoIndex];
          const smallImageIds = [
            uniquePhotoPool[smallPhotoIndex1],
            uniquePhotoPool[smallPhotoIndex2],
            uniquePhotoPool[smallPhotoIndex3],
            uniquePhotoPool[smallPhotoIndex4],
          ];

          // Generate unique sig values for each image
          const uniqueSig1 = productIndex * 10000 + 1001;
          const uniqueSig2 = productIndex * 10000 + 2002;
          const uniqueSig3 = productIndex * 10000 + 3003;
          const uniqueSig4 = productIndex * 10000 + 4004;
          const uniqueSig5 = productIndex * 10000 + 5005;

          products.push({
            name: `${brand} ${template.name}`,
            price: price,
            iniPrice: template.basePrice,
            brand: brand,
            stock: 20 + Math.floor(Math.random() * 80),
            isev: false,
            isProduction: true,
            colors: template.colors,
            colorsName: template.colors.map((c) => c.name),
            category: category,
            Bigimage: `${brand.toLowerCase()}-${template.name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
            bigimageUrl: `https://images.unsplash.com/photo-${mainImageId}?w=800&sig=${uniqueSig1}`,
            imageSmall: [],
            smallimageUrl: [
              `https://images.unsplash.com/photo-${smallImageIds[0]}?w=400&sig=${uniqueSig2}`,
              `https://images.unsplash.com/photo-${smallImageIds[1]}?w=400&sig=${uniqueSig3}`,
              `https://images.unsplash.com/photo-${smallImageIds[2]}?w=400&sig=${uniqueSig4}`,
              `https://images.unsplash.com/photo-${smallImageIds[3]}?w=400&sig=${uniqueSig5}`,
            ],
            discount: template.discount || 0,
            isDiscount: (template.discount || 0) > 0,
            details: details,
            numberFavorite: 0,
            numberSale: 0,
            date: new Date(),
            numSearch: Math.floor(Math.random() * 100),
          });
          productIndex++;
        });
      });
    });

    return products;
  };

  // Add 5 categories
  const handleAddCategories = async () => {
    setLoadingCategories(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const category of sampleCategories) {
        try {
          const categoryData = {
            ...category,
            numberOfSearches: Math.floor(Math.random() * 100),
          };
          await setDoc(doc(db, "category", category.name), categoryData);
          successCount++;
        } catch (error: any) {
          console.error(`Error adding category ${category.name}:`, error);
          // Check if it's a duplicate error
          if (
            error.code === "already-exists" ||
            error.message?.includes("already exists")
          ) {
            errorCount++;
          } else {
            throw error;
          }
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${successCount} categories!`,
        });
      }
      if (errorCount > 0) {
        toast({
          title: "Warning",
          description: `${errorCount} categories already exist.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error adding categories:", error);
      toast({
        title: "Error",
        description: `Failed to add categories: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Add 50 products
  const handleAddProducts = async () => {
    setLoadingProducts(true);
    try {
      const products = generateSampleProducts();
      let successCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          const productRef = doc(collection(db, "products"));
          await setDoc(productRef, {
            ...product,
            id: productRef.id,
          });
          successCount++;
        } catch (error: any) {
          console.error(`Error adding product ${product.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${successCount} products!`,
        });
      }
      if (errorCount > 0) {
        toast({
          title: "Warning",
          description: `Failed to add ${errorCount} products.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error adding products:", error);
      toast({
        title: "Error",
        description: `Failed to add products: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  // Delete all categories
  const handleDeleteAllCategories = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL categories? This action cannot be undone!"
      )
    ) {
      return;
    }

    setLoadingDeleteCategories(true);
    try {
      const categoriesSnapshot = await getDocs(collection(db, "category"));
      const deletePromises = categoriesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      toast({
        title: "Success",
        description: "All categories deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting categories:", error);
      toast({
        title: "Error",
        description: `Failed to delete categories: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingDeleteCategories(false);
    }
  };

  // Delete all products
  const handleDeleteAllProducts = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL products? This action cannot be undone!"
      )
    ) {
      return;
    }

    setLoadingDeleteProducts(true);
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const deletePromises = productsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      toast({
        title: "Success",
        description: "All products deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting products:", error);
      toast({
        title: "Error",
        description: `Failed to delete products: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingDeleteProducts(false);
    }
  };

  // Generate sample blogs with photos
  const generateBlogsWithPhotos = () => {
    const blogTitles = [
      "Top 10 Laptops for 2024",
      "Best Smartphones Under $500",
      "Ultimate Gaming Setup Guide",
      "Smart Watch Features You Need",
      "Wireless Headphones Comparison",
      "Mechanical Keyboard Buying Guide",
      "Tech Trends to Watch in 2024",
      "Budget-Friendly Tech Products",
      "Productivity Tools for Professionals",
      "Gaming Accessories Must-Haves",
    ];

    const blogDescriptions = [
      "Discover the best laptops available in 2024, featuring top performance, stunning displays, and long battery life. Perfect for work, gaming, and creative projects.",
      "Find the perfect smartphone that fits your budget without compromising on features. We've tested dozens of models to bring you the best options.",
      "Create the ultimate gaming setup with our comprehensive guide. From monitors to peripherals, we cover everything you need for an immersive experience.",
      "Explore the latest smart watch features that can help you stay healthy, connected, and organized. Find the perfect wearable for your lifestyle.",
      "Compare the best wireless headphones on the market. We break down sound quality, battery life, comfort, and price to help you make the right choice.",
      "Everything you need to know about mechanical keyboards. Learn about switch types, layouts, and features that matter most for typing and gaming.",
      "Stay ahead of the curve with the latest tech trends. From AI integration to sustainable technology, see what's shaping the future.",
      "Get the most value for your money with our selection of budget-friendly tech products. Quality doesn't always mean expensive.",
      "Boost your productivity with these essential tools for professionals. From software to hardware, we've got you covered.",
      "Level up your gaming experience with these must-have accessories. Improve your performance and comfort with the right gear.",
    ];

    // Different Unsplash photo IDs for variety
    const photoIds = [
      "1496181133206-80ce9b88a853",
      "1525547719571-a2d4ac8945e2",
      "1517336714731-489689fd1ca8",
      "1511707171634-5f897ff02aa9",
      "1523275335684-37898b6baf30",
      "1505740420928-5e560c06d30e",
      "1587829741301-dc798b83add3",
      "1496181133206-80ce9b88a853",
      "1525547719571-a2d4ac8945e2",
      "1517336714731-489689fd1ca8",
    ];

    return blogTitles.map((title, index) => ({
      title,
      description: blogDescriptions[index],
      image: `https://images.unsplash.com/photo-${photoIds[index]}?w=800&sig=${Date.now() + index}`,
      video: "",
      type: "image" as const,
      date: new Date(),
      user: "Admin",
      numberOfLikes: Math.floor(Math.random() * 100),
      numberOfDislikes: 0,
      numberOfComments: 0,
      comments: [],
      numberOfViews: Math.floor(Math.random() * 500),
      numberOffavorites: Math.floor(Math.random() * 50),
      numberOfSearches: Math.floor(Math.random() * 100),
    }));
  };

  // Generate sample blogs with YouTube videos
  const generateBlogsWithVideos = () => {
    const blogTitles = [
      "Laptop Review: Performance Test",
      "Smartphone Camera Comparison",
      "Gaming Setup Tour 2024",
      "Smart Watch Unboxing",
      "Headphones Sound Test",
      "Keyboard Typing Test",
      "Tech News Weekly Roundup",
      "Budget Tech Recommendations",
      "Productivity Tips & Tricks",
      "Gaming Gear Review",
    ];

    const blogDescriptions = [
      "Watch our comprehensive review of the latest laptops. We test performance, battery life, and build quality to help you make an informed decision.",
      "See how different smartphone cameras perform in various lighting conditions. Real-world testing and comparison shots included.",
      "Take a tour of an amazing gaming setup featuring the latest hardware and accessories. Get inspired for your own gaming space.",
      "Unboxing and first impressions of the newest smart watch. We cover design, features, and initial setup experience.",
      "Listen to the sound quality of top-rated headphones. We test different music genres to show you what to expect.",
      "Watch a typing test on various mechanical keyboards. See how different switches feel and sound in real-time.",
      "Catch up on the latest tech news with our weekly roundup. We cover the most important stories and product launches.",
      "Get recommendations for budget-friendly tech products that offer great value. Perfect for students and budget-conscious buyers.",
      "Learn productivity tips and tricks to get more done. From software shortcuts to workflow optimization, we share practical advice.",
      "In-depth review of the latest gaming gear. We test performance, comfort, and value to help you choose the best equipment.",
    ];

    // Sample YouTube video IDs (these are example IDs - you can replace with real ones)
    const youtubeVideoIds = [
      "dQw4w9WgXcQ", // Example IDs - replace with real video IDs
      "jNQXAC9IVRw",
      "9bZkp7q19f0",
      "kJQP7kiw5Fk",
      "fJ9rUzIMcZQ",
      "L_jWHffIx5E",
      "kXYiU_JCYtU",
      "RgKAFK5djSk",
      "kJQP7kiw5Fk",
      "fJ9rUzIMcZQ",
    ];

    return blogTitles.map((title, index) => ({
      title,
      description: blogDescriptions[index],
      image: "",
      video: `https://www.youtube.com/watch?v=${youtubeVideoIds[index]}`,
      type: "video" as const,
      date: new Date(),
      user: "Admin",
      numberOfLikes: Math.floor(Math.random() * 100),
      numberOfDislikes: 0,
      numberOfComments: 0,
      comments: [],
      numberOfViews: Math.floor(Math.random() * 500),
      numberOffavorites: Math.floor(Math.random() * 50),
      numberOfSearches: Math.floor(Math.random() * 100),
    }));
  };

  // Add 10 blogs with photos
  const handleAddBlogsWithPhotos = async () => {
    setLoadingBlogsWithPhotos(true);
    try {
      const blogs = generateBlogsWithPhotos();
      let successCount = 0;
      let errorCount = 0;

      for (const blog of blogs) {
        try {
          await addDoc(collection(db, "blogs"), blog);
          successCount++;
        } catch (error: any) {
          console.error(`Error adding blog ${blog.title}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${successCount} blogs with photos!`,
        });
      }
      if (errorCount > 0) {
        toast({
          title: "Warning",
          description: `Failed to add ${errorCount} blogs.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error adding blogs with photos:", error);
      toast({
        title: "Error",
        description: `Failed to add blogs: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingBlogsWithPhotos(false);
    }
  };

  // Add 10 blogs with YouTube videos
  const handleAddBlogsWithVideos = async () => {
    setLoadingBlogsWithVideos(true);
    try {
      const blogs = generateBlogsWithVideos();
      let successCount = 0;
      let errorCount = 0;

      for (const blog of blogs) {
        try {
          await addDoc(collection(db, "blogs"), blog);
          successCount++;
        } catch (error: any) {
          console.error(`Error adding blog ${blog.title}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${successCount} blogs with YouTube videos!`,
        });
      }
      if (errorCount > 0) {
        toast({
          title: "Warning",
          description: `Failed to add ${errorCount} blogs.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error adding blogs with videos:", error);
      toast({
        title: "Error",
        description: `Failed to add blogs: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingBlogsWithVideos(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-cyan-600 drop-shadow-xl mb-4">
            Bulk Data Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Add sample categories and products to Firebase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Categories Card */}
          <Card className="shadow-xl border-2 border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-cyan-600" />
                Add 5 Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Add 5 sample categories to Firebase:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {sampleCategories.map((cat) => (
                  <li key={cat.name}>{cat.name}</li>
                ))}
              </ul>
              <Button
                onClick={handleAddCategories}
                disabled={loadingCategories}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                size="lg"
              >
                {loadingCategories ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Categories...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Add 5 Categories
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Add Products Card */}
          <Card className="shadow-xl border-2 border-green-500/20 hover:border-green-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-green-600" />
                Add 80 Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Add 80 unique technology products to Firebase (16 products per
                category, 4 brands × 4 products each):
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>16 products for Laptop (4 brands × 4 products)</li>
                <li>16 products for Mobile (4 brands × 4 products)</li>
                <li>16 products for Smart Watch (4 brands × 4 products)</li>
                <li>16 products for Headset (4 brands × 4 products)</li>
                <li>
                  16 products for Keyboard & Mouse (4 brands × 4 products)
                </li>
                <li>Each product has unique images and specifications</li>
                <li>Different data for each product across all categories</li>
              </ul>
              <Button
                onClick={handleAddProducts}
                disabled={loadingProducts}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                size="lg"
              >
                {loadingProducts ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Products...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Add 80 Products
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Add Blogs with Photos Card */}
          <Card className="shadow-xl border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Image className="h-6 w-6 text-purple-600" />
                Add 10 Blogs with Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Add 10 sample blog posts with different photos to Firebase:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>Each blog has a unique title and description</li>
                <li>Different photos from Unsplash</li>
                <li>Tech-related content</li>
                <li>Ready to use sample data</li>
              </ul>
              <Button
                onClick={handleAddBlogsWithPhotos}
                disabled={loadingBlogsWithPhotos}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                {loadingBlogsWithPhotos ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Blogs...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Add 10 Blogs with Photos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Add Blogs with Videos Card */}
          <Card className="shadow-xl border-2 border-red-500/20 hover:border-red-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Video className="h-6 w-6 text-red-600" />
                Add 10 Blogs with YouTube Videos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Add 10 sample blog posts with YouTube video links to Firebase:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>Each blog has a unique title and description</li>
                <li>YouTube video links included</li>
                <li>Tech-related content</li>
                <li>Ready to use sample data</li>
              </ul>
              <Button
                onClick={handleAddBlogsWithVideos}
                disabled={loadingBlogsWithVideos}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                size="lg"
              >
                {loadingBlogsWithVideos ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Blogs...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Add 10 Blogs with Videos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Delete Categories Card */}
          <Card className="shadow-xl border-2 border-red-500/20 hover:border-red-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-red-600" />
                Delete All Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Permanently delete all categories from Firebase. This action
                cannot be undone!
              </p>
              <Button
                onClick={handleDeleteAllCategories}
                disabled={loadingDeleteCategories}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                {loadingDeleteCategories ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete All Categories
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Delete Products Card */}
          <Card className="shadow-xl border-2 border-red-500/20 hover:border-red-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-red-600" />
                Delete All Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Permanently delete all products from Firebase. This action
                cannot be undone!
              </p>
              <Button
                onClick={handleDeleteAllProducts}
                disabled={loadingDeleteProducts}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                {loadingDeleteProducts ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete All Products
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkDataPage;
