"use client";
import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import InputCheckout from "@/components/Cart/InputCheckout";
import { catagoryProps, ProductFormInput } from "@/lib/action";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { app } from "@/config/firebaseConfig";
import { getFireBase, uploadImage } from "@/lib/action/uploadimage";
import { IoMdArrowDropdown } from "react-icons/io";
import ImageSmallInput from "@/components/ImageSmallInput";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  AlertCircle,
  ArrowLeft,
  EditIcon,
  Image as ImageIcon,
  Info,
  Plus,
  Save,
  Tag,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

// Define the notification type
interface Notification {
  productId: string;
  productName: string;
  action: "added" | "updated" | "deleted";
  timestamp: any;
  seen: boolean;
  userId: string;
  userEmail: string;
}

const initialProductFormInput: ProductFormInput = {
  id: undefined,
  colorsName: [],
  name: "",
  price: 0,
  brand: "",
  iniPrice: 0,
  isev: false,
  stock: 0,
  isProduction: true,
  colors: [],
  category: "",
  Bigimage: null,
  imageSmall: [],
  discount: 0,
  details: [],
  numberFavorite: 0,
  numberSale: 0,
  date: new Date(),
  isDiscount: false,
  bigimageUrl: "",
  numSearch: 0,
  smallimageUrl: [],
};

const initialState = {
  name: "",
  price: "",
  brand: "",
  category: "",
  Bigimage: "",
  colors: "",
  bigimageUrl: "",
  stock: "",
  iniPrice: "",
  smallimageUrl: "",
  details: "",
  date: "",
  discount: "",
};

