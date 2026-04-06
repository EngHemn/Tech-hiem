import { IconType } from "react-icons";

export interface Productsprops {
  name: string;
  discount?: number;
  colors?: { name: string; color: string }[];
  image: string;
  price: number;
  pointStart: number;
  persentageDiscount?: number;
}

export interface serviesProps {
  name: string;
  image: IconType;
}

export interface footerProps {
  name: string;
  item: { name?: string; icon?: any }[];
}

export interface userProps {
  id?: string;
  name: string;
  image: string;
  email: string;
}

export interface Cart {
  id: number;
  imageSrc: string;
  name: string;
  color: string;
  delivery: string;
  guarantee: string;
  price: number;
  quantity: number;
}

export interface BlogColProps {
  catagory: string;
  creator: string;
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  imageSrc: string;
  saveIconSrc: string;
}

export interface LikeStatus {
  like: boolean;
  disLike: boolean;
}

export interface Category {
  name: string;
  icon: IconType;
}

export interface FilterProps {
  name: string;
  item: string[];
}

export interface typeFilter {
  color: string[];
  discount: boolean;
  brand: string[];
  price: number[];
}

export interface imageHeaderProps {
  imageBig: string;
  images: string[];
}

export interface ProductInfoProps {
  name: string;
  colors: { name: string; color: string }[];
  infos: { title: string; description: string }[];
  price: number;
  brand?: string;
  discount?: number;
}

export interface errorCheckOutProps {
  fullName: string;
  phoneNumber: string;
  streetName: string;
  city: string;
  Select_region: string;
  note: string;
}

export interface propsMenuItem {
  name: string;
  icon: IconType;
  url?: string;
}

export type NotificationType = "order" | "favorite" | "saved_blog";
export type NotificationAction = "added" | "removed";

export interface NotificationData {
  type: NotificationType;
  action: NotificationAction;
  userId: string;
  userName: string;
  productId?: string;
  blogId?: string;
  id?: string;
  message: string;
  creatorId?: Date;
  read: boolean;
}

export interface ProductFormInput {
  id?: string;
  name: string;
  price: number;
  brand: string;
  colors: { name: string; color: string }[];
  category: string;
  Bigimage: string | null;
  imageSmall?: string[] | undefined;
  discount?: number;
  details: { title: string; description: string }[];
  numberFavorite: number;
  numberSale: number;
  date: any;
  colorsName: string[];
  isDiscount: boolean;
  bigimageUrl: string;
  numSearch: number;
  stock: number;
  iniPrice: number;
  isev: boolean;
  smallimageUrl: string[];
  isProduction: boolean;
}

export type CategoryImage = {
  fileName: string;
  link: string;
};

export interface catagoryProps {
  name: string;
  image: CategoryImage;
  numberOfSearches: number;
  brands: string[];
  colors: { name: string; color: string }[];
}

export interface searchProps {
  name: string;
  category: string;
  numSearch: number;
  id: string;
  bigimageUrl?: string;
}

export interface SearchBlogsProps {
  name: string;
  id: string;
  numberOfSearches: number;
  description: string;
  image?: string;
  video?: string;
  type?: "video" | "image";
}

export interface SearchCategoryProps {
  name: string;
  id: string;
  numberOfSearches: number;
  image?: CategoryImage;
}

export interface SearchTeamProps {
  fullName: string;
  id: string;
  numOfSearch: number;
  description: string;
  imageUrl?: string;
}

export interface SearchUserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface BlogProps {
  id?: string;
  title: string;
  description: string;
  video?: string;
  image?: string;
  type: "video" | "image";
  date: Date;
  user: string;
  numberOfLikes: number;
  numberOfDislikes: number;
  numberOfComments: number;
  comments: string[];
  numberOfViews: number;
  numberOffavorites: number;
  numberOfSearches: number;
}

export interface contactUSProps {
  title: string;
  formMessage: string;
  imageUrl: string;
  id?: string;
}

export interface teamProps {
  id?: string;
  fullName: string;
  position: string;
  description: string;
  imageUrl: string;
}

export interface faqProps {
  id?: string;
  questionAndAnswer: { question: string; answer: string }[];
  category: string;
}

export interface blogFavriteProps {
  id: string;
  title: string;
  description: string;
  type: "image" | "video";
  userId: string;
  image?: string;
  video?: string;
  blogId: string;
  numberOffavorites: number;
}

export type UserType = {
  id: string;
  image?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName: string | null;
  username: string;
  emailAddresses?: { emailAddress: string }[];
  primaryEmailAddressId?: string;
};

export interface ItemCartProps {
  name: string;
  id: string;
  discount?: number;
  price: number;
  colors: { name: string; color: string };
  quantity: number;
  image: string;
}

export type OrderType = {
  id?: string;
  userId: string;
  fullName: string;
  lat: number;
  lng: number;
  phoneNumber: string;
  address: {
    streetName: string;
    city: string;
    region: string;
  };
  email: { emailAddress: string }[];
  orderItems: ItemCartProps[];
  orderDate: any;
  totalAmount: number;
  totaldiscountPrice: number;
  note?: string;
  view: boolean;
};

export interface favorite {
  id?: string;
  name: string;
  price: number;
  image: string;
  categroy: string;
  numberFavorite: number;
  colors: {
    name: string;
    color: string;
  }[];
}

export type CommentProps = {
  id: string;
  content: string;
  userId: string;
  fullName: string;
  profileImage: string;
  date: Date;
  likes: string[];
  dislikes: string[];
  replies: ReplyProps[];
};

export type ReplyProps = {
  userId: string;
  content: string;
  fullName: string;
  profileImage: string;
  date: Date;
};
export interface DashboardUser {
  id: string;
  passwordEnabled: boolean;
  totpEnabled: boolean;
  backupCodeEnabled: boolean;
  twoFactorEnabled: boolean;
  banned: boolean;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
  imageUrl: string;
  hasImage: boolean;
  primaryEmailAddressId: string;
  primaryPhoneNumberId: string | null;
  primaryWeb3WalletId: string | null;
  lastSignInAt: number;
  externalId: string | null;
  username: string;
  firstName: string;
  lastName: string;
  publicMetadata: {
    role: string;
    [key: string]: any;
  };
  privateMetadata: {
    [key: string]: any;
  };
  unsafeMetadata: {
    [key: string]: any;
  };
  emailAddresses: {
    id: string;
    emailAddress: string;
    verification: {
      status: string;
      strategy: string;
      externalVerificationRedirectURL: string | null;
      attempts: number | null;
      expireAt: number | null;
      nonce: string | null;
      message: string | null;
    };
    linkedTo: {
      id: string;
      type: string;
    }[];
  }[];
}
