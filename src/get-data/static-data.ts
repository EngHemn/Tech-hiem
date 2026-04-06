import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { BsTabletLandscape, BsSmartwatch, BsCamera } from "react-icons/bs";
import {
  IoHeadsetOutline,
  IoGameControllerOutline,
  IoGitNetwork,
} from "react-icons/io5";
import { RiSettings3Line } from "react-icons/ri";
import {
  FaUser,
  FaHome,
  FaShoppingCart,
  FaEnvelope,
  FaQuestionCircle,
  FaShoppingBag,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  MdAccountBalance,
  MdAddCircle,
  MdCategory,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { FaNewspaper, FaPercent, FaUsers } from "react-icons/fa6";
import { 
  Productsprops, 
  userProps, 
  Cart, 
  BlogColProps, 
  Category, 
  FilterProps, 
  propsMenuItem 
} from "@/types";

export const newProdcuts: Productsprops[] = [
  {
    price: 12,
    name: "Iphone 14 promax 256 gig",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.3,
    image: "/Catagory_smartPhone.svg",
  },
  {
    price: 123123,
    name: "Blackmagic Design Pocket Cinema Camera 6K Pro (Canon EF)",
    colors: [{ name: "Red", color: "#FF0000" }],
    discount: 234.34,
    pointStart: 2.3,
    image: "/Catagory_laptop.svg",
  },
  {
    price: 32,
    name: "SAMSUNG Galaxy S23 Ultra Cell Phone,256 GB",
    pointStart: 3.3,
    image: "/airPode.svg",
  },
  {
    price: 45,
    name: "Play Station 4 Pro 1Tb",
    colors: [{ name: "Red", color: "#FF0000" }],
    persentageDiscount: 23,
    discount: 342.3,
    pointStart: 4.3,
    image: "/playStation2.svg",
  },
  {
    price: 67,
    name: "camera for the photo",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.3,
    image: "/Catagory_camera.svg",
  },
  {
    price: 78,
    name: "camera for the photo",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.13,
    image: "/Catagory_Gaming.svg",
  },
  {
    price: 12243,
    name: "laptop is live for me day for the photo",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.13,
    image: "/laptop1.svg",
  },
  {
    price: 230,
    name: "laptop is live for me day for the photo",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.13,
    image: "/oldsmart.svg",
  },
  {
    price: 103,
    name: "laptop is live for me day for the photo",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.13,
    image: "/airPode.svg",
  },
];

export const bestSellers: Productsprops[] = [
  {
    price: 342,
    name: "EchoX Pro H900",
    colors: [{ name: "Red", color: "#FF0000" }],
    pointStart: 1.3,
    image: "/headSet.svg",
  },
  {
    price: 342,
    name: "Apple MacBook Air 15 w/ Touch ID (2023) - Space Grey (Apple M2 Chip / 256GB SSD / 8GB RAM) - French",
    colors: [{ name: "Red", color: "#FF0000" }],
    discount: 234.34,
    pointStart: 2.3,
    image: "/laptop1.svg",
  },
  {
    price: 342,
    name: "Airpods pro2",
    pointStart: 3.3,
    image: "/airPode.svg",
  },
  {
    price: 342,
    name: "Play Station 4 Pro 1Tb",
    colors: [{ name: "Red", color: "#FF0000" }],
    persentageDiscount: 23,
    discount: 342.3,
    pointStart: 4.3,
    image: "/playStation2.svg",
  },
];

export const brand: string[] = [
  "/Apple.webp",
  "/sony.svg",
  "/samsung.svg",
  "/canon.svg",
  "/huawei.svg",
  "/lenovo.svg",
];

export const user: userProps = {
  name: "hemnsoftware",
  email: "hamnfarhad14@gmail.com",
  image: "/",
};

export const carts: Cart[] = [
  {
    id: 1,
    imageSrc: "/laptop.svg",
    name: "MacBook Pro M2 MNEJ3  LLA 13.3 inch",
    color: "blue",
    delivery: "Free Delivery",
    guarantee: "Guaranteed",
    price: 4300.0,
    quantity: 1,
  },
  {
    id: 2,
    imageSrc: "/bag1.png",
    name: "MacBook Air M1 2020 13.3 inch",
    color: "silver",
    delivery: "Free Delivery",
    guarantee: "Guaranteed",
    price: 3800.0,
    quantity: 1,
  },
  {
    id: 3,
    imageSrc: "/monitar.png",
    name: "MacBook Pro M1 2021 14 inch",
    color: "gray",
    delivery: "Free Delivery",
    guarantee: "Guaranteed",
    price: 4800.0,
    quantity: 1,
  },
];

export const blogs: BlogColProps[] = [
  {
    id: "1",
    title: "Meta Platforms plans to release free software that...",
    description: "The parent at dolorum, voluptas aut quos delectus repellendus...",
    date: "August 8, 2023",
    readTime: "3 min read",
    imageSrc: "/meta.svg",
    saveIconSrc: "/save-2.svg",
    catagory: "headset",
    creator: "aso afan sadiq",
  },
  {
    id: "2",
    title: "The parent company",
    description: "South Korea's antitrust regulator fines aims to ensure trans...",
    date: "August , 4 , 2023",
    readTime: "4 min read",
    imageSrc: "/meta.svg",
    saveIconSrc: "save-2.svg",
    catagory: "headset",
    creator: "aso afan sadiq",
  },
  {
    id: "3",
    title: "Mobile Users and Shopping Behavior",
    description: "The parent company ...",
    date: "August , 6 , 2023",
    readTime: "4 min read",
    imageSrc: "/meta.svg",
    saveIconSrc: "save-2.svg",
    catagory: "headset",
    creator: "aso afan sadiq",
  },
  {
    id: "4",
    title: "The best gaming headsets",
    description: "The parent company ...",
    date: "August , 6 , 2023",
    readTime: "4 min read",
    imageSrc: "/meta.svg",
    saveIconSrc: "save-2.svg",
    catagory: "headset",
    creator: "aso afan sadiq",
  },
];

export const categories: Category[] = [
  { name: "mobile", icon: HiOutlineDevicePhoneMobile },
  { name: "tablet", icon: BsTabletLandscape },
  { name: "audio", icon: IoHeadsetOutline },
  { name: "smartwatch", icon: BsSmartwatch },
  { name: "camera", icon: BsCamera },
  { name: "gaming", icon: IoGameControllerOutline },
  { name: "network", icon: IoGitNetwork },
  { name: "accessories", icon: RiSettings3Line },
];

export const Sort: { key: string; label: "new" | "priceB" | "priceA" }[] = [
  { key: "newest", label: "new" },
  { key: "Price: Low to High", label: "priceA" },
  { key: "Price: High to Low", label: "priceB" },
];

export const filterItems: FilterProps[] = [
  { name: "brand", item: ["asus", "lenov", "mac", "widows"] },
  { name: "color", item: ["white", "silver", "gold", "black", "pinck"] },
];

export const menuItems: propsMenuItem[] = [
  { name: "Home", icon: FaHome, url: "/dashboard/home" },
  { name: "Products", icon: FaShoppingBag, url: "/dashboard/Products" },
  { name: "User Orders", icon: MdOutlineShoppingCart, url: "/dashboard/UserOrder" },
  { name: "Popular Products", icon: FaShoppingCart, url: "/dashboard/popular" },
  { name: "Add Item", icon: MdAddCircle, url: "/dashboard/AddItem" },
  { name: "Category", icon: MdCategory, url: "/dashboard/category" },
  { name: "Bulk Data", icon: MdAddCircle, url: "/dashboard/bulk-data" },
  { name: "User", icon: FaUser, url: "/dashboard/user" },
  { name: "Personal Data", icon: FaUsers, url: "/dashboard/PersonalData" },
  { name: "Accounting", icon: MdAccountBalance, url: "/dashboard/Accounting" },
  { name: "Discounts", icon: FaPercent, url: "/dashboard/discount" },
  { name: "Blog", icon: FaNewspaper, url: "/dashboard/Blog" },
  { name: "FAQ", icon: FaQuestionCircle, url: "/dashboard/faq" },
  { name: "About Us", icon: FaInfoCircle, url: "/dashboard/aboutUs" },
  { name: "Contact Us", icon: FaEnvelope, url: "/dashboard/ContactUs" },
  { name: "Sign Out", icon: FaSignOutAlt, url: "/home" },
];

export const colors: { name: string; color: string }[] = [
  { name: "Red", color: "#FF0000" },
  { name: "Green", color: "#00FF00" },
  { name: "Blue", color: "#0000FF" },
  { name: "Yellow", color: "#FFFF00" },
  { name: "Cyan", color: "#00FFFF" },
  { name: "Magenta", color: "#FF00FF" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#FFFFFF" },
  { name: "Orange", color: "#FFA500" },
  { name: "Purple", color: "#800080" },
  { name: "Pink", color: "#FFC0CB" },
  { name: "Brown", color: "#A52A2A" },
  { name: "Gray", color: "#808080" },
  { name: "Gold", color: "#FFD700" },
  { name: "Silver", color: "#C0C0C0" },
  { name: "Lime", color: "#00FF00" },
  { name: "Maroon", color: "#800000" },
  { name: "Salmon", color: "#FA8072" },
  { name: "Turquoise", color: "#40E0D0" },
  { name: "Violet", color: "#EE82EE" },
  { name: "Beige", color: "#F5F5DC" },
];