const Page = () => {
  const [haveId, setHaveId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedcolor, setSelectedcolor] = useState<
    { name: string; color: string }[]
  >([]);
  const [value, setValue] = useState<ProductFormInput>(initialProductFormInput);
  const [isDiscount, setIsDiscount] = useState(value.isDiscount || false);
  const [discountValue, setDiscountValue] = useState(0);
  const [mainImageName, setMainImageName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [smallImageFile, setSmallImageFile] = useState<(File | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [smallImageName, setSmallImageName] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [details, setDetails] = useState<
    { title: string; description: string }[]
  >([]);
  const [imageSmallUrl, setImageSmallUrl] = useState<string[]>([]);
  const [category, setCategory] = useState<catagoryProps[]>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [iniPrice, setIniPrice] = useState(0);
  const [error, setError] = useState(initialState);
  const [isProduction, setIsProduction] = useState(true);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(
    null
  );
  const { toast } = useToast();
  const db = getFirestore(app);

  // Get current user info from localStorage (assuming user is stored there)
  const getUserInfo = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        return {
          id: parsedUser.uid || "unknown",
          email: parsedUser.email || "unknown@example.com",
        };
      }
    }
    return { id: "unknown", email: "unknown@example.com" };
  };

  // Create notification function
  const createNotification = async (
    productId: string,
    productName: string,
    action: "added" | "updated" | "deleted"
  ) => {
    try {
      const user = getUserInfo();
      const notification: Notification = {
        productId,
        productName,
        action,
        timestamp: serverTimestamp(),
        seen: false,
        userId: user.id,
        userEmail: user.email,
      };

      await addDoc(collection(db, "notifications"), notification);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setHaveId(id);
  }, []);

  const validation = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    price: z.number().min(1, "Price must be greater than 0"),
    iniPrice: z.number().min(1, "Initial price must be greater than 0"),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    bigimageUrl: z.string().min(1, "Main image URL is required"),
    smallimageUrl: z
      .array(z.string())
      .length(4, "All 4 small images are required"),
    details: z
      .array(
        z.object({
          title: z.string().min(3, "Title must be at least 3 characters"),
          description: z
            .string()
            .min(3, "Description must be at least 3 characters"),
        })
      )
      .nonempty("At least one detail is required"),
    date: z.date(),
    stock: z.number().min(1, "Stock must be at least 1"),
    colors: z
      .array(
        z.object({
          name: z.string(),
          color: z.string(),
        })
      )
      .nonempty("At least one color must be selected"),
    discount: z.number().optional(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(initialState);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const data: ProductFormInput = {
        name: formData.get("name")?.toString().trim() || "",
        iniPrice: parseFloat(
          formData.get("iniPrice")?.toString().trim() || "0"
        ),
        price: parseFloat(formData.get("price")?.toString().trim() || "0"),
        stock: parseFloat(formData.get("stock")?.toString().trim() || "0"),
        isev: false,
        brand: formData.get("brand")?.toString().trim() || "",
        colors: selectedcolor,
        numSearch: Math.floor(Math.random() * 67),
        category: formData.get("category")?.toString().trim() || "",
        Bigimage: mainImageName || "",
        colorsName: selectedcolor.map((item) => item.name.trim()),
        bigimageUrl: selectedImage,
        smallimageUrl: imageSmallUrl,
        details: details,
        numberFavorite: 0,
        numberSale: 0,
        date: new Date(),
        isProduction,
        isDiscount: isDiscount,
        discount: discountValue,
      };

      const sanitizedData = {
        ...data,
        id: haveId,
      } as { [key: string]: any };

      const validatedData = validation.safeParse(sanitizedData);

      if (!validatedData.success) {
        validatedData.error.errors.forEach((item) => {
          setError((prev) => ({
            ...prev,
            [item.path[0]]: item.message,
          }));
        });

        // Show first error as toast
        toast({
          title: "Validation Error",
          description: validatedData.error.errors[0].message,
          variant: "destructive",
        });

        setLoading(false);
        return;
      }

      // Update or create document based on if we have an ID
      if (haveId) {
        await updateDoc(doc(db, "Products", haveId), { ...sanitizedData });
        await createNotification(haveId, data.name, "updated");
        toast({
          title: "Product Updated",
          description: `${data.name} has been successfully updated.`,
          variant: "default",
        });
      } else {
        const docRef = await addDoc(
          collection(db, isProduction ? "Products" : "PrivateProducts"),
          data
        );
        await createNotification(docRef.id, data.name, "added");
        toast({
          title: "Product Added",
          description: `${data.name} has been successfully added to the catalog.`,
          variant: "default",
        });
      }

      window.location.href = "/dashboard/Products";
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageName(file.name);
      try {
        setLoading(true);

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);

        const linkimage = await uploadImage(file);
        setSelectedImage(linkimage);

        clearInterval(interval);
        setUploadProgress(100);

        setTimeout(() => {
          setUploadProgress(0);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
        toast({
          title: "Upload Failed",
          description:
            "There was an error uploading your image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSmallImageChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);

        const linkImageUrl = await uploadImage(file);

        setImageSmallUrl((prevUrls) => {
          const updatedUrls = [...prevUrls];
          while (updatedUrls.length < 4) {
            updatedUrls.push("");
          }
          updatedUrls[index] = linkImageUrl;
          return updatedUrls;
        });

        const updatedImages = [...smallImageFile];
        updatedImages[index] = file;
        setSmallImageFile(updatedImages);

        setSmallImageName((prevNames) => {
          const updatedNames = [...prevNames];
          updatedNames[index] = file.name;
          return updatedNames;
        });

        clearInterval(interval);
        setUploadProgress(100);

        setTimeout(() => {
          setUploadProgress(0);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
        toast({
          title: "Upload Failed",
          description:
            "There was an error uploading your small image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle adding product details
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleAddDetail = () => {
    const titleValue = titleRef.current?.value;
    const descriptionValue = descriptionRef.current?.value;

    if (titleValue && descriptionValue) {
      if (editingDetailIndex !== null) {
        // Update existing detail
        setDetails((prevDetails) =>
          prevDetails.map((detail, index) =>
            index === editingDetailIndex
              ? { title: titleValue, description: descriptionValue }
              : detail
          )
        );
        setEditingDetailIndex(null);
      } else {
        // Add new detail
        setDetails((prevDetails) => [
          ...prevDetails,
          {
            title: titleValue,
            description: descriptionValue,
          },
        ]);
      }

      if (titleRef.current) titleRef.current.value = "";
      if (descriptionRef.current) descriptionRef.current.value = "";
    } else {
      toast({
        title: "Missing Information",
        description:
          "Both title and description are required for product details.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const cate: catagoryProps[] = await getFireBase("category");
        setSelectedCategory(cate[0]?.name || "");
        setCategory(cate);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    getdata();
  }, []);

  useEffect(() => {
    const getdata = async () => {
      try {
        const docSnap = await getDoc(doc(db, "Products", haveId));
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setSelectedCategory(productData.category);
          setName(productData.name);
          setIniPrice(productData.iniPrice);
          setStock(productData.stock);
          setPrice(productData.price);
          setSelectedcolor(productData.colors || []);
          setSelectedImage(productData.bigimageUrl);
          setImageSmallUrl(productData.smallimageUrl || []);
          setMainImageName(productData.Bigimage);
          setDetails(productData.details || []);
          setIsDiscount(productData.isDiscount || false);
          setDiscountValue(productData.discount || 0);
          setBrand(productData.brand);
          setIsProduction(productData.isProduction !== false);
        } else {
          toast({
            title: "Product Not Found",
            description: "The requested product could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product information. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (haveId) {
      getdata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveId]);

  const editDetail = (index: number) => {
    const detail = details[index];
    if (titleRef.current) titleRef.current.value = detail.title;
    if (descriptionRef.current)
      descriptionRef.current.value = detail.description;
    setEditingDetailIndex(index);
  };

  const deleteDetail = (index: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant={haveId ? "secondary" : "default"}
                className={
                  haveId
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }
              >
                {haveId ? "Edit Product" : "New Product"}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {haveId ? `Edit ${name || "Product"}` : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {haveId
                ? "Update product information and details"
                : "Create a new product listing for your store"}
            </p>
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={() => (window.location.href = "/dashboard/Products")}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </div>

        {/* Upload Progress */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 p-4">
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Uploading...
              </span>
              <span className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputCheckout
                  label="Product Name"
                  name="name"
                  placeholder="Enter product name"
                  error={error.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <InputCheckout
                    label="Initial Price"
                    name="iniPrice"
                    type="number"
                    placeholder="Initial price"
                    error={error.iniPrice}
                    onChange={(e) => setIniPrice(Number(e.target.value) || 0)}
                    value={iniPrice || ""}
                  />
                  <InputCheckout
                    label="Sale Price"
                    name="price"
                    type="number"
                    placeholder="Sale price"
                    error={error.price}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    value={price || ""}
                  />
                </div>
              </div>
              <div>
                <InputCheckout
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  placeholder="Stock quantity"
                  error={error.stock}
                  onChange={(e) => setStock(Number(e.target.value) || 0)}
                  value={stock || ""}
                />
              </div>
              <div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="discount-toggle"
                      checked={isDiscount}
                      onCheckedChange={setIsDiscount}
                    />
                    <InputCheckout
                      name="discount"
                      label=""
                      placeholder="Discount percentage"
                      error={error.discount}
                      type="number"
                      onChange={(e) =>
                        setDiscountValue(Number(e.target.value) || 0)
                      }
                      value={discountValue || ""}
                      isdisabled={isDiscount}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedcolor([]);
                      setSelectedCategory(e.target.value);
                    }}
                    className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {category?.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {error.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Brand</Label>
                  <select
                    name="brand"
                    className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    {category
                      ?.find((item) => item.name === selectedCategory)
                      ?.brands.map((branditem) => (
                        <option key={branditem} value={branditem}>
                          {branditem}
                        </option>
                      ))}
                  </select>
                  {error.brand && (
                    <p className="text-red-500 text-sm mt-1">{error.brand}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between space-x-2">
                  <Label>Add to Production</Label>
                  <Switch
                    checked={isProduction}
                    onCheckedChange={setIsProduction}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isProduction
                    ? "This product will be visible in the store"
                    : "This product will be saved as draft"}
                </p>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Images
              </h2>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Main Product Image</h3>
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="imageBig"
                  name="Bigimage"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="imageBig"
                  className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-full h-64 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 overflow-hidden"
                >
                  {selectedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedImage}
                        alt="Selected Image"
                        fill
                        className="object-contain p-4"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                        <span className="text-white opacity-0 hover:opacity-100 font-medium transition-opacity">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload main product image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, or WebP (recommended 1200x1200px)
                      </p>
                    </div>
                  )}
                </label>
                {error.bigimageUrl && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {error.bigimageUrl}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Product Gallery
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload up to 4 additional product images for the gallery view
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative">
                    <ImageSmallInput
                      name={`imageSmall${index}`}
                      image={smallImageFile[index]}
                      value={imageSmallUrl[index]}
                      onImageChange={(e) => handleSmallImageChange(index, e)}

                      // customClass="h-40 w-full"
                    />
                    <Badge
                      variant="outline"
                      className="absolute top-2 left-2 bg-white bg-opacity-70"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
              {error.smallimageUrl && (
                <p className="text-red-500 text-sm mt-2">
                  {error.smallimageUrl}
                </p>
              )}
            </div>
          </div>

          {/* Variations Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Variations
              </h2>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                Available Colors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {category
                  ?.find((item) => item.name === selectedCategory)
                  ?.colors.map((color) => {
                    const isSelected = selectedcolor.some(
                      (item) => item.color === color.color
                    );
                    return (
                      <motion.div
                        key={color.name}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700"
                        }`}
                        onClick={() =>
                          setSelectedcolor((prev) =>
                            prev.some((item) => item.color === color.color)
                              ? prev.filter(
                                  (item) => item.color !== color.color
                                )
                              : [
                                  ...prev,
                                  {
                                    name: color.name,
                                    color: color.color,
                                  },
                                ]
                          )
                        }
                      >
                        <div
                          className="w-6 h-6 rounded-full mr-3"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-sm font-medium">
                          {color.name}
                        </span>
                        {isSelected && (
                          <div className="ml-auto">
                            <Badge
                              variant="outline"
                              className="bg-primary text-primary-foreground"
                            >
                              Selected
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
              </div>
              {error.colors && (
                <p className="text-red-500 text-sm mt-2">{error.colors}</p>
              )}
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-3">Selected Colors</h3>
              {selectedcolor.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No colors selected. Please select at least one color above.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedcolor.map((color, index) => (
                    <div
                      key={index}
                      className="group flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full pl-2 pr-3 py-1.5"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {color.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedcolor((prev) =>
                            prev.filter((item) => item.color !== color.color)
                          )
                        }
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Details
              </h2>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Product Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add important details about the product that customers should
                know
              </p>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputCheckout
                    label="Detail Title"
                    name="titleDetial"
                    placeholder="E.g., Material, Dimensions"
                    ref={titleRef}
                  />
                  <InputCheckout
                    label="Detail Description"
                    name="descriptionDetial"
                    placeholder="E.g., 100% Cotton, 10cm x 20cm"
                    ref={descriptionRef}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddDetail}
                  className="w-full flex items-center justify-center"
                >
                  {editingDetailIndex !== null ? (
                    <>Update Detail</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add Detail
                    </>
                  )}
                </Button>
              </div>

              {details.length > 0 ? (
                <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="grid grid-cols-12 text-sm font-medium bg-gray-100 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white">
                    <div className="col-span-4">Title</div>
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {details.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 px-4 py-3 items-center text-sm bg-white dark:bg-gray-800"
                      >
                        <div className="col-span-4 font-medium break-words text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="col-span-6 text-gray-600 dark:text-gray-400 break-words">
                          {item.description}
                        </div>
                        <div className="col-span-2 flex justify-end space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => editDetail(index)}
                          >
                            <EditIcon className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteDetail(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No details added yet. Add details about the product to
                    improve customer understanding.
                  </p>
                </div>
              )}
              {error.details && (
                <p className="text-red-500 text-sm mt-2">{error.details}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/Products")}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {haveId ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
