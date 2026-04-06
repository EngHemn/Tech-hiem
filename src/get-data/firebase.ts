import {
  collection,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  limit,
  orderBy,
} from "firebase/firestore";
import { app } from "@/config/firebaseConfig";
import {
  catagoryProps,
  ProductFormInput,
  typeFilter,
  searchProps,
  SearchBlogsProps,
  SearchCategoryProps,
  SearchTeamProps,
  SearchUserProps,
  OrderType,
  contactUSProps,
  BlogProps,
  CategoryImage,
  faqProps,
  favorite,
  NotificationData,
  userProps,
  UserType,
  blogFavriteProps,
} from "@/types";

const db = getFirestore(app);

export const getFireBase = async (dbName: string): Promise<catagoryProps[]> => {
  const q = await getDocs(collection(db, dbName));
  return q.docs.map((item) => item.data() as catagoryProps);
};

export const getProducts = async (
  category: string,
  sortBy?: string,
  filter?: typeFilter
): Promise<ProductFormInput[]> => {
  const conditions: any[] = [];

  if (filter.brand && filter.brand.length > 0) {
    conditions.push(where("brand", "in", filter.brand));
  }

  if (filter.color && filter.color.length > 0) {
    conditions.push(where("colorsName", "array-contains-any", filter.color));
  }

  if (filter.discount === true) conditions.push(where("isDiscount", "==", true));

  if (category !== "") {
    conditions.push(where("category", "==", category));
  }

  conditions.push(where("price", ">=", filter.price[0]));
  conditions.push(where("price", "<=", filter.price[1]));

  const q = query(
    collection(db, "Products"),
    ...conditions,
    orderBy(
      sortBy === "new"
        ? "date"
        : sortBy === "a-z" || sortBy === "z-a"
          ? "name"
          : "price",
      sortBy === "new"
        ? "desc"
        : sortBy === "a-z" || sortBy === "z-a"
          ? sortBy === "a-z"
            ? "asc"
            : "desc"
          : sortBy === "priceA"
            ? "asc"
            : "desc"
    )
  );

  const products: ProductFormInput[] = [];
  const qSnapshot = await getDocs(q);
  qSnapshot.forEach((item) => {
    products.push({
      ...(item.data() as ProductFormInput),
      id: item.id as string,
    });
  });

  return products;
};

export const getproductByCategory = async (
  category: string
): Promise<ProductFormInput[]> => {
  const q = query(
    collection(db, "Products"),
    where("category", "==", category)
  );
  const products: ProductFormInput[] = [];
  const qsanpshot = await getDocs(q);
  qsanpshot.forEach((item) => {
    products.push(item.data() as ProductFormInput);
  });
  return products;
};


export const Search = async (searchValue: string): Promise<searchProps[]> => {
  const querySnapshot = await getDocs(collection(db, "Products"));
  const results: searchProps[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.name.toLowerCase().includes(searchValue.toLowerCase())) {
      results.push({
        name: data.name,
        id: data.id,
        numSearch: data.numSearch,
        category: data.category,
        bigimageUrl: data.bigimageUrl,
      });
    }
  });
  return results;
};

export const SearchBlog = async (
  searchValue: string
): Promise<SearchBlogsProps[]> => {
  const data = await getDocs(collection(db, "blogs"));
  const results: SearchBlogsProps[] = [];
  data.forEach((item) => {
    if (item.data().title.toLowerCase().includes(searchValue.toLowerCase())) {
      results.push({
        id: item.id as string,
        name: item.data().title as string,
        numberOfSearches: item.data().numberOfSearches as number,
        description: item.data().description as string,
        image: item.data().image as string,
        video: item.data().video as string,
        type: item.data().type as "video" | "image",
      });
    }
  });
  return results;
};

export const SearchCategory = async (
  searchValue: string
): Promise<SearchCategoryProps[]> => {
  const data = await getDocs(collection(db, "category"));
  const results: SearchCategoryProps[] = [];
  data.forEach((item) => {
    if (item.data().name.toLowerCase().includes(searchValue.toLowerCase())) {
      results.push({
        id: item.id as string,
        name: item.data().name as string,
        numberOfSearches: item.data().numberOfSearches as number,
        image: item.data().image as CategoryImage,
      });
    }
  });
  return results;
};

export const search_Team = async (
  searchValue: string
): Promise<SearchTeamProps[]> => {
  const data = await getDocs(collection(db, "team"));
  const results: SearchTeamProps[] = [];
  data.forEach((item) => {
    if (item.data().fullName.toLowerCase().includes(searchValue.toLowerCase())) {
      results.push({
        id: item.id as string,
        fullName: item.data().fullName as string,
        numOfSearch: item.data().numOfSearch as number,
        description: item.data().description as string,
        imageUrl: item.data().imageUrl as string,
      });
    }
  });
  return results;
};

export const search_User = async (
  searchValue: string
): Promise<SearchUserProps[]> => {
  const data = await getDocs(collection(db, "user"));
  const results: SearchUserProps[] = [];
  data.forEach((item) => {
    const userData = item.data();
    const fullName =
      userData.fullName ||
      `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
    const email =
      userData.emailAddresses?.[0]?.emailAddress || userData.email || "";

    if (
      fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
      email.toLowerCase().includes(searchValue.toLowerCase()) ||
      userData.username?.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      results.push({
        id: item.id as string,
        name: fullName || "Unknown",
        email: email,
        image: userData.image || userData.imageUrl,
      });
    }
  });
  return results;
};

export const getAllUsers = async (): Promise<userProps[]> => {
  try {
    const usersRef = collection(db, "user");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users as userProps[];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getAllUser = async (): Promise<UserType[]> => {
  try {
    const usersRef = collection(db, "user");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserType),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUserById = async (userId: string): Promise<UserType | null> => {
  try {
    const usersRef = doc(db, "user", userId);
    const usersSnapshot = await getDoc(usersRef);
    const user: UserType = usersSnapshot.data() as UserType;
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const getAllOrders = async (): Promise<OrderType[]> => {
  const getorder = await getDocs(collection(db, "order"));
  const data: OrderType[] = [];
  getorder.forEach((item) =>
    data.push({ ...(item.data() as OrderType), id: item.id })
  );
  return data;
};

export const getOrderById = async (id: string): Promise<OrderType | null> => {
  try {
    const docRef = doc(db, "order", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as OrderType) };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
};

export const getConactUs = async (): Promise<contactUSProps[]> => {
  const results: contactUSProps[] = [];
  const data = await getDocs(collection(db, "ContactUs"));
  data.forEach((item) =>
    results.push({ ...(item.data() as contactUSProps), id: item.id })
  );
  return results;
};

export const getAboutUs = async (): Promise<{
  imageUrl: string;
  description: string;
  descriptions: { title: string; description: string }[];
}> => {
  const data = await getDoc(doc(db, "aboutUs", "about"));
  return data.data() as any;
};

export const getBlog = async (id: string): Promise<BlogProps> => {
  const data = await getDoc(doc(db, "blogs", id));
  return data.data() as BlogProps;
};

export const getBlogs = async (): Promise<BlogProps[]> => {
  const data = await getDocs(collection(db, "blogs"));
  const blogs = data.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    date: doc.data().date ? doc.data().date.toDate() : new Date(),
  })) as BlogProps[];
  return blogs;
};

export const getAllBlogs = getBlogs;

export const getAllFavorite = async () => {
  const userDocs = await getDocs(collection(db, "favorite"));
  let allFavorites = [];
  if (userDocs.empty) return [];
  for (const userDoc of userDocs.docs) {
    const itemsCollectionRef = collection(db, "favorite", userDoc.id, "items");
    const itemsSnapshot = await getDocs(itemsCollectionRef);
    if (itemsSnapshot.empty) continue;
    const userFavorites = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    allFavorites.push(...userFavorites);
  }
  return allFavorites;
};

export const getOrder = async (userid: string): Promise<OrderType[]> => {
  const q = query(collection(db, "order"), where("userId", "==", userid));
  const querySnapshot = await getDocs(q);
  const newProducts: OrderType[] = [];
  querySnapshot.forEach((doc) => {
    newProducts.push({ ...(doc.data() as OrderType), id: doc.id });
  });
  return newProducts;
};

export const getProductsBYDiscountAndCategoryAndSale = async ({
  col,
  category,
  limit: limitParam,
}: {
  col: string;
  category: string;
  limit?: number;
}): Promise<ProductFormInput[]> => {
  let q;
  if (col === "date") {
    q =
      category !== ""
        ? limitParam
          ? query(
              collection(db, "Products"),
              where("category", "==", category),
              orderBy(col, "desc"),
              limit(limitParam)
            )
          : query(
              collection(db, "Products"),
              where("category", "==", category),
              orderBy(col, "desc")
            )
        : limitParam
        ? query(collection(db, "Products"), orderBy(col, "asc"), limit(limitParam))
        : query(collection(db, "Products"), orderBy(col, "asc"));
  } else if (col !== "discount") {
    q =
      category !== ""
        ? limitParam
          ? query(
              collection(db, "Products"),
              where("category", "==", category),
              orderBy(col, "desc"),
              limit(limitParam)
            )
          : query(
              collection(db, "Products"),
              where("category", "==", category),
              orderBy(col, "desc")
            )
        : limitParam
        ? query(collection(db, "Products"), orderBy(col, "desc"), limit(limitParam))
        : query(collection(db, "Products"), orderBy(col, "desc"));
  } else {
    q =
      category !== ""
        ? limitParam
          ? query(
              collection(db, "Products"),
              where("category", "==", category),
              where("isDiscount", "==", true),
              limit(limitParam)
            )
          : query(
              collection(db, "Products"),
              where("category", "==", category),
              where("isDiscount", "==", true)
            )
        : limitParam
        ? query(collection(db, "Products"), where("isDiscount", "==", true), limit(limitParam))
        : query(collection(db, "Products"), where("isDiscount", "==", true));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({
      ...(doc.data() as ProductFormInput),
      id: doc.id,
    }))
    .filter((item) => item.stock > 0 && item.discount > 0);
};

export const getnotification_admin = async () => {
  const data = await query(
    collection(db, "notifications_admin"),
    where("read", "==", false)
  );
  const querySnapshot = await getDocs(data);
  const result: NotificationData[] = [];
  querySnapshot.forEach((item) => {
    result.push({ ...(item.data() as any), id: item.id });
  });
  return result as NotificationData[];
};

export const getBlogById = async (id: string): Promise<BlogProps | null> => {
  const docRef = doc(db, "blogs", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as BlogProps) };
  }
  return null;
};

export const getFAQ = async (): Promise<faqProps[]> => {
  const data = await getDocs(collection(db, "FAQ"));
  const results: faqProps[] = [];
  data.forEach((item) =>
    results.push({ ...(item.data() as faqProps), id: item.id })
  );
  return results;
};

export const getfavorite = async (userId: string): Promise<favorite[]> => {
  try {
    const itemsRef = collection(db, "favorite", userId, "items");
    const querySnapshot = await getDocs(itemsRef);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as favorite),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return [];
  }
};

export const getAllItemNames = async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  try {
    const itemsRef = collection(db, "favorite", userId, "items");
    const querySnapshot = await getDocs(itemsRef);
    const itemNames = querySnapshot.docs.map((doc) => doc.id);
    return itemNames;
  } catch (error) {
    console.error("Error fetching item names:", error);
    return [];
  }
};

export const getallsaveid = async (userId: string): Promise<string[]> => {
  try {
    const itemsRef = collection(db, "saveBlog", userId, "items");
    const querySnapshot = await getDocs(itemsRef);
    const itemNames = querySnapshot.docs.map((doc) => doc.id);
    return itemNames;
  } catch (error) {
    console.error("Error fetching item names:", error);
    return [];
  }
};

export const getAllProducts = async (
  isPrivate: boolean = false,
  isev: boolean = false
): Promise<ProductFormInput[]> => {
  try {
    const collectionName = isPrivate ? "PrivateProducts" : "Products";
    let productsRef = collection(db, collectionName);
    let constraints: any[] = [orderBy("date", "desc")];

    if (isev) {
      constraints.push(where("isev", "==", true));
    }

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as ProductFormInput),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

export const getProductById = async (
  id: string
): Promise<{ product: ProductFormInput | null; isPrivate: boolean }> => {
  try {
    // Try Products collection
    let docRef = doc(db, "Products", id);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        product: { id: docSnap.id, ...(docSnap.data() as ProductFormInput) },
        isPrivate: false,
      };
    }

    // Try PrivateProducts collection
    docRef = doc(db, "PrivateProducts", id);
    docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        product: { id: docSnap.id, ...(docSnap.data() as ProductFormInput) },
        isPrivate: true,
      };
    }

    return { product: null, isPrivate: false };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return { product: null, isPrivate: false };
  }
};

export const getSaveBlog = async (userId: any): Promise<blogFavriteProps[]> => {
  try {
    const itemsRef = collection(db, "saveBlog", userId, "items");
    const querySnapshot = await getDocs(itemsRef);
    const items = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as blogFavriteProps),
      id: doc.id,
    }));
    return items;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return [];
  }
};

export const getAllSaveBlog = async (): Promise<blogFavriteProps[]> => {
  try {
    const itemsRef = collection(db, "saveBlog", "items");
    const querySnapshot = await getDocs(itemsRef);
    const item: blogFavriteProps[] = [];
    querySnapshot.docs.forEach((doc) =>
      item.push({ ...(doc.data() as blogFavriteProps), id: doc.id })
    );
    return item;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return [];
  }
};

export const getPopularProducts = async (orderField: string) => {
  try {
    const productsRef = collection(db, "Products");
    const popularQuery = query(productsRef, orderBy(orderField, "desc"));
    const querySnapshot = await getDocs(popularQuery);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as ProductFormInput[];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    throw error;
  }
};

export const getAllTeam = async (): Promise<SearchTeamProps[]> => {
  const data = await getDocs(collection(db, "team"));
  return data.docs.map((item) => ({
    id: item.id as string,
    fullName: item.data().fullName as string,
    numOfSearch: item.data().numOfSearch as number,
    description: item.data().description as string,
    imageUrl: item.data().imageUrl as string,
  }));
};

export const lang = () => {
  if (typeof window === "undefined") return "en";
  const cookies = document.cookie.split(";");
  const localeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("NEXT_LOCALE=")
  );
  if (localeCookie) {
    const locale = localeCookie.split("=")[1]?.trim();
    if (locale && ["en", "ku", "tr", "ar"].includes(locale)) {
      return locale;
    }
  }
  return "en";
};
